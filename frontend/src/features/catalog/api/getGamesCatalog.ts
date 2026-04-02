import { apiGet } from '../../../lib/apiClient';
import type { PageResponse } from '../../../shared/types/pagination';
import type { Game } from '../types/game';

export type GamesCatalogParams = {
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
  signal?: AbortSignal;
};

export async function getGamesCatalog(
  params: GamesCatalogParams = {},
): Promise<PageResponse<Game>> {
  return apiGet<PageResponse<Game>>('/games/catalog', {
    signal: params.signal,
    query: {
      q: params.q?.trim() || undefined,
      page: params.page,
      size: params.size,
      sort: params.sort,
    },
  });
}
