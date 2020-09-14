import {
  ON_BLUR,
  ON_FOCUS
} from '../types/keyboard_types';




// focus
// ******************************
export const actions_keyboards_onFocus = (target) => {
  return async dispatch => {
    var payload = {};
    payload.target = target
    dispatch({ type: ON_FOCUS, payload });
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
