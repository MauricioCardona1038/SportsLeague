import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import { PlayerRequest, PlayerResponse } from './player.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = `${apiBaseUrl}/Player`;
  }

  getAll(): Observable<PlayerResponse[]> {
    return this.http.get<PlayerResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<PlayerResponse> {
    return this.http.get<PlayerResponse>(`${this.baseUrl}/${id}`);
  }

  getByTeam(teamId: number): Observable<PlayerResponse[]> {
    return this.http.get<PlayerResponse[]>(`${this.baseUrl}/team/${teamId}`);
  }

  create(payload: PlayerRequest): Observable<PlayerResponse> {
    return this.http.post<PlayerResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: PlayerRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
