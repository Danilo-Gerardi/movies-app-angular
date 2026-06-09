import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { MovieDetailsComponent } from '../../features/movie-details/components/movie-details/movie-details.component';

@Injectable({ providedIn: 'root' })
export class DialogGuard implements CanActivate {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private activeDialog?: MatDialogRef<MovieDetailsComponent>;

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const idParam = route.paramMap.get('id');

    if (!idParam) {
      return false;
    }

    const movieId = Number(idParam);

    if (Number.isNaN(movieId)) {
      return false;
    }

    this.activeDialog?.close();
    this.activeDialog = this.dialog.open(MovieDetailsComponent, {
      data: { movieId },
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '90vh',
    });

    this.activeDialog.afterClosed().subscribe(() => {
      this.activeDialog = undefined;
      void this.router.navigate([{ outlets: { dialog: null } }]);
    });

    return true;
  }
}
