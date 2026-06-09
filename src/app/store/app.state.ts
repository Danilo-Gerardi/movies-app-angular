import { CollectionsState } from '../features/collections/store/collections.reducer';
import { MoviesState } from '../features/search/store/movies.reducer';

export interface AppState {
  movies: MoviesState;
  collections: CollectionsState;
}
