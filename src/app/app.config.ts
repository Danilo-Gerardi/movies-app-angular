import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { CollectionsEffects } from './features/collections/store/collections.effects';
import {
  collectionsFeatureKey,
  collectionsReducer,
} from './features/collections/store/collections.reducer';
import { MoviesEffects } from './features/search/store/movies.effects';
import { moviesFeatureKey, moviesReducer } from './features/search/store/movies.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideStore({
      [moviesFeatureKey]: moviesReducer,
      [collectionsFeatureKey]: collectionsReducer,
    }),
    provideEffects([MoviesEffects, CollectionsEffects]),
  ],
};
