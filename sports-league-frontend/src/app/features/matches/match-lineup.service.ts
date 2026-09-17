import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import { CreateMatchLineupRequest, MatchLineupResponse } from './match-lineup.model';

@Injectable({ providedIn: 'root' })
export class MatchLineupService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = `${apiBaseUrl}/match`;
  }

  getLineup(matchId: number): Observable<MatchLineupResponse[]> {
    return this.http.get<MatchLineupResponse[]>(`${this.baseUrl}/${matchId}/lineup`);
  }

  getLineupByTeam(matchId: number, teamId: number): Observable<MatchLineupResponse[]> {
    return this.http.get<MatchLineupResponse[]>(`${this.baseUrl}/${matchId}/lineup/team/${teamId}`);
  }

  addLineupEntry(matchId: number, payload: CreateMatchLineupRequest): Observable<MatchLineupResponse> {
    return this.http.post<MatchLineupResponse>(`${this.baseUrl}/${matchId}/lineup`, payload);
  }

  deleteLineupEntry(matchId: number, lineupId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${matchId}/lineup/${lineupId}`);
  }
}
