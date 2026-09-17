import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import { CardStatsRow, StandingRow, TopScorerRow } from './standings.model';

// StandingsController tiene [Route("api")]: las rutas no están anidadas bajo un recurso.
@Injectable({ providedIn: 'root' })
export class StandingsService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = apiBaseUrl;
  }

  getStandings(tournamentId: number): Observable<StandingRow[]> {
    return this.http.get<StandingRow[]>(`${this.baseUrl}/standings`, { params: { tournamentId } });
  }

  getTopScorers(tournamentId: number): Observable<TopScorerRow[]> {
    return this.http.get<TopScorerRow[]>(`${this.baseUrl}/stats/scorers`, { params: { tournamentId } });
  }

  getCardStats(tournamentId: number): Observable<CardStatsRow[]> {
    return this.http.get<CardStatsRow[]>(`${this.baseUrl}/stats/cards`, { params: { tournamentId } });
  }
}
