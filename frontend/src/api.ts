import type { Game } from './types';

const API_BASE = '/api/catalojogos/v1';

export async function getGames(): Promise<Game[]> {
  const response = await fetch(`${API_BASE}/games`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar jogos (status ${response.status})`);
  }
  return response.json();
}
