import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { Collection } from '../models/collection.models';

@Injectable({ providedIn: 'root' })
export class CollectionStorageService {
  private readonly KEY = 'movie_collections';
  private readonly platformId = inject(PLATFORM_ID);

  getAll(): Collection[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const raw = localStorage.getItem(this.KEY);

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

  saveAll(collections: Collection[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.KEY, JSON.stringify(collections));
  }

  clear(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.KEY);
  }
}
