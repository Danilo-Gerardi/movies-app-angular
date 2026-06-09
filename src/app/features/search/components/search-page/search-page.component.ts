import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { MovieCardComponent } from '../../../../shared/components/movie-card/movie-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AlphanumericValidatorDirective } from '../../../../shared/directives/alphanumeric-validator.directive';
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

  readonly loading$ = this.store.select(selectMoviesLoading);
  readonly error$ = this.store.select(selectMoviesError);
  readonly results$ = this.store.select(selectMoviesResults);
  readonly page$ = this.store.select(selectMoviesPage);
  readonly totalPages$ = this.store.select(selectMoviesTotalPages);
  readonly query$ = this.store.select(selectMoviesQuery);
  readonly errorStateMatcher = new SearchQueryErrorStateMatcher(() =>
    this.shouldShowQueryError(),
  );

  readonly searchForm = this.fb.nonNullable.group({
    query: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(
      MoviesActions.searchMovies({
        query: this.searchForm.controls.query.value.trim(),
        page: 1,
      }),
    );
  }

  onPageChange(page: number): void {
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
}
