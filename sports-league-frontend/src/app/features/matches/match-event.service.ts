import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/config/api-config';
import {
  CardRequest,
  CardResponse,
  GoalRequest,
  GoalResponse,
  MatchResultRequest,
  MatchResultResponse,
} from './match-event.model';

// Ruta en minúscula: coincide literal con la ruta de MatchEventController (api/match/{matchId}),
// distinta de "api/Match" (MatchController). ASP.NET es case-insensitive server-side, pero el
// cliente respeta el casing literal de cada controller para no confundir al leer el Network tab.
@Injectable({ providedIn: 'root' })
export class MatchEventService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) apiBaseUrl: string,
  ) {
    this.baseUrl = `${apiBaseUrl}/match`;
  }

  getResult(matchId: number): Observable<MatchResultResponse> {
    return this.http.get<MatchResultResponse>(`${this.baseUrl}/${matchId}/result`);
  }

  saveResult(matchId: number, payload: MatchResultRequest): Observable<MatchResultResponse> {
    return this.http.post<MatchResultResponse>(`${this.baseUrl}/${matchId}/result`, payload);
  }

  getGoals(matchId: number): Observable<GoalResponse[]> {
    return this.http.get<GoalResponse[]>(`${this.baseUrl}/${matchId}/goals`);
  }

  addGoal(matchId: number, payload: GoalRequest): Observable<GoalResponse> {
    return this.http.post<GoalResponse>(`${this.baseUrl}/${matchId}/goals`, payload);
  }

  deleteGoal(matchId: number, goalId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${matchId}/goals/${goalId}`);
  }

  getCards(matchId: number): Observable<CardResponse[]> {
    return this.http.get<CardResponse[]>(`${this.baseUrl}/${matchId}/cards`);
  }

  addCard(matchId: number, payload: CardRequest): Observable<CardResponse> {
    return this.http.post<CardResponse>(`${this.baseUrl}/${matchId}/cards`, payload);
  }

  deleteCard(matchId: number, cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${matchId}/cards/${cardId}`);
  }
}
