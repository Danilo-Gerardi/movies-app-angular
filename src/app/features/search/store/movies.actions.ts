import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { TmdbMovieSummary } from '../../../core/models/tmdb.models';

export const MoviesActions = createActionGroup({
  source: 'Movies',
  events: {
    'Search Movies': props<{ query: string; page?: number }>(),
    'Search Movies Success': props<{
      query: string;
      results: TmdbMovieSummary[];
      page: number;
      totalPages: number;
      totalResults: number;
    }>(),
    'Search Movies Failure': props<{ error: string }>(),
    'Load Next Page': emptyProps(),
  },
});
