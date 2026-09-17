import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import { SponsorRequest, SponsorResponse } from './sponsor.model';

@Injectable({ providedIn: 'root' })
export class SponsorService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = `${apiBaseUrl}/Sponsor`;
  }

  getAll(): Observable<SponsorResponse[]> {
    return this.http.get<SponsorResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<SponsorResponse> {
    return this.http.get<SponsorResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: SponsorRequest): Observable<SponsorResponse> {
    return this.http.post<SponsorResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: SponsorRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
