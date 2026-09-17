import { GoalType } from '../../shared/enums/goal-type.enum';
import { CardType } from '../../shared/enums/card-type.enum';

export interface MatchResultRequest {
  homeGoals: number;
  awayGoals: number;
  observations?: string;
}

export interface MatchResultResponse {
  id: number;
  matchId: number;
  homeGoals: number;
  awayGoals: number;
  observations?: string;
  createdAt: string;
}

export interface GoalRequest {
  playerId: number;
  minute: number;
  type: GoalType;
}

export interface GoalResponse {
  id: number;
  matchId: number;
  playerId: number;
  playerName: string;
  minute: number;
  type: GoalType;
  createdAt: string;
}

export interface CardRequest {
  playerId: number;
  minute: number;
  type: CardType;
}

export interface CardResponse {
  id: number;
  matchId: number;
  playerId: number;
  playerName: string;
  minute: number;
  type: CardType;
  createdAt: string;
}
