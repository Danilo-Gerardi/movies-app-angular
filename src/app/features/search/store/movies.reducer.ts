import { createReducer, on } from '@ngrx/store';

import { TmdbMovieSummary } from '../../../core/models/tmdb.models';
import { MoviesActions } from './movies.actions';

export const moviesFeatureKey = 'movies';

export interface MoviesState {
  query: string;
  results: TmdbMovieSummary[];
  page: number;
  totalPages: number;
  totalResults: number;
  loading: boolean;
  error: string | null;
}

export const initialMoviesState: MoviesState = {
  query: '',
  results: [],
  page: 0,
  totalPages: 0,
  totalResults: 0,
  loading: false,
  error: null,
};

export const moviesReducer = createReducer(
  initialMoviesState,
  on(MoviesActions.searchMovies, (state, { query, page = 1 }) => ({
    ...state,
    query: page === 1 ? query : state.query,
    page,
    loading: true,
    error: null,
  })),
  on(
    MoviesActions.searchMoviesSuccess,
    (state, { query, results, page, totalPages, totalResults }) => ({
      ...state,
      query,
      results: page === 1 ? results : [...state.results, ...results],
      page,
      totalPages,
      totalResults,
      loading: false,
      error: null,
    }),
  ),
  on(MoviesActions.searchMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
