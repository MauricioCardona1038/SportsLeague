export enum PlayerPosition {
  Goalkeeper = 0,
  Defender = 1,
  Midfielder = 2,
  Forward = 3,
}

export const PLAYER_POSITION_LABELS: Record<PlayerPosition, string> = {
  [PlayerPosition.Goalkeeper]: 'Portero',
  [PlayerPosition.Defender]: 'Defensor',
  [PlayerPosition.Midfielder]: 'Mediocampista',
  [PlayerPosition.Forward]: 'Delantero',
};
