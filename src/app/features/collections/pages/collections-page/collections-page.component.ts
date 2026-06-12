import { Component, computed, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { TMDB_IMAGE_BASE_URL } from '../../../../core/constants/tmdb-api.constants';
import { Collection, CollectionMovie } from '../../../../core/models/collection.models';
import { selectAllCollections } from '../../store/collections.selectors';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [
    RouterLink,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './collections-page.component.html',
  styleUrl: './collections-page.component.scss',
})
export class CollectionsPageComponent {
  private readonly store = inject(Store);

  readonly collections = this.store.selectSignal(selectAllCollections);
  readonly hasCollections = computed(() => this.collections().length > 0);

  thumbnailMovies(collection: Collection): CollectionMovie[] {
    return collection.movies.slice(0, 3);
  }

  movieCount(collection: Collection): number {
    return collection.movies.length;
  }

  posterUrl(posterPath: string | null): string {
    if (!posterPath) {
      return '';
    }

    return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
  }
}
