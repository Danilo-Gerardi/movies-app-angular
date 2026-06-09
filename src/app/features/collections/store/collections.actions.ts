import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Collection, CollectionMovie } from '../../../core/models/collection.models';

export const CollectionsActions = createActionGroup({
  source: 'Collections',
  events: {
    'Load Collections': emptyProps(),
    'Load Collections Success': props<{ collections: Collection[] }>(),
    'Load Collections Failure': props<{ error: string }>(),
    'Create Collection': props<{ title: string; description: string }>(),
    'Create Collection Success': props<{ collection: Collection }>(),
    'Create Collection Failure': props<{ error: string }>(),
    'Add Movie': props<{ collectionId: string; movie: CollectionMovie }>(),
    'Add Movie Success': props<{ collection: Collection }>(),
    'Add Movie Failure': props<{ error: string }>(),
    'Add Movies To Collection': props<{ collectionId: string; movies: CollectionMovie[] }>(),
    'Add Movies To Collection Success': props<{ collection: Collection }>(),
    'Add Movies To Collection Failure': props<{ error: string }>(),
    'Remove Movie': props<{ collectionId: string; movieId: number }>(),
    'Remove Movie Success': props<{ collection: Collection }>(),
    'Remove Movie Failure': props<{ error: string }>(),
    'Delete Collection': props<{ collectionId: string }>(),
    'Delete Collection Success': props<{ collectionId: string }>(),
    'Delete Collection Failure': props<{ error: string }>(),
  },
});
