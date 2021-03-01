import {
  ON_BLUR,
  ON_FOCUS
} from '../types/keyboard_types';

const defaultState = {

  target: null,
  focused: false,
  showKeyboard: false
};

export default function keyboardReducer(state = defaultState, action) {
  switch (action.type) {

    case ON_FOCUS:
      return  Object.assign({}, state, {
        target: action.target,
        focused: true,
        showKeyboard: true
      });

      case ON_BLUR:
        return  Object.assign({}, state, {
          target: null,
          focused: false,
          showKeyboard: false
        });



    default:
      return state
  }
}
