import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CollectionsState, collectionsFeatureKey } from './collections.reducer';

export const selectCollectionsState =
  createFeatureSelector<CollectionsState>(collectionsFeatureKey);

export const selectAllCollections = createSelector(
  selectCollectionsState,
  (state) => state.collections,
);

export const selectCollectionsLoading = createSelector(
  selectCollectionsState,
  (state) => state.loading,
);

export const selectCollectionsError = createSelector(
  selectCollectionsState,
  (state) => state.error,
);

export const selectCollectionById = (collectionId: string) =>
  createSelector(selectAllCollections, (collections) =>
    collections.find((collection) => collection.id === collectionId),
  );
