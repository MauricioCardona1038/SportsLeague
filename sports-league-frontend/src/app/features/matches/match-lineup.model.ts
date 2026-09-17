export interface MatchLineupResponse {
  id: number;
  matchId: number;
  playerId: number;
  playerName: string;
  teamName: string;
  isStarter: boolean;
  position: string;
}

export interface CreateMatchLineupRequest {
  playerId: number;
  isStarter: boolean;
  position: string;
}
