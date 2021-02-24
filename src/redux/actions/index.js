import { STARTED, SUCCESS, FAILURE } from "../types/suffixes";

export const api_action = async (actionName, callback, dispatch, args) => {
  function onStart() {
    dispatch({ type: actionName + STARTED, payload: args });
  }

  function onSuccess(payload) {
    dispatch({ type: actionName + SUCCESS, payload });
    return payload;
  }

  function onError(error) {
    dispatch({ type: actionName + FAILURE, payload: error });
    return error;
  }

  try {
    onStart();
    const payload = await callback();
    return onSuccess(payload);
  } catch (error) {
    return onError(error);
  }
};
