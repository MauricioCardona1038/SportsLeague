import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import { RefereeRequest, RefereeResponse } from './referee.model';

@Injectable({ providedIn: 'root' })
export class RefereeService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = `${apiBaseUrl}/Referee`;
  }

  getAll(): Observable<RefereeResponse[]> {
    return this.http.get<RefereeResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<RefereeResponse> {
    return this.http.get<RefereeResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: RefereeRequest): Observable<RefereeResponse> {
    return this.http.post<RefereeResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: RefereeRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
