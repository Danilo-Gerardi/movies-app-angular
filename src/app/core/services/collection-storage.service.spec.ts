import { TestBed } from '@angular/core/testing';

import { CollectionMovie } from '../models/collection.models';
import { CollectionStorageService } from './collection-storage.service';

describe('CollectionStorageService', () => {
  let service: CollectionStorageService;

  const movie: CollectionMovie = {
    id: 1,
    title: 'The Matrix',
    posterPath: '/poster.jpg',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionStorageService);
  });

  it('creates and reads collections', () => {
    const created = service.create('Sci-Fi', 'Favorites');

    expect(created.title).toBe('Sci-Fi');
    expect(service.getAll()).toEqual([created]);
  });

  it('adds and removes movies from a collection', () => {
    const collection = service.create('Sci-Fi', 'Favorites');

    service.addMovie(collection.id, movie);
    expect(service.getAll()[0].movies).toEqual([movie]);

    service.removeMovie(collection.id, movie.id);
    expect(service.getAll()[0].movies).toEqual([]);
  });

  it('deletes a collection', () => {
    const collection = service.create('Sci-Fi', 'Favorites');

    service.delete(collection.id);
    expect(service.getAll()).toEqual([]);
  });
});
