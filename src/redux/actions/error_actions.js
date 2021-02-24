import { CLEAR_ERROR } from "../types/error_types";

// setConditionsApi
// ******************************
export const clearError = (actionType) => {
  return async (dispatch) => {
    dispatch({ type: CLEAR_ERROR, payload: actionType });
  };
};
