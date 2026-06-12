export interface MovieSummary {
  id: number;
  title: string;
  posterPath: string | null;
}

export type CollectionMovie = MovieSummary;

export interface Collection {
  id: string;
  title: string;
  description: string;
  movies: CollectionMovie[];
}
