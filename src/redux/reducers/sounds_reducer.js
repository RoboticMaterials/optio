let GET_SOUNDS = "GET_SOUNDS";
let GET_SOUNDS_STARTED = "GET_SOUNDS_STARTED";
let GET_SOUNDS_SUCCESS = "GET_SOUNDS_SUCCESS";
let GET_SOUNDS_FAILURE = "GET_SOUNDS_FAILURE";

const defaultState = {
  sounds: {},
  error: {},
  pending: false,
};

export default function soundsReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_SOUNDS:
      break;

    case GET_SOUNDS_STARTED:
      return Object.assign({}, state, {
        pending: true,
      });

    case GET_SOUNDS_SUCCESS:
      return {
        ...state,
        sounds: action.payload,
        pending: false,
      };

    case GET_SOUNDS_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        pending: false,
      });

    default:
      return state;
      break;
  }
}
