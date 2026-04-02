import type { Game } from '../types/game';
import { CompactCard } from './CompactCard';

type GameGridProps = {
  games: Game[];
};

export function GameGrid({ games }: GameGridProps) {
  return (
    <div className="sm-grid">
      {games.map((game) => (
        <CompactCard key={game.id} game={game} />
      ))}
    </div>
  );
}
