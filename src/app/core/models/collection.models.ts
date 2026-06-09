export interface CollectionMovie {
  id: number;
  title: string;
  posterPath: string | null;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  movies: CollectionMovie[];
}
