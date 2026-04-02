type QueryValue = string | number | boolean | null | undefined;

const API_BASE = '/api/catalojogos/v1';

type ApiGetOptions = {
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
};

function buildQueryString(query?: Record<string, QueryValue>): string {
  if (!query) {
    return '';
  }

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}${buildQueryString(options.query)}`;
  const response = await fetch(url, { signal: options.signal });

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados (status ${response.status})`);
  }

  return response.json() as Promise<T>;
}
