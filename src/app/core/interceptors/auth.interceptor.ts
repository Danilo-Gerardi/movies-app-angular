import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TMDB_API_HOST, TMDB_API_KEY } from '../constants/tmdb-api.constants';

/** Injects `api_key` on every request to the TMDB domain. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.includes(TMDB_API_HOST)) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setParams: { api_key: TMDB_API_KEY },
      }),
    );
  }
}
