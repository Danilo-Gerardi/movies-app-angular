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

export interface TmdbSpokenLanguage {
  english_name: string;
  iso_639_1: string;
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
  budget: number;
  revenue: number;
  runtime: number | null;
  genres: TmdbGenre[];
  tagline: string;
  spoken_languages: TmdbSpokenLanguage[];
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
