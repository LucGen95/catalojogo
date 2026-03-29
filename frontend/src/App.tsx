import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { getGames } from './api';
import type { Game } from './types';

type Palette = {
  from: string;
  to: string;
};

const palettes: Palette[] = [
  { from: '#0c1638', to: '#224d98' },
  { from: '#112b18', to: '#2f7a47' },
  { from: '#34140f', to: '#b05a1f' },
  { from: '#2d1248', to: '#764ba2' },
  { from: '#1d2431', to: '#62748d' },
  { from: '#09384f', to: '#0d7a84' },
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
  if (!value) return 'Data nao informada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatYear(value?: string): string {
  if (!value) return 'Ano nao informado';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return String(date.getFullYear());
}

function truncateText(value?: string, maxLength = 110): string {
  if (!value) return 'Descubra mais detalhes desse jogo quando a ficha completa estiver disponivel.';
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
    ? `linear-gradient(180deg, rgba(9, 14, 27, 0.08), rgba(9, 14, 27, 0.82)), url("${game.cover_url}")`
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
    <svg className="brand-mark" viewBox="0 0 100 100" aria-hidden="true">
      <path fill="#FFDF00" d="M50 10 L90 50 L50 90 L10 50 Z" />
      <circle fill="#002776" cx="50" cy="50" r="28" />
      <g fill="white" opacity="0.92">
        <circle cx="50" cy="45" r="2" />
        <circle cx="55" cy="50" r="1.5" />
        <circle cx="45" cy="50" r="1.5" />
        <circle cx="50" cy="55" r="1.5" />
      </g>
    </svg>
  );
}

function BrandLogo() {
  return (
    <div className="brand-lockup" aria-label="Catalojogo">
      <span>CATAL</span>
      <LogoMark />
      <span>JOGO</span>
    </div>
  );
}

function SectionHeader({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <p className="section-kicker">Catalogo aberto</p>
        <h2>{title}</h2>
      </div>
      {caption ? <p className="section-caption">{caption}</p> : null}
    </div>
  );
}

function FeaturedCard({ game }: { game: Game }) {
  return (
    <article className="featured-card">
      <div className="featured-cover" style={getCoverStyle(game)}>
        <span className="featured-chip">{game.developer?.name || game.publisher?.name || 'Jogo brasileiro'}</span>
      </div>
      <div className="featured-body">
        <div className="featured-meta">
          <span>{game.developer?.name || game.publisher?.name || 'Estudio em destaque'}</span>
          <span>{formatYear(game.releaseDate)}</span>
        </div>
        <h3>{game.title}</h3>
        <p>{truncateText(game.description, 118)}</p>
      </div>
    </article>
  );
}

function CompactCard({ game }: { game: Game }) {
  return (
    <article className="compact-card">
      <div className="compact-cover" style={getCoverStyle(game)} />
      <div className="compact-body">
        <h3>{game.title}</h3>
        <p>{game.developer?.name || game.publisher?.name || 'Catalogo brasileiro'}</p>
      </div>
    </article>
  );
}

function CatalogCard({ game }: { game: Game }) {
  return (
    <article className="catalog-card">
      <div className="catalog-cover" style={getCoverStyle(game)}>
        <span className="catalog-badge">#{game.id}</span>
      </div>
      <div className="catalog-body">
        <div className="catalog-title-row">
          <h3>{game.title}</h3>
          <span>{formatYear(game.releaseDate)}</span>
        </div>
        <p className="catalog-description">{truncateText(game.description, 132)}</p>
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
      </div>
    </article>
  );
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
          const sortedGames = [...data].sort(compareByReleaseDateDesc);
          setGames(sortedGames);
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
      const description = game.description?.toLowerCase() ?? '';

      return (
        title.includes(term) ||
        developer.includes(term) ||
        publisher.includes(term) ||
        description.includes(term)
      );
    });
  }, [games, query]);

  const featuredGames = useMemo(() => filteredGames.slice(0, 3), [filteredGames]);
  const recentGames = useMemo(() => filteredGames.slice(0, 6), [filteredGames]);
  const visibleGames = useMemo(() => filteredGames.slice(0, 12), [filteredGames]);
  const studios = useMemo(() => getStudios(games).slice(0, 12), [games]);
  const studioCount = studios.length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="/" className="brand-anchor" aria-label="Pagina inicial do Catalojogo">
          <BrandLogo />
        </a>

        <nav className="topbar-tabs" aria-label="Navegacao principal">
          <a className="topbar-tab topbar-tab-active" href="/">
            Jogos
          </a>
          <span className="topbar-tab topbar-tab-disabled" title="Disponivel quando o login entrar no ar">
            Minha lista
          </span>
        </nav>

        <div className="topbar-search">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar jogos, estudios ou publishers"
            aria-label="Buscar jogos"
          />
        </div>

        <div className="topbar-actions">
          <button type="button" className="btn btn-ghost" title="Login em breve">
            Entrar
          </button>
          <button type="button" className="btn btn-primary" title="Cadastro em breve">
            Cadastrar
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-eyebrow">Catalogo brasileiro de games</p>
            <h1>Descubra jogos feitos no Brasil sem precisar fazer login primeiro.</h1>
            <p className="hero-text">
              O Catalojogo funciona como um catalogo vivo: voce explora, busca e conhece os titulos livremente.
              Conta so entra quando quiser avaliar, comentar ou montar sua propria lista.
            </p>

            <form className="hero-search" onSubmit={(event) => event.preventDefault()}>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ex: Dandara, Toren, Horizon Chase..."
                aria-label="Buscar jogo na home"
              />
              <button type="submit" className="btn btn-search">
                Buscar jogo
              </button>
            </form>

            <div className="hero-metrics" aria-label="Metricas do catalogo">
              <div>
                <strong>{games.length.toLocaleString('pt-BR')}</strong>
                <span>jogos no catalogo</span>
              </div>
              <div>
                <strong>{studioCount.toLocaleString('pt-BR')}</strong>
                <span>estudios mapeados</span>
              </div>
              <div>
                <strong>{filteredGames.length.toLocaleString('pt-BR')}</strong>
                <span>resultado(s) visivel(is)</span>
              </div>
            </div>
          </div>

          <aside className="hero-aside">
            <div className="hero-panel hero-panel-brand">
              <BrandLogo />
              <p>
                Inspiracao de catalogo social, mas com home util desde o primeiro acesso e foco em jogos brasileiros.
              </p>
            </div>
            <div className="hero-panel-grid">
              <div className="hero-panel">
                <span className="hero-panel-kicker">Navegue livremente</span>
                <p>Busca, vitrine e exploracao abertas para todo mundo.</p>
              </div>
              <div className="hero-panel">
                <span className="hero-panel-kicker">Conta para interagir</span>
                <p>Login fica reservado para nota, comentario e lista pessoal.</p>
              </div>
            </div>
          </aside>
        </section>

        {loading ? <p className="state-card">Carregando jogos do catalogo...</p> : null}
        {error ? <p className="state-card state-card-error">{error}</p> : null}

        {!loading && !error && filteredGames.length === 0 ? (
          <section className="empty-state">
            <SectionHeader
              title="Nenhum jogo encontrado"
              caption="Tente outro termo de busca ou limpe o filtro para ver o catalogo completo."
            />
            <button type="button" className="btn btn-primary" onClick={() => setQuery('')}>
              Limpar busca
            </button>
          </section>
        ) : null}

        {!loading && !error && filteredGames.length > 0 ? (
          <>
            <section className="content-section">
              <SectionHeader
                title="Destaques da home"
                caption="Uma selecao imediata para entrar no clima do catalogo sem depender de login."
              />
              <div className="featured-grid">
                {featuredGames.map((game) => (
                  <FeaturedCard key={game.id} game={game} />
                ))}
              </div>
            </section>

            <section className="content-section">
              <SectionHeader
                title="Mais recentes no radar"
                caption="Titulos ordenados pelos lancamentos mais novos que ja estao no catalogo agora."
              />
              <div className="compact-grid">
                {recentGames.map((game) => (
                  <CompactCard key={game.id} game={game} />
                ))}
              </div>
            </section>

            <section className="content-section">
              <SectionHeader
                title="Estudios e publishers presentes"
                caption="Uma camada de exploracao rapida para o visitante entender quem faz esse mercado girar."
              />
              <div className="chip-row">
                {studios.map((studio) => (
                  <button key={studio} type="button" className="chip" onClick={() => setQuery(studio)}>
                    {studio}
                  </button>
                ))}
              </div>
            </section>

            <section className="content-section">
              <SectionHeader
                title="Explore o catalogo"
                caption={`Mostrando ${visibleGames.length} de ${filteredGames.length} jogo(s) encontrados.`}
              />
              <div className="catalog-grid">
                {visibleGames.map((game) => (
                  <CatalogCard key={game.id} game={game} />
                ))}
              </div>
            </section>

            <section className="content-section content-section-callout">
              <div className="callout-card">
                <div>
                  <p className="section-kicker">Conta quando fizer sentido</p>
                  <h2>Use o site normalmente sem barreira de login.</h2>
                  <p>
                    Quando a autenticacao do front entrar, o login vai servir para dar nota, comentar e montar a
                    propria lista. A descoberta continua aberta para qualquer pessoa.
                  </p>
                </div>
                <div className="callout-actions">
                  <button type="button" className="btn btn-ghost">
                    Entrar
                  </button>
                  <button type="button" className="btn btn-primary">
                    Criar conta
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
