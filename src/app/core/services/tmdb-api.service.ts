import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TMDB_API_BASE_URL } from '../constants/tmdb-api.constants';
import {
  TmdbGuestSessionResponse,
  TmdbMovieDetails,
  TmdbRateMovieRequest,
  TmdbRateMovieResponse,
  TmdbSearchMoviesResponse,
} from '../models/tmdb.models';

@Injectable({ providedIn: 'root' })
export class TmdbApiService {
  private readonly http = inject(HttpClient);

  searchMovies(query: string, page: number): Observable<TmdbSearchMoviesResponse> {
    return this.http.get<TmdbSearchMoviesResponse>(`${TMDB_API_BASE_URL}/search/movie`, {
      params: { query, page: String(page) },
    });
  }

  getMovieDetails(id: number): Observable<TmdbMovieDetails> {
    return this.http.get<TmdbMovieDetails>(`${TMDB_API_BASE_URL}/movie/${id}`);
  }

  getGuestSession(): Observable<TmdbGuestSessionResponse> {
    return this.http.get<TmdbGuestSessionResponse>(
      `${TMDB_API_BASE_URL}/authentication/guest_session/new`,
    );
  }

  rateMovie(id: number, sessionId: string, value: number): Observable<TmdbRateMovieResponse> {
    const body: TmdbRateMovieRequest = { value };

    return this.http.post<TmdbRateMovieResponse>(`${TMDB_API_BASE_URL}/movie/${id}/rating`, body, {
      params: { guest_session_id: sessionId },
    });
  }
}
