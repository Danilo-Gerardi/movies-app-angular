import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface MovieDetailsDialogData {
  movieId: number;
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [MatDialogModule],
  template: `<p class="p-4">Movie details for ID {{ data.movieId }}</p>`,
})
export class MovieDetailsComponent {
  readonly data = inject<MovieDetailsDialogData>(MAT_DIALOG_DATA);
}
