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
    loadComponent: () =>
      import('./features/collections/collections.page').then((m) => m.CollectionsPage),
  },
  {
    path: 'collections/new',
    loadComponent: () =>
      import('./features/collections/create-collection.page').then((m) => m.CreateCollectionPage),
  },
  {
    path: 'collections/:id',
    loadComponent: () =>
      import('./features/collections/collection-detail.page').then((m) => m.CollectionDetailPage),
  },
  {
    path: 'movies/:id',
    outlet: 'dialog',
    canActivate: [DialogGuard],
    component: MovieDetailsComponent,
  },
];
