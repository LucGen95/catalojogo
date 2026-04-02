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
