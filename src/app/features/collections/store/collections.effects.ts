import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';

import { Collection, CollectionMovie } from '../../../core/models/collection.models';
import { CollectionStorageService } from '../../../core/services/collection-storage.service';
import { CollectionsActions } from './collections.actions';

@Injectable()
export class CollectionsEffects implements OnInitEffects {
  private readonly actions$ = inject(Actions);
  private readonly storage = inject(CollectionStorageService);

  ngrxOnInitEffects(): Action {
    return CollectionsActions.loadCollections();
  }

  loadCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.loadCollections),
      map(() => CollectionsActions.loadCollectionsSuccess({ collections: this.storage.getAll() })),
      catchError((error: unknown) =>
        of(
          CollectionsActions.loadCollectionsFailure({
            error: this.resolveErrorMessage(error),
          }),
        ),
      ),
    ),
  );

  createCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.createCollection),
      switchMap(({ title, description }) => {
        try {
          const collections = this.storage.getAll();
          const collection: Collection = {
            id: crypto.randomUUID(),
            title,
            description,
            movies: [],
          };

          this.storage.saveAll([...collections, collection]);

          return of(CollectionsActions.createCollectionSuccess({ collection }));
        } catch (error: unknown) {
          return of(
            CollectionsActions.createCollectionFailure({
              error: this.resolveErrorMessage(error),
            }),
          );
        }
      }),
    ),
  );

  addMoviesToCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.addMoviesToCollection),
      switchMap(({ collectionId, movies }) => {
        try {
          const collections = this.storage.getAll();
          const collection = collections.find((item) => item.id === collectionId);

          if (!collection) {
            throw new Error(`Collection not found: ${collectionId}`);
          }

          const updatedCollection: Collection = {
            ...collection,
            movies: this.mergeMovies(collection.movies, movies),
          };
          const updatedCollections = collections.map((item) =>
            item.id === collectionId ? updatedCollection : item,
          );

          this.storage.saveAll(updatedCollections);

          return of(CollectionsActions.addMoviesToCollectionSuccess({ collection: updatedCollection }));
        } catch (error: unknown) {
          return of(
            CollectionsActions.addMoviesToCollectionFailure({
              error: this.resolveErrorMessage(error),
            }),
          );
        }
      }),
    ),
  );

  addMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.addMovie),
      switchMap(({ collectionId, movie }) => {
        try {
          const collections = this.storage.getAll();
          const collection = collections.find((item) => item.id === collectionId);

          if (!collection) {
            throw new Error(`Collection not found: ${collectionId}`);
          }

          const updatedCollection: Collection = {
            ...collection,
            movies: this.mergeMovies(collection.movies, [movie]),
          };
          const updatedCollections = collections.map((item) =>
            item.id === collectionId ? updatedCollection : item,
          );

          this.storage.saveAll(updatedCollections);

          return of(CollectionsActions.addMovieSuccess({ collection: updatedCollection }));
        } catch (error: unknown) {
          return of(
            CollectionsActions.addMovieFailure({
              error: this.resolveErrorMessage(error),
            }),
          );
        }
      }),
    ),
  );

  removeMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.removeMovie),
      switchMap(({ collectionId, movieId }) => {
        try {
          const collections = this.storage.getAll();
          const collection = collections.find((item) => item.id === collectionId);

          if (!collection) {
            throw new Error(`Collection not found: ${collectionId}`);
          }

          const updatedCollection: Collection = {
            ...collection,
            movies: collection.movies.filter((movie) => movie.id !== movieId),
          };
          const updatedCollections = collections.map((item) =>
            item.id === collectionId ? updatedCollection : item,
          );

          this.storage.saveAll(updatedCollections);

          return of(CollectionsActions.removeMovieSuccess({ collection: updatedCollection }));
        } catch (error: unknown) {
          return of(
            CollectionsActions.removeMovieFailure({
              error: this.resolveErrorMessage(error),
            }),
          );
        }
      }),
    ),
  );

  deleteCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.deleteCollection),
      switchMap(({ collectionId }) => {
        try {
          const collections = this.storage.getAll();
          const updatedCollections = collections.filter((collection) => collection.id !== collectionId);

          this.storage.saveAll(updatedCollections);

          return of(CollectionsActions.deleteCollectionSuccess({ collectionId }));
        } catch (error: unknown) {
          return of(
            CollectionsActions.deleteCollectionFailure({
              error: this.resolveErrorMessage(error),
            }),
          );
        }
      }),
    ),
  );

  private mergeMovies(existing: CollectionMovie[], incoming: CollectionMovie[]): CollectionMovie[] {
    const merged = [...existing];

    for (const movie of incoming) {
      if (!merged.some((item) => item.id === movie.id)) {
        merged.push(movie);
      }
    }

    return merged;
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Collection operation failed';
  }
}
