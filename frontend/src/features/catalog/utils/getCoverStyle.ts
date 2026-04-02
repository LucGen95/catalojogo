import type { CSSProperties } from 'react';
import type { Game } from '../types/game';

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

export function getCoverStyle(game: Game): CSSProperties {
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
