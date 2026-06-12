import { Routes } from '@angular/router';

import { CollectionDetailComponent } from './pages/collection-detail/collection-detail.component';
import { CollectionsPageComponent } from './pages/collections-page/collections-page.component';
import { CreateCollectionComponent } from './pages/create-collection/create-collection.component';

export const collectionsRoutes: Routes = [
  { path: '', component: CollectionsPageComponent },
  { path: 'new', component: CreateCollectionComponent },
  { path: ':id', component: CollectionDetailComponent },
];
