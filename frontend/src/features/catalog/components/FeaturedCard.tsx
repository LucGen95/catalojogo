import type { Game } from '../types/game';
import { getCoverStyle } from '../utils/getCoverStyle';
import { formatDate } from '../utils/formatDate';
import { formatYear } from '../utils/formatYear';

type FeaturedCardProps = {
  game: Game;
};

export function FeaturedCard({ game }: FeaturedCardProps) {
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
