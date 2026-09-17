import { TournamentStatus } from '../../shared/enums/tournament-status.enum';

export interface TournamentResponse {
  id: number;
  name: string;
  season: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  teamsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TournamentRequest {
  name: string;
  season: string;
  startDate: string;
  endDate: string;
}

export interface RegisterTeamRequest {
  teamId: number;
}
