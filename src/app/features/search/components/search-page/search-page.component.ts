import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { MovieSummary } from '../../../../core/models/collection.models';
import {
  AddToCollectionDialogComponent,
} from '../../../../shared/components/add-to-collection-dialog/add-to-collection-dialog.component';
import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AlphanumericValidatorDirective } from '../../../../shared/directives/alphanumeric-validator.directive';
import { Movie } from '../../../../shared/models/movie.model';
import { MoviesActions } from '../../store/movies.actions';
import {
  selectMoviesError,
  selectMoviesLoading,
  selectMoviesPage,
  selectMoviesQuery,
  selectMoviesResults,
  selectMoviesTotalPages,
} from '../../store/movies.selectors';

class SearchQueryErrorStateMatcher implements ErrorStateMatcher {
  constructor(private readonly shouldShow: () => boolean) {}

  isErrorState(control: AbstractControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return !!control?.invalid && this.shouldShow();
  }
}

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AlphanumericValidatorDirective,
    MovieCardComponent,
    PaginationComponent,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  readonly loading$ = this.store.select(selectMoviesLoading);
  readonly error$ = this.store.select(selectMoviesError);
  readonly results$ = this.store.select(selectMoviesResults);
  readonly page$ = this.store.select(selectMoviesPage);
  readonly totalPages$ = this.store.select(selectMoviesTotalPages);
  readonly query$ = this.store.select(selectMoviesQuery);
  readonly results = this.store.selectSignal(selectMoviesResults);
  readonly errorStateMatcher = new SearchQueryErrorStateMatcher(() =>
    this.shouldShowQueryError(),
  );

  readonly searchForm = this.fb.nonNullable.group({
    query: ['', Validators.required],
  });

  readonly selectionMode = signal(false);
  private readonly selectedMovieIds = signal<ReadonlySet<number>>(new Set());

  readonly selectedCount = computed(() => this.selectedMovieIds().size);
  readonly hasSelection = computed(() => this.selectedCount() > 0);

  readonly selectionBarLabel = computed(() => {
    const count = this.selectedCount();
    const noun = count === 1 ? 'movie' : 'movies';

    return `Add ${count} ${noun} to collection`;
  });

  onSubmit(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.clearSelection();
    this.store.dispatch(
      MoviesActions.searchMovies({
        query: this.searchForm.controls.query.value.trim(),
        page: 1,
      }),
    );
  }

  onPageChange(page: number): void {
    this.clearSelection();

    this.store
      .select(selectMoviesQuery)
      .pipe(take(1))
      .subscribe((query) => {
        if (!query) {
          return;
        }

        this.store.dispatch(MoviesActions.searchMovies({ query, page }));
      });
  }

  toggleSelectionMode(): void {
    this.selectionMode.update((enabled) => !enabled);

    if (!this.selectionMode()) {
      this.clearSelection();
    }
  }

  isSelected(movieId: number): boolean {
    return this.selectedMovieIds().has(movieId);
  }

  toggleMovieSelection(movieId: number): void {
    this.selectedMovieIds.update((ids) => {
      const next = new Set(ids);

      if (next.has(movieId)) {
        next.delete(movieId);
      } else {
        next.add(movieId);
      }

      return next;
    });
  }

  openAddToCollectionDialog(): void {
    const selectedIds = this.selectedMovieIds();
    const movies = this.toMovieSummaries(this.results(), selectedIds);

    if (movies.length === 0) {
      return;
    }

    this.dialog
      .open(AddToCollectionDialogComponent, {
        data: { movies },
        width: '480px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.clearSelection();
          this.selectionMode.set(false);
        }
      });
  }

  shouldShowQueryError(): boolean {
    const control = this.searchForm.controls.query;

    if (!control.errors) {
      return false;
    }

    const isEmpty = !control.value.trim();

    if (isEmpty && control.touched) {
      return false;
    }

    return control.dirty || control.touched;
  }

  queryErrorMessage(): string | null {
    const control = this.searchForm.controls.query;

    if (!this.shouldShowQueryError()) {
      return null;
    }

    const errors = control.errors;
    if (!errors) {
      return null;
    }

    if (errors['required']) {
      return 'Search query is required.';
    }

    if (errors['minlength']) {
      return 'Search query must be at least 3 characters.';
    }

    if (errors['alphanumeric']) {
      return 'Search query must contain only letters, numbers, and spaces.';
    }

    return 'Invalid search query.';
  }

  private clearSelection(): void {
    this.selectedMovieIds.set(new Set());
  }

  private toMovieSummaries(movies: Movie[], selectedIds: ReadonlySet<number>): MovieSummary[] {
    return movies
      .filter((movie) => selectedIds.has(movie.id))
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
      }));
  }
}
