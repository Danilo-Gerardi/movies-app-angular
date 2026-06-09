export interface TmdbMovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TmdbSearchMoviesResponse {
  page: number;
  results: TmdbMovieSummary[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  genres: TmdbGenre[];
  tagline: string;
}

export interface TmdbGuestSessionResponse {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
}

export interface TmdbRateMovieRequest {
  value: number;
}

export interface TmdbRateMovieResponse {
  status_code: number;
  status_message: string;
}
