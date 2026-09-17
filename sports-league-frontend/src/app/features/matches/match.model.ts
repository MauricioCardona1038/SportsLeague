import { MatchStatus } from '../../shared/enums/match-status.enum';

export interface MatchResponse {
  id: number;
  tournamentId: number;
  tournamentName: string;
  homeTeamId: number;
  homeTeamName: string;
  awayTeamId: number;
  awayTeamName: string;
  refereeId: number;
  refereeFullName: string;
  matchDate: string;
  venue: string;
  matchday: number;
  status: MatchStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface MatchRequest {
  tournamentId: number;
  homeTeamId: number;
  awayTeamId: number;
  refereeId: number;
  matchDate: string;
  venue: string;
  matchday: number;
}
