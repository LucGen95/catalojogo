import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { getGamesCatalog } from '../api/getGamesCatalog';
import type { Game } from '../types/game';

function getTimestamp(value?: string): number {
  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function compareByReleaseDateDesc(left: Game, right: Game): number {
  return getTimestamp(right.releaseDate) - getTimestamp(left.releaseDate);
}

function getStudios(games: Game[]): string[] {
  const names = new Set<string>();

  games.forEach((game) => {
    if (game.developer?.name) {
      names.add(game.developer.name);
    }

    if (game.publisher?.name) {
      names.add(game.publisher.name);
    }
  });

  return Array.from(names).sort((left, right) => left.localeCompare(right, 'pt-BR'));
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function useCatalogHome() {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [latestGames, setLatestGames] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState(0);
  const [loadingSections, setLoadingSections] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTotalGames() {
      try {
        const page = await getGamesCatalog({
          size: 1,
          sort: 'id,desc',
          signal: controller.signal,
        });
        setTotalGames(page.totalElements);
      } catch (err) {
        if (!isAbortError(err)) {
          setError(err instanceof Error ? err.message : 'Erro inesperado');
        }
      }
    }

    void loadTotalGames();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSections() {
      try {
        setLoadingSections(true);
        const queryValue = deferredQuery.trim() || undefined;
        const [featuredPage, recentPage, latestPage] = await Promise.all([
          getGamesCatalog({ q: queryValue, size: 3, sort: 'releaseDate,desc', signal: controller.signal }),
          getGamesCatalog({ q: queryValue, size: 6, sort: 'releaseDate,desc', signal: controller.signal }),
          getGamesCatalog({ q: queryValue, size: 6, sort: 'id,desc', signal: controller.signal }),
        ]);

        setFeaturedGames(featuredPage.content);
        setRecentGames(recentPage.content);
        setLatestGames(latestPage.content);
        setError(null);
      } catch (err) {
        if (!isAbortError(err)) {
          setError(err instanceof Error ? err.message : 'Erro inesperado');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSections(false);
        }
      }
    }

    void loadSections();

    return () => {
      controller.abort();
    };
  }, [deferredQuery]);

  const homeGames = useMemo(() => {
    const uniqueGames = new Map<number, Game>();

    [...featuredGames, ...recentGames, ...latestGames].forEach((game) => {
      uniqueGames.set(game.id, game);
    });

    return Array.from(uniqueGames.values()).sort(compareByReleaseDateDesc);
  }, [featuredGames, recentGames, latestGames]);

  const studios = useMemo(() => getStudios(homeGames).slice(0, 12), [homeGames]);
  const hasInitialContent = featuredGames.length > 0 || recentGames.length > 0 || latestGames.length > 0;
  const isInitialLoading = !hasInitialContent && loadingSections;
  const latestTitle = deferredQuery.trim() ? 'Resultados mais recentes' : 'Ultimos jogos adicionados';

  return {
    error,
    featuredGames,
    isInitialLoading,
    latestGames,
    latestTitle,
    loadingSections,
    query,
    recentGames,
    setQuery,
    studios,
    totalGames,
  };
}
