import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { Store } from '@ngrx/store';

import { CollectionMovie } from '../../../core/models/collection.models';
import { CollectionsActions } from '../../../features/collections/store/collections.actions';
import { selectAllCollections } from '../../../features/collections/store/collections.selectors';

export interface AddToCollectionDialogData {
  movies: CollectionMovie[];
}

@Component({
  selector: 'app-add-to-collection-dialog',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatDialogModule, MatRadioModule],
  templateUrl: './add-to-collection-dialog.component.html',
})
export class AddToCollectionDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddToCollectionDialogComponent>);
  private readonly store = inject(Store);
  readonly data = inject<AddToCollectionDialogData>(MAT_DIALOG_DATA);

  readonly collections$ = this.store.select(selectAllCollections);
  readonly selectedCollectionId = signal<string | null>(null);

  selectCollection(collectionId: string): void {
    this.selectedCollectionId.set(collectionId);
  }

  confirm(): void {
    const collectionId = this.selectedCollectionId();

    if (!collectionId) {
      return;
    }

    this.store.dispatch(
      CollectionsActions.addMoviesToCollection({
        collectionId,
        movies: this.data.movies,
      }),
    );
    this.dialogRef.close(true);
  }
}
