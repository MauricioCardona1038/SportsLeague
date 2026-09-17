import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import { MatchRequest, MatchResponse } from './match.model';
import { MatchStatus } from '../../shared/enums/match-status.enum';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = `${apiBaseUrl}/Match`;
  }

  getByTournament(tournamentId: number): Observable<MatchResponse[]> {
    return this.http.get<MatchResponse[]>(`${this.baseUrl}/tournament/${tournamentId}`);
  }

  getById(id: number): Observable<MatchResponse> {
    return this.http.get<MatchResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: MatchRequest): Observable<MatchResponse> {
    return this.http.post<MatchResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: MatchRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, status: MatchStatus): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, { status });
  }
}
