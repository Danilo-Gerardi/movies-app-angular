import { createReducer, on } from '@ngrx/store';

import { Collection } from '../../../core/models/collection.models';
import { CollectionsActions } from './collections.actions';

export const collectionsFeatureKey = 'collections';

export interface CollectionsState {
  collections: Collection[];
  loading: boolean;
  error: string | null;
}

export const initialCollectionsState: CollectionsState = {
  collections: [],
  loading: false,
  error: null,
};

const upsertCollection = (collections: Collection[], updated: Collection): Collection[] =>
  collections.map((collection) => (collection.id === updated.id ? updated : collection));

export const collectionsReducer = createReducer(
  initialCollectionsState,
  on(CollectionsActions.loadCollections, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CollectionsActions.loadCollectionsSuccess, (state, { collections }) => ({
    ...state,
    collections,
    loading: false,
    error: null,
  })),
  on(CollectionsActions.loadCollectionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(
    CollectionsActions.createCollection,
    CollectionsActions.addMovie,
    CollectionsActions.addMoviesToCollection,
    CollectionsActions.removeMovie,
    CollectionsActions.deleteCollection,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(CollectionsActions.createCollectionSuccess, (state, { collection }) => ({
    ...state,
    collections: [...state.collections, collection],
    loading: false,
    error: null,
  })),
  on(
    CollectionsActions.addMovieSuccess,
    CollectionsActions.addMoviesToCollectionSuccess,
    CollectionsActions.removeMovieSuccess,
    (state, { collection }) => ({
    ...state,
    collections: upsertCollection(state.collections, collection),
    loading: false,
    error: null,
  })),
  on(CollectionsActions.deleteCollectionSuccess, (state, { collectionId }) => ({
    ...state,
    collections: state.collections.filter((collection) => collection.id !== collectionId),
    loading: false,
    error: null,
  })),
  on(
    CollectionsActions.createCollectionFailure,
    CollectionsActions.addMovieFailure,
    CollectionsActions.addMoviesToCollectionFailure,
    CollectionsActions.removeMovieFailure,
    CollectionsActions.deleteCollectionFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);
