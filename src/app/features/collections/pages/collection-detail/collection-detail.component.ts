import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { TMDB_IMAGE_BASE_URL } from '../../../../core/constants/tmdb-api.constants';
import { CollectionMovie } from '../../../../core/models/collection.models';
import { CollectionsActions } from '../../store/collections.actions';
import {
  selectAllCollections,
  selectCollectionsLoading,
} from '../../store/collections.selectors';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.scss',
})
export class CollectionDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  readonly collectionId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly collections = this.store.selectSignal(selectAllCollections);
  readonly loading = this.store.selectSignal(selectCollectionsLoading);

  readonly collection = computed(() => {
    const id = this.collectionId();

    if (!id) {
      return undefined;
    }

    return this.collections().find((item) => item.id === id);
  });

  readonly hasMovies = computed(() => (this.collection()?.movies.length ?? 0) > 0);

  constructor() {
    effect(() => {
      const id = this.collectionId();
      const loading = this.loading();
      const collections = this.collections();

      if (!id || loading) {
        return;
      }

      const exists = collections.some((item) => item.id === id);

      if (!exists) {
        void this.router.navigate(['/collections']);
      }
    });
  }

  posterUrl(movie: CollectionMovie): string {
    if (!movie.posterPath) {
      return '';
    }

    return `${TMDB_IMAGE_BASE_URL}${movie.posterPath}`;
  }

  openMovieDetails(movieId: number): void {
    void this.router.navigate([{ outlets: { dialog: ['movies', movieId] } }], {
      relativeTo: this.route.root,
    });
  }

  removeMovie(movieId: number): void {
    const collectionId = this.collectionId();

    if (!collectionId) {
      return;
    }

    this.store.dispatch(
      CollectionsActions.removeMovie({ collectionId, movieId }),
    );
  }
}
