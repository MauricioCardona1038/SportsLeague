import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import { TeamRequest, TeamResponse } from './team.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = `${apiBaseUrl}/Team`;
  }

  getAll(): Observable<TeamResponse[]> {
    return this.http.get<TeamResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<TeamResponse> {
    return this.http.get<TeamResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: TeamRequest): Observable<TeamResponse> {
    return this.http.post<TeamResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: TeamRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
