import type { Game, PageResponse } from './types';

const API_BASE = '/api/catalojogos/v1';

type GamesCatalogParams = {
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
  signal?: AbortSignal;
};

export async function getGamesCatalog(
  params: GamesCatalogParams = {},
): Promise<PageResponse<Game>> {
  const searchParams = new URLSearchParams();

  if (params.q?.trim()) {
    searchParams.set('q', params.q.trim());
  }
  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params.size !== undefined) {
    searchParams.set('size', String(params.size));
  }
  if (params.sort) {
    searchParams.set('sort', params.sort);
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE}/games/catalog${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, { signal: params.signal });

  if (!response.ok) {
    throw new Error(`Erro ao buscar jogos (status ${response.status})`);
  }

  return response.json();
}
