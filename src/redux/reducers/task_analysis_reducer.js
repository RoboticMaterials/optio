import { TASKS, TASK, ANALYSIS } from "../types/tasks_types";

import { GET_, _STARTED, _SUCCESS, _FAILURE } from "../types/api_types";

const defaultState = {
  tasksAnalysis: {},
  taskAnalysis: {},
};

export default function taskAnalysisReducer(state = defaultState, action) {
  switch (action.type) {
    // GET
    // ***************

    // multi
    case GET_ + TASKS + ANALYSIS + _SUCCESS:
      return {
        ...state,
        tasksAnalysis: action.payload,
        pending: false,
      };

    case GET_ + TASKS + ANALYSIS + _FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        pending: false,
      });

    case GET_ + TASKS + ANALYSIS + _STARTED:
      return Object.assign({}, state, {
        pending: true,
      });

    // single
    case GET_ + TASK + ANALYSIS + _SUCCESS:
      return {
        ...state,
        taskAnalysis: action.payload,
        pending: false,
      };

    case GET_ + TASK + ANALYSIS + _FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        pending: false,
      });

    case GET_ + TASK + ANALYSIS + _STARTED:
      return Object.assign({}, state, {
        pending: true,
      });
    // ~~~~~~~~~~~~~~~

    default:
      return state;
  }
}
