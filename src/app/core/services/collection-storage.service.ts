import { Injectable } from '@angular/core';

import { Collection, CollectionMovie } from '../models/collection.models';

const STORAGE_KEY = 'movies-app.collections';

@Injectable({ providedIn: 'root' })
export class CollectionStorageService {
  getAll(): Collection[] {
    return this.readCollections();
  }

  create(title: string, description: string): Collection {
    const collections = this.readCollections();
    const collection: Collection = {
      id: crypto.randomUUID(),
      title,
      description,
      movies: [],
    };

    collections.push(collection);
    this.writeCollections(collections);

    return collection;
  }

  addMovie(collectionId: string, movie: CollectionMovie): Collection {
    const collections = this.readCollections();
    const collection = this.findCollection(collections, collectionId);

    if (!collection.movies.some((item) => item.id === movie.id)) {
      collection.movies.push(movie);
      this.writeCollections(collections);
    }

    return collection;
  }

  removeMovie(collectionId: string, movieId: number): Collection {
    const collections = this.readCollections();
    const collection = this.findCollection(collections, collectionId);

    collection.movies = collection.movies.filter((movie) => movie.id !== movieId);
    this.writeCollections(collections);

    return collection;
  }

  delete(collectionId: string): void {
    const collections = this.readCollections().filter(
      (collection) => collection.id !== collectionId,
    );
    this.writeCollections(collections);
  }

  private readCollections(): Collection[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as Collection[];
    } catch {
      return [];
    }
  }

  private writeCollections(collections: Collection[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }

  private findCollection(collections: Collection[], collectionId: string): Collection {
    const collection = collections.find((item) => item.id === collectionId);

    if (!collection) {
      throw new Error(`Collection not found: ${collectionId}`);
    }

    return collection;
  }
}
