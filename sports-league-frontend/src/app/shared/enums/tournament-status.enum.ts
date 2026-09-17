export enum TournamentStatus {
  Pending = 0,
  InProgress = 1,
  Finished = 2,
}

export const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  [TournamentStatus.Pending]: 'Pendiente',
  [TournamentStatus.InProgress]: 'En curso',
  [TournamentStatus.Finished]: 'Finalizado',
};
