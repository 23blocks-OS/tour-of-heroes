import { Action } from '@ngrx/store';
import { City } from '../models/city.model';
import { State } from '../models/state.model';

export enum CoreActionTypes {
  CitiesRequested = '[Request Cities] Legge API',
  CitiesLoaded = '[Load Cities] Legge API',
  StatesRequested = '[Request States] Legge API',
  StatesLoaded = '[Load States] Legge API',
}

export class CitiesRequested implements Action {
  readonly type = CoreActionTypes.CitiesRequested;
}

export class CitiesLoaded implements Action {
  readonly type = CoreActionTypes.CitiesLoaded;
  constructor(public payload: { cities: City[] }) { }
}

export class StatesRequested implements Action {
  readonly type = CoreActionTypes.StatesRequested;
}

export class StatesLoaded implements Action {
  readonly type = CoreActionTypes.StatesLoaded;
  constructor(public payload: { states: State[] }) { }
}

export type CoreActions = CitiesRequested | CitiesLoaded | StatesRequested | StatesLoaded ;


