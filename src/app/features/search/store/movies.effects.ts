import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';

import { TmdbApiService } from '../../../core/services/tmdb-api.service';
import { MoviesActions } from './movies.actions';
import {
  selectMoviesPage,
  selectMoviesQuery,
  selectMoviesTotalPages,
} from './movies.selectors';

@Injectable()
export class MoviesEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly tmdbApi = inject(TmdbApiService);

  searchMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MoviesActions.searchMovies),
      switchMap(({ query, page = 1 }) =>
        this.tmdbApi.searchMovies(query, page).pipe(
          map((response) =>
            MoviesActions.searchMoviesSuccess({
              query,
              results: response.results,
              page: response.page,
              totalPages: response.total_pages,
              totalResults: response.total_results,
            }),
          ),
          catchError((error: unknown) =>
            of(
              MoviesActions.searchMoviesFailure({
                error: this.resolveErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadNextPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MoviesActions.loadNextPage),
      withLatestFrom(
        this.store.select(selectMoviesQuery),
        this.store.select(selectMoviesPage),
        this.store.select(selectMoviesTotalPages),
      ),
      filter(([, query, page, totalPages]) => query.length > 0 && page > 0 && page < totalPages),
      map(([, query, page]) => MoviesActions.searchMovies({ query, page: page + 1 })),
    ),
  );

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Movie search failed';
  }
}
