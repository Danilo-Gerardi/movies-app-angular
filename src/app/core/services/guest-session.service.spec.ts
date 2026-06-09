import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TmdbApiService } from './tmdb-api.service';
import { GuestSessionService } from './guest-session.service';

describe('GuestSessionService', () => {
  let service: GuestSessionService;
  let tmdbApi: jasmine.SpyObj<TmdbApiService>;

  beforeEach(() => {
    tmdbApi = jasmine.createSpyObj<TmdbApiService>('TmdbApiService', ['getGuestSession']);
    tmdbApi.getGuestSession.and.returnValue(
      of({ success: true, guest_session_id: 'guest-123', expires_at: '2099-01-01' }),
    );

    TestBed.configureTestingModule({
      providers: [GuestSessionService, { provide: TmdbApiService, useValue: tmdbApi }],
    });

    service = TestBed.inject(GuestSessionService);
  });

  it('fetches and caches the guest session id', () => {
    let first = '';
    let second = '';

    service.getSessionId().subscribe((id) => (first = id));
    service.getSessionId().subscribe((id) => (second = id));

    expect(first).toBe('guest-123');
    expect(second).toBe('guest-123');
    expect(tmdbApi.getGuestSession).toHaveBeenCalledTimes(1);
  });
});
