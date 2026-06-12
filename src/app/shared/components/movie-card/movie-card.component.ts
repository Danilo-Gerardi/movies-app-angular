import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';

import { TMDB_IMAGE_BASE_URL } from '../../../core/constants/tmdb-api.constants';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [DecimalPipe, MatCheckboxModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  @Input({ required: true }) movie!: Movie;
  @Input() selectionMode = false;
  @Input() selected = false;
  @Output() selectionToggle = new EventEmitter<void>();

  onCardClick(): void {
    void this.router.navigate([{ outlets: { dialog: ['movies', this.movie.id] } }], {
      relativeTo: this.activatedRoute.root,
    });
  }

  onCheckboxClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onCheckboxToggle(): void {
    this.selectionToggle.emit();
  }

  posterUrl(): string {
    if (!this.movie.poster_path) {
      return '';
    }

    return `${TMDB_IMAGE_BASE_URL}${this.movie.poster_path}`;
  }
}
