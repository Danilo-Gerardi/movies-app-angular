import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CollectionsActions } from '../../store/collections.actions';

@Component({
  selector: 'app-create-collection',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './create-collection.component.html',
  styleUrl: './create-collection.component.scss',
})
export class CreateCollectionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    title: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(80)],
    ],
    description: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(300)],
    ],
  });

  descriptionLength(): number {
    return this.form.controls.description.value.length;
  }

  titleErrorMessage(): string | null {
    const control = this.form.controls.title;

    if (!control.touched && !control.dirty) {
      return null;
    }

    const errors = control.errors;

    if (!errors) {
      return null;
    }

    if (errors['required']) {
      return 'Title is required.';
    }

    if (errors['minlength']) {
      return 'Title must be at least 3 characters.';
    }

    if (errors['maxlength']) {
      return 'Title must be at most 80 characters.';
    }

    return 'Invalid title.';
  }

  descriptionErrorMessage(): string | null {
    const control = this.form.controls.description;

    if (!control.touched && !control.dirty) {
      return null;
    }

    const errors = control.errors;

    if (!errors) {
      return null;
    }

    if (errors['required']) {
      return 'Description is required.';
    }

    if (errors['minlength']) {
      return 'Description must be at least 10 characters.';
    }

    if (errors['maxlength']) {
      return 'Description must be at most 300 characters.';
    }

    return 'Invalid description.';
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.pristine) {
      return;
    }

    const title = this.form.controls.title.value.trim();
    const description = this.form.controls.description.value.trim();

    this.store.dispatch(CollectionsActions.createCollection({ title, description }));
    void this.router.navigate(['/collections']);
  }

  onCancel(): void {
    void this.router.navigate(['/collections']);
  }
}
