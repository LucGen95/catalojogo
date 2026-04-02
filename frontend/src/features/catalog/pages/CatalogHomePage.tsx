import { FeaturedCard } from '../components/FeaturedCard';
import { GameGrid } from '../components/GameGrid';
import { useCatalogHome } from '../hooks/useCatalogHome';
import { BrandLogo } from '../../../shared/ui/BrandLogo';
import { SearchInput } from '../../../shared/ui/SearchInput';
import { SectionHeader } from '../../../shared/ui/SectionHeader';

export function CatalogHomePage() {
  const {
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
  } = useCatalogHome();

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
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar jogos..."
            ariaLabel="Buscar jogos"
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
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Ex: Dandara, Toren, Horizon Chase..."
            ariaLabel="Buscar jogo na home"
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
          <SectionHeader title="Destaques" linkLabel="Ver todos ->" />
          <div className="feat-grid">
            {featuredGames.map((game) => (
              <FeaturedCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      ) : null}

      {recentGames.length > 0 ? (
        <section className="section">
          <SectionHeader title="Lancamentos recentes" linkLabel="Ver mais ->" />
          <GameGrid games={recentGames} />
        </section>
      ) : null}

      <section className="section" id="catalogo">
        <SectionHeader title={latestTitle} linkLabel="Ver todos ->" />
        {loadingSections ? <p className="section-copy">Atualizando resultados...</p> : null}
        {!loadingSections && latestGames.length > 0 ? <GameGrid games={latestGames} /> : null}
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

