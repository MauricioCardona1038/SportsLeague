import { PlayerPosition } from '../../shared/enums/player-position.enum';

export interface PlayerResponse {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  number: number;
  position: PlayerPosition;
  teamId: number;
  teamName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PlayerRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  number: number;
  position: PlayerPosition;
  teamId: number;
}
