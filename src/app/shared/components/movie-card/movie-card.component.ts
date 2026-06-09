import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TMDB_IMAGE_BASE_URL } from '../../../core/constants/tmdb-api.constants';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  private readonly router = inject(Router);

  @Input({ required: true }) movie!: Movie;
  @Output() selected = new EventEmitter<Movie>();

  onCardClick(): void {
    this.selected.emit(this.movie);
    void this.router.navigate([{ outlets: { dialog: ['movies', this.movie.id] } }]);
  }

  posterUrl(): string {
    if (!this.movie.poster_path) {
      return '';
    }

    return `${TMDB_IMAGE_BASE_URL}${this.movie.poster_path}`;
  }
}
