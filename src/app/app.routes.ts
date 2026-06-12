import { Routes } from '@angular/router';

import { DialogGuard } from './core/guards/dialog.guard';
import { MovieDetailsComponent } from './features/movie-details/components/movie-details/movie-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/search/components/search-page/search-page.component').then(
        (m) => m.SearchPageComponent,
      ),
  },
  {
    path: 'collections',
    loadChildren: () =>
      import('./features/collections/collections.routes').then((m) => m.collectionsRoutes),
  },
  {
    path: 'movies/:id',
    outlet: 'dialog',
    canActivate: [DialogGuard],
    component: MovieDetailsComponent,
  },
];
