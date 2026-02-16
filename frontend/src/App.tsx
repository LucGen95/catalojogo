import { useEffect, useMemo, useState } from 'react';
import { getGames } from './api';
import type { Game } from './types';

function formatDate(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadGames() {
      try {
        setLoading(true);
        const data = await getGames();
        if (!cancelled) {
          setGames(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro inesperado');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGames();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredGames = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return games;
    return games.filter((game) => {
      const title = game.title?.toLowerCase() ?? '';
      const developer = game.developer?.name?.toLowerCase() ?? '';
      const publisher = game.publisher?.name?.toLowerCase() ?? '';
      return title.includes(term) || developer.includes(term) || publisher.includes(term);
    });
  }, [games, query]);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Catalogo Brasileiro</p>
        <h1>Catalogo e avaliacao de jogos brasileiros</h1>
        <p className="subtitle">
          Base inicial em React para consumir sua API Spring e acelerar o desenvolvimento do produto.
        </p>
      </header>

      <section className="toolbar">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por titulo, estudio ou publisher"
          aria-label="Buscar jogos"
        />
        <span>{filteredGames.length} jogo(s)</span>
      </section>

      {loading && <p className="state">Carregando jogos...</p>}
      {error && <p className="state error">{error}</p>}

      {!loading && !error && filteredGames.length === 0 && (
        <p className="state">Nenhum jogo encontrado.</p>
      )}

      {!loading && !error && filteredGames.length > 0 && (
        <section className="grid">
          {filteredGames.map((game) => (
            <article key={game.id} className="card">
              <div className="card-header">
                <h2>{game.title}</h2>
                <span>#{game.id}</span>
              </div>
              <p>{game.description || 'Sem descricao cadastrada.'}</p>
              <dl>
                <div>
                  <dt>Lancamento</dt>
                  <dd>{formatDate(game.releaseDate)}</dd>
                </div>
                <div>
                  <dt>Estudio</dt>
                  <dd>{game.developer?.name || '-'}</dd>
                </div>
                <div>
                  <dt>Publisher</dt>
                  <dd>{game.publisher?.name || '-'}</dd>
                </div>
              </dl>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
