export enum MatchStatus {
  Scheduled = 0,
  InProgress = 1,
  Finished = 2,
  Suspended = 3,
}

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  [MatchStatus.Scheduled]: 'Programado',
  [MatchStatus.InProgress]: 'En curso',
  [MatchStatus.Finished]: 'Finalizado',
  [MatchStatus.Suspended]: 'Suspendido',
};
