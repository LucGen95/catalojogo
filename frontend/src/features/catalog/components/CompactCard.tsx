import type { Game } from '../types/game';
import { getCoverStyle } from '../utils/getCoverStyle';
import { formatYear } from '../utils/formatYear';

type CompactCardProps = {
  game: Game;
};

export function CompactCard({ game }: CompactCardProps) {
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
