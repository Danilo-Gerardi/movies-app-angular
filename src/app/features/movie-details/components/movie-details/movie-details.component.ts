import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap } from 'rxjs';

import { TMDB_IMAGE_BASE_URL } from '../../../../core/constants/tmdb-api.constants';
import { TmdbMovieDetails } from '../../../../core/models/tmdb.models';
import { GuestSessionService } from '../../../../core/services/guest-session.service';
import { TmdbApiService } from '../../../../core/services/tmdb-api.service';

export interface MovieDetailsDialogData {
  id: number;
}

type RatingFeedback = { type: 'success'; message: string } | { type: 'error'; message: string };

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss',
})
export class MovieDetailsComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef, { optional: true });
  private readonly tmdbApi = inject(TmdbApiService);
  private readonly guestSession = inject(GuestSessionService);
  readonly data = inject<MovieDetailsDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly movie = signal<TmdbMovieDetails | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly selectedRating = signal<number | null>(null);
  readonly hoverRating = signal<number | null>(null);
  readonly ratingInProgress = signal(false);
  readonly ratingFeedback = signal<RatingFeedback | null>(null);

  readonly starIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  ngOnInit(): void {
    if (!this.data?.id) return;
  
    this.tmdbApi.getMovieDetails(this.data.id).subscribe({
      next: (details) => {
        this.movie.set(details);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load movie details. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  posterUrl(): string {
    const posterPath = this.movie()?.poster_path;

    if (!posterPath) {
      return '';
    }

    return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
  }

  spokenLanguages(): string {
    const languages = this.movie()?.spoken_languages ?? [];

    if (languages.length === 0) {
      return 'N/A';
    }

    return languages.map((language) => language.english_name).join(', ');
  }

  displayRating(): number {
    return this.hoverRating() ?? this.selectedRating() ?? 0;
  }

  onStarClick(starIndex: number, event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const isLeftHalf = event.clientX - rect.left < rect.width / 2;
    const value = isLeftHalf ? starIndex - 0.5 : starIndex;

    this.selectedRating.set(value);
    this.ratingFeedback.set(null);
  }

  onStarHover(starIndex: number, event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const isLeftHalf = event.clientX - rect.left < rect.width / 2;
    const value = isLeftHalf ? starIndex - 0.5 : starIndex;

    this.hoverRating.set(value);
  }

  onStarLeave(): void {
    this.hoverRating.set(null);
  }

  starIcon(starIndex: number): string {
    const rating = this.displayRating();

    if (rating >= starIndex) {
      return 'star';
    }

    if (rating >= starIndex - 0.5) {
      return 'star_half';
    }

    return 'star_border';
  }

  confirmRating(): void {
    const value = this.selectedRating();

    if (value === null || this.ratingInProgress()) {
      return;
    }

    this.ratingInProgress.set(true);
    this.ratingFeedback.set(null);

    this.guestSession
      .getSessionId()
      .pipe(switchMap((sessionId) => this.tmdbApi.rateMovie(this.data!.id, sessionId, value)))
      .subscribe({
        next: () => {
          this.ratingInProgress.set(false);
          this.ratingFeedback.set({
            type: 'success',
            message: `Your rating of ${value}/10 was submitted successfully.`,
          });
        },
        error: () => {
          this.ratingInProgress.set(false);
          this.ratingFeedback.set({
            type: 'error',
            message: 'Unable to submit your rating. Please try again.',
          });
        },
      });
  }

  close(): void {
    this.dialogRef?.close();
  }
}
