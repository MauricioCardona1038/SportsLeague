export interface StandingRow {
  position: number;
  teamId: number;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TopScorerRow {
  playerId: number;
  playerName: string;
  teamName: string;
  goals: number;
  penalties: number;
  matchesWithGoals: number;
}

export interface CardStatsRow {
  playerId: number;
  playerName: string;
  teamName: string;
  yellowCards: number;
  redCards: number;
  totalCards: number;
}
