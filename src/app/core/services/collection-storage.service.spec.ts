import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Collection } from '../models/collection.models';
import { CollectionStorageService } from './collection-storage.service';

describe('CollectionStorageService', () => {
  let service: CollectionStorageService;

  const collection: Collection = {
    id: 'collection-1',
    title: 'Sci-Fi',
    description: 'Favorites',
    movies: [{ id: 1, title: 'The Matrix', posterPath: '/poster.jpg' }],
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionStorageService);
  });

  it('returns an empty array when storage is empty', () => {
    expect(service.getAll()).toEqual([]);
  });

  it('saves and reads collections', () => {
    service.saveAll([collection]);

    expect(service.getAll()).toEqual([collection]);
  });

  it('returns an empty array when stored JSON is invalid', () => {
    localStorage.setItem('movie_collections', '{invalid-json');

    expect(service.getAll()).toEqual([]);
  });

  it('returns an empty array when stored value is not an array', () => {
    localStorage.setItem('movie_collections', JSON.stringify({ id: 'not-a-collection' }));

    expect(service.getAll()).toEqual([]);
  });

  it('clears stored collections', () => {
    service.saveAll([collection]);
    service.clear();

    expect(service.getAll()).toEqual([]);
    expect(localStorage.getItem('movie_collections')).toBeNull();
  });

  it('does not read or write when not in a browser platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    const serverService = TestBed.inject(CollectionStorageService);

    serverService.saveAll([collection]);
    serverService.clear();

    expect(serverService.getAll()).toEqual([]);
    expect(localStorage.getItem('movie_collections')).toBeNull();
  });
});
