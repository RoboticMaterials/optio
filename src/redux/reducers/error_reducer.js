import { CLEAR_ERROR } from "../types/error_types";
import { clone_object } from "../../methods/utils/utils";

const defaultState = {};

export default function errorReducer(state = defaultState, action) {
  const { type, payload } = action;
  const matches = /(.*)_(STARTED|FAILURE)/.exec(type);

  if (type == CLEAR_ERROR) {
    console.log("clearing error");
    var stateClone = clone_object(state);
    //delete stateClone[]
    return {
      ...state,
      // Store errorMessage
      // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
      //      else clear errorMessage when receiving GET_TODOS_REQUEST
      [payload]: "",
    };
  }

  // not a *_REQUEST / *_FAILURE actions, so we ignore them
  if (!matches) return state;

  const [, requestName, requestState] = matches;
  //console.log('errorReducer matches', matches)
  //console.log('errorReducer requestName', requestName)
  //console.log('errorReducer requestState', requestState)

  return {
    ...state,
    // Store errorMessage
    // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
    //      else clear errorMessage when receiving GET_TODOS_REQUEST
    [requestName]: requestState === "FAILURE" ? payload : "",
  };
}
