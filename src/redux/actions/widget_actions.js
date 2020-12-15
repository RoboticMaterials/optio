import * as api from '../../api/sounds_api'

let GET_SOUNDS = 'GET_SOUNDS';
let GET_SOUNDS_STARTED = 'GET_SOUNDS_STARTED';
let GET_SOUNDS_SUCCESS = 'GET_SOUNDS_SUCCESS';
let GET_SOUNDS_FAILURE = 'GET_SOUNDS_FAILURE';



// get
// ******************************
export const getSounds = () => {
  return async dispatch => {

    function onStart() {
      dispatch({ type: GET_SOUNDS_STARTED });
    }
    function onSuccess(response) {
      dispatch({ type: GET_SOUNDS_SUCCESS, payload: response });
      return response;
    }
    function onError(error) {
      dispatch({ type: GET_SOUNDS_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const sounds = await api.getSounds();
      return onSuccess(sounds);
    } catch (error) {
      return onError(error);
    }
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
