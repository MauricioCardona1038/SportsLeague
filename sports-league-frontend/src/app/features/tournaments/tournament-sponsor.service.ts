import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import { TournamentSponsorRequest, TournamentSponsorResponse } from './tournament-sponsor.model';

@Injectable({ providedIn: 'root' })
export class TournamentSponsorService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = `${apiBaseUrl}/TournamentSponsor`;
  }

  /**
   * Vincula un patrocinador a un torneo.
   * OJO: la ruta del backend es POST /api/TournamentSponsor/{id}/tournaments donde {id} es el
   * ID DEL PATROCINADOR (no del torneo). El torneo viaja dentro del body.
   */
  linkSponsorToTournament(
    sponsorId: number,
    payload: TournamentSponsorRequest,
  ): Observable<TournamentSponsorResponse> {
    return this.http.post<TournamentSponsorResponse>(`${this.baseUrl}/${sponsorId}/tournaments`, payload);
  }

  /**
   * Desvincula un patrocinador de un torneo.
   * OJO: la ruta del backend NO tiene parámetros de ruta -- ambos ids se leen de la query
   * string, así que deben ir como HttpParams, no como segmentos de ruta.
   */
  unlink(tournamentId: number, sponsorId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl, {
      params: { tournamentId, sponsorId },
    });
  }

  getByTournament(tournamentId: number): Observable<TournamentSponsorResponse[]> {
    return this.http.get<TournamentSponsorResponse[]>(`${this.baseUrl}/tournament/${tournamentId}`);
  }

  getBySponsor(sponsorId: number): Observable<TournamentSponsorResponse[]> {
    return this.http.get<TournamentSponsorResponse[]>(`${this.baseUrl}/sponsor/${sponsorId}`);
  }
}
