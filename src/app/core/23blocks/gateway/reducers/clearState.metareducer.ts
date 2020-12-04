import { AuthActionTypes } from '../actions/auth.actions';

export function clearState(reducer) {
  return function (state, action) {
    if (action.type === AuthActionTypes.Logout) {
      console.log('Metareducer - Clear state');
      state = undefined;
    }

    return reducer(state, action);
  };
}
