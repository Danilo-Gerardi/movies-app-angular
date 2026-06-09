import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MoviesState, moviesFeatureKey } from './movies.reducer';

export const selectMoviesState = createFeatureSelector<MoviesState>(moviesFeatureKey);

export const selectMoviesQuery = createSelector(selectMoviesState, (state) => state.query);

export const selectMoviesResults = createSelector(selectMoviesState, (state) => state.results);

export const selectMoviesPage = createSelector(selectMoviesState, (state) => state.page);

export const selectMoviesTotalPages = createSelector(
  selectMoviesState,
  (state) => state.totalPages,
);

export const selectMoviesTotalResults = createSelector(
  selectMoviesState,
  (state) => state.totalResults,
);

export const selectMoviesLoading = createSelector(selectMoviesState, (state) => state.loading);

export const selectMoviesError = createSelector(selectMoviesState, (state) => state.error);

export const selectHasMoreMoviesPages = createSelector(
  selectMoviesPage,
  selectMoviesTotalPages,
  (page, totalPages) => page > 0 && page < totalPages,
);
