import { Routes } from '@angular/router';

import { DialogGuard } from './core/guards/dialog.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/search/search.page').then((m) => m.SearchPage),
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
    loadComponent: () =>
      import('./features/movie-details/components/dialog-outlet/dialog-outlet.component').then(
        (m) => m.DialogOutletComponent,
      ),
  },
];
