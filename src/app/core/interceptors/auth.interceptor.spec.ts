import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TMDB_API_KEY } from '../constants/tmdb-api.constants';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor],
    });

    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('adds api_key to TMDB requests', () => {
    const request = new HttpRequest('GET', 'https://api.themoviedb.org/3/search/movie');
    const handler: HttpHandler = {
      handle: (req) => {
        expect(req.params.get('api_key')).toBe(TMDB_API_KEY);
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(request, handler).subscribe();
  });

  it('does not modify non-TMDB requests', () => {
    const request = new HttpRequest('GET', 'https://example.com/data');
    const handler: HttpHandler = {
      handle: (req) => {
        expect(req.params.has('api_key')).toBeFalse();
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(request, handler).subscribe();
  });
});
