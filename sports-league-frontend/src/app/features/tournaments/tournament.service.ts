import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import { TournamentRequest, TournamentResponse } from './tournament.model';
import { TournamentStatus } from '../../shared/enums/tournament-status.enum';
import { TeamResponse } from '../teams/team.model';

@Injectable({ providedIn: 'root' })
export class TournamentService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = `${apiBaseUrl}/Tournament`;
  }

  getAll(): Observable<TournamentResponse[]> {
    return this.http.get<TournamentResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<TournamentResponse> {
    return this.http.get<TournamentResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: TournamentRequest): Observable<TournamentResponse> {
    return this.http.post<TournamentResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: TournamentRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, status: TournamentStatus): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, { status });
  }

  registerTeam(tournamentId: number, teamId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${tournamentId}/teams`, { teamId });
  }

  getTeams(tournamentId: number): Observable<TeamResponse[]> {
    return this.http.get<TeamResponse[]>(`${this.baseUrl}/${tournamentId}/teams`);
  }
}
