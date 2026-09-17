export enum GoalType {
  Normal = 0,
  Penalty = 1,
  OwnGoal = 2,
}

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  [GoalType.Normal]: 'Normal',
  [GoalType.Penalty]: 'Penal',
  [GoalType.OwnGoal]: 'En contra',
};
