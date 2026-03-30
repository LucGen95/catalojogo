import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { getGamesCatalog } from './api';
import type { Game } from './types';

type Palette = {
  from: string;
  to: string;
};

const palettes: Palette[] = [
  { from: '#1a0a3a', to: '#3a1a6a' },
  { from: '#0a1a0a', to: '#1a3a1a' },
  { from: '#2a0a0a', to: '#5a1a0a' },
  { from: '#0a1a2a', to: '#17405f' },
  { from: '#1a0a2a', to: '#523d79' },
  { from: '#2a1a0a', to: '#6b4f20' },
];

function hashCode(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getPalette(seed: string): Palette {
  return palettes[hashCode(seed) % palettes.length];
}

function getTimestamp(value?: string): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatDate(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

function formatYear(value?: string): string {
  if (!value) return 'Ano nao informado';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return String(date.getFullYear());
}

function truncateText(value?: string, maxLength = 110): string {
  if (!value) return 'Sem descricao cadastrada ainda.';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function getStudios(games: Game[]): string[] {
  const names = new Set<string>();

  games.forEach((game) => {
    if (game.developer?.name) names.add(game.developer.name);
    if (game.publisher?.name) names.add(game.publisher.name);
  });

  return Array.from(names).sort((left, right) => left.localeCompare(right, 'pt-BR'));
}

function getCoverStyle(game: Game): CSSProperties {
  const palette = getPalette(`${game.id}-${game.title}`);
  const backgroundImage = game.cover_url
    ? `linear-gradient(180deg, rgba(8, 10, 20, 0.12), rgba(8, 10, 20, 0.45)), url("${game.cover_url}")`
    : `linear-gradient(160deg, ${palette.from}, ${palette.to})`;

  return {
    backgroundImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}

function compareByReleaseDateDesc(left: Game, right: Game): number {
  return getTimestamp(right.releaseDate) - getTimestamp(left.releaseDate);
}

function LogoMark() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path fill="#FFDF00" d="M50 10 L90 50 L50 90 L10 50 Z" />
      <circle fill="#002776" cx="50" cy="50" r="28" />
      <circle cx="50" cy="44" r="2.2" fill="white" />
      <circle cx="56" cy="51" r="1.7" fill="white" />
      <circle cx="44" cy="51" r="1.7" fill="white" />
      <circle cx="50" cy="57" r="1.7" fill="white" />
    </svg>
  );
}

function BrandLogo() {
  return (
    <div className="logo" aria-label="Catalojogo">
      <span>CATAL</span>
      <LogoMark />
      <span>JOGO</span>
    </div>
  );
}

function SectionHeader({
  title,
  linkLabel,
}: {
  title: string;
  linkLabel?: string;
}) {
  return (
    <div className="sec-hd">
      <span className="sec-title">{title}</span>
      {linkLabel ? (
        <a href="#catalogo" className="sec-link">
          {linkLabel}
        </a>
      ) : null}
    </div>
  );
}

function FeaturedCard({ game }: { game: Game }) {
  return (
    <article className="card-lg">
      <div className="cover-lg" style={getCoverStyle(game)}>
        <span className="g-tag">{game.developer?.name || game.publisher?.name || 'Catalogo brasileiro'}</span>
      </div>
      <div className="card-body">
        <p className="card-title">{game.title}</p>
        <p className="card-meta">
          {game.developer?.name || game.publisher?.name || 'Estudio brasileiro'} · {formatYear(game.releaseDate)}
        </p>
        <div className="card-rating">
          <span className="rnum">Lancamento:</span>
          <span>{formatDate(game.releaseDate)}</span>
        </div>
      </div>
    </article>
  );
}

function CompactCard({ game }: { game: Game }) {
  return (
    <article className="card-sm">
      <div className="cover-sm" style={getCoverStyle(game)} />
      <div className="card-body-sm">
        <p className="card-title-sm">{game.title}</p>
        <p className="rating-sm">{game.developer?.name || game.publisher?.name || formatYear(game.releaseDate)}</p>
      </div>
    </article>
  );
}

export default function App() {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [latestGames, setLatestGames] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState(0);
  const [loadingSections, setLoadingSections] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let cancelled = false;

    async function loadTotalGames() {
      try {
        const page = await getGamesCatalog({ size: 1, sort: 'id,desc' });

        if (!cancelled) {
          setTotalGames(page.totalElements);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro inesperado');
        }
      }
    }

    loadTotalGames();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSections() {
      try {
        setLoadingSections(true);
        const queryValue = deferredQuery.trim() || undefined;
        const [featuredPage, recentPage, latestPage] = await Promise.all([
          getGamesCatalog({ q: queryValue, size: 3, sort: 'releaseDate,desc' }),
          getGamesCatalog({ q: queryValue, size: 6, sort: 'releaseDate,desc' }),
          getGamesCatalog({ q: queryValue, size: 6, sort: 'id,desc' }),
        ]);

        if (!cancelled) {
          setFeaturedGames(featuredPage.content);
          setRecentGames(recentPage.content);
          setLatestGames(latestPage.content);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro inesperado');
        }
      } finally {
        if (!cancelled) {
          setLoadingSections(false);
        }
      }
    }

    loadSections();
    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  const homeGames = useMemo(() => {
    const uniqueGames = new Map<number, Game>();
    [...featuredGames, ...recentGames, ...latestGames].forEach((game) => {
      uniqueGames.set(game.id, game);
    });
    return Array.from(uniqueGames.values());
  }, [featuredGames, recentGames, latestGames]);

  const studios = useMemo(() => getStudios(homeGames).slice(0, 12), [homeGames]);
  const hasInitialContent = featuredGames.length > 0 || recentGames.length > 0 || latestGames.length > 0;
  const isInitialLoading = !hasInitialContent && loadingSections;
  const latestTitle = deferredQuery.trim() ? 'Resultados mais recentes' : 'Ultimos jogos adicionados';

  return (
    <div className="app-shell">
      <nav className="nav">
        <a href="/" className="logo-link" aria-label="Pagina inicial do Catalojogo">
          <BrandLogo />
        </a>

        <div className="nav-tabs">
          <a href="/" className="nav-tab active">
            Jogos
          </a>
          <span className="nav-tab disabled" title="Faca login para acessar">
            Minha lista
          </span>
        </div>

        <div className="nav-search">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar jogos..."
            aria-label="Buscar jogos"
          />
        </div>

        <div className="spacer" />

        <div className="nav-actions">
          <button className="btn-ghost-dark" type="button" title="Login em breve">
            Entrar
          </button>
          <button className="btn-primary" type="button" title="Cadastro em breve">
            Cadastrar
          </button>
        </div>
      </nav>

      <header className="hero">
        <h1>O catalogo dos jogos brasileiros</h1>
        <p>Descubra, explore e acompanhe jogos feitos no Brasil sem precisar fazer login primeiro.</p>
        <form className="hero-search" onSubmit={(event) => event.preventDefault()}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex: Dandara, Toren, Horizon Chase..."
            aria-label="Buscar jogo na home"
          />
          <button type="submit">Buscar jogo</button>
        </form>
        <p className="hero-count">
          <strong>{totalGames.toLocaleString('pt-BR')} jogos</strong> no catalogo
        </p>
      </header>

      {isInitialLoading ? <p className="state">Carregando jogos...</p> : null}
      {error ? <p className="state error">{error}</p> : null}

      {!loadingSections && !error && latestGames.length === 0 ? (
        <section className="section">
          <SectionHeader title="Nenhum jogo encontrado" />
          <p className="section-copy">Tente outro termo ou limpe a busca para voltar ao catalogo completo.</p>
          <button className="btn-primary" type="button" onClick={() => setQuery('')}>
            Limpar busca
          </button>
        </section>
      ) : null}

      {featuredGames.length > 0 ? (
        <section className="section">
          <SectionHeader title="Destaques" linkLabel="Ver todos →" />
          <div className="feat-grid">
            {featuredGames.map((game) => (
              <FeaturedCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      ) : null}

      {recentGames.length > 0 ? (
        <section className="section">
          <SectionHeader title="Lancamentos recentes" linkLabel="Ver mais →" />
          <div className="sm-grid">
            {recentGames.map((game) => (
              <CompactCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section" id="catalogo">
        <SectionHeader title={latestTitle} linkLabel="Ver todos →" />
        {loadingSections ? <p className="section-copy">Atualizando resultados...</p> : null}
        {!loadingSections && latestGames.length > 0 ? (
          <div className="sm-grid">
            {latestGames.map((game) => (
              <CompactCard key={game.id} game={game} />
            ))}
          </div>
        ) : null}
      </section>

      {studios.length > 0 ? (
        <section className="section">
          <SectionHeader title="Estudios e publishers" />
          <div className="genre-row">
            {studios.map((studio) => (
              <button key={studio} className="chip" type="button" onClick={() => setQuery(studio)}>
                {studio}
              </button>
            ))}
          </div>

          <div className="nudge">
            <span>Quer dar notas e criar sua lista? Vai dar para fazer isso quando o login entrar no ar.</span>
            <div className="nudge-btns">
              <button className="btn-ghost" type="button">
                Entrar
              </button>
              <button className="btn-primary" type="button">
                Cadastrar
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
