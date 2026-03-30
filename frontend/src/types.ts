export type Company = {
  id: number;
  name: string;
};

export type Game = {
  id: number;
  title: string;
  description?: string;
  releaseDate?: string;
  developer?: Company;
  publisher?: Company;
  cover_url?: string;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
