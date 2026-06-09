import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';

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
          const collection = this.storage.create(title, description);
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

  addMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsActions.addMovie),
      switchMap(({ collectionId, movie }) => {
        try {
          const collection = this.storage.addMovie(collectionId, movie);
          return of(CollectionsActions.addMovieSuccess({ collection }));
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
          const collection = this.storage.removeMovie(collectionId, movieId);
          return of(CollectionsActions.removeMovieSuccess({ collection }));
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
      tap(({ collectionId }) => this.storage.delete(collectionId)),
      map(({ collectionId }) => CollectionsActions.deleteCollectionSuccess({ collectionId })),
      catchError((error: unknown) =>
        of(
          CollectionsActions.deleteCollectionFailure({
            error: this.resolveErrorMessage(error),
          }),
        ),
      ),
    ),
  );

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Collection operation failed';
  }
}
