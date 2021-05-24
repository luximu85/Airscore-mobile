export type TurnpointType =  TurnpointEnum.TAKE_OFF | TurnpointEnum.SSS | TurnpointEnum.ESS | TurnpointEnum.CYLINDER | TurnpointEnum.GOAL;
export type GoalType = 'line' | 'cylinder';

export enum TurnpointEnum {
  TAKE_OFF = 'take-off',
  SSS = 'sss',
  ESS = 'ess',
  CYLINDER = 'cylinder',
  GOAL = 'goal',
}
