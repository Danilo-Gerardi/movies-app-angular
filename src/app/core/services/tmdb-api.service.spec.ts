import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TMDB_API_BASE_URL } from '../constants/tmdb-api.constants';
import { TmdbApiService } from './tmdb-api.service';

describe('TmdbApiService', () => {
  let service: TmdbApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TmdbApiService],
    });

    service = TestBed.inject(TmdbApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('searches movies', () => {
    let responsePage = 0;
    service.searchMovies('matrix', 1).subscribe((response) => (responsePage = response.page));

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${TMDB_API_BASE_URL}/search/movie` &&
        request.params.get('query') === 'matrix' &&
        request.params.get('page') === '1',
    );

    req.flush({ page: 1, results: [], total_pages: 0, total_results: 0 });
    expect(responsePage).toBe(1);
  });

  it('gets movie details', () => {
    let movieId = 0;
    service.getMovieDetails(42).subscribe((response) => (movieId = response.id));

    const req = httpMock.expectOne(`${TMDB_API_BASE_URL}/movie/42`);
    req.flush({ id: 42 });
    expect(movieId).toBe(42);
  });

  it('gets guest session', () => {
    let sessionId = '';
    service.getGuestSession().subscribe((response) => (sessionId = response.guest_session_id));

    const req = httpMock.expectOne(`${TMDB_API_BASE_URL}/authentication/guest_session/new`);
    req.flush({ success: true, guest_session_id: 'abc', expires_at: '2099-01-01' });
    expect(sessionId).toBe('abc');
  });

  it('rates a movie', () => {
    service.rateMovie(42, 'session-1', 8).subscribe();

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${TMDB_API_BASE_URL}/movie/42/rating` &&
        request.params.get('guest_session_id') === 'session-1',
    );

    expect(req.request.body).toEqual({ value: 8 });
    req.flush({ status_code: 1, status_message: 'Success' });
  });
});
