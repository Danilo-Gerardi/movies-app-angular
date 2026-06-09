import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { TmdbApiService } from './tmdb-api.service';

@Injectable({ providedIn: 'root' })
export class GuestSessionService {
  private readonly tmdbApi = inject(TmdbApiService);
  private sessionId$?: Observable<string>;

  getSessionId(): Observable<string> {
    if (!this.sessionId$) {
      this.sessionId$ = this.tmdbApi.getGuestSession().pipe(
        map((response) => response.guest_session_id),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }

    return this.sessionId$;
  }
}
