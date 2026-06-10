import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { MovieDetailsComponent } from '../../features/movie-details/components/movie-details/movie-details.component';

@Injectable({ providedIn: 'root' })
export class DialogGuard implements CanActivate {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private activeDialog?: MatDialogRef<MovieDetailsComponent>;
  private routerMonitoringStarted = false;

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const idParam = route.paramMap.get('id');

    if (!idParam) {
      return false;
    }

    const id = Number(idParam);

    if (Number.isNaN(id)) {
      return false;
    }

    this.ensureRouterMonitoring();
    this.activeDialog?.close();
    this.activeDialog = this.dialog.open(MovieDetailsComponent, {
      data: { id },
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '90vh',
    });

    this.activeDialog.afterClosed().subscribe(() => {
      this.activeDialog = undefined;

      if (this.hasActiveDialogOutlet()) {
        void this.router.navigate([{ outlets: { dialog: null } }]);
      }
    });

    return true;
  }

  private ensureRouterMonitoring(): void {
    if (this.routerMonitoringStarted) {
      return;
    }

    this.routerMonitoringStarted = true;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.hasActiveDialogOutlet() && this.activeDialog) {
          this.activeDialog.close();
        }
      });
  }

  private hasActiveDialogOutlet(): boolean {
    return this.router.url.includes('dialog:movies');
  }
}
