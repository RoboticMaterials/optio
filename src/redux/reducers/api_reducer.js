import {
  SET_CONDITIONS_API,
  SET_SCHEDULES_API,
  SET_DASHBOARDS_API,
  SET_SKILLS_API,
  SET_DASHBOARD_BUTTONS_API,
  SET_STATUS_API,
  SET_TASK_QUEUE_API,
  SET_TASKS_API
} from '../types/api_types';

import {
  SET
} from "../types/prefixes"

import {
  DATA_PAGE
} from "../types/data_types"

const defaultState = {
  conditionsApi: null,
  schedulesApi: null,
  dashboardsApi: null,
  skillsApi: null,
  dashboardButtonsApi: null,
  statusApi: null,
  taskQueueApi: null,
  tasksApi: null,
  page: null
};

export default function apiReducer(state = defaultState, action) {

  switch (action.type) {

    case SET + DATA_PAGE:
      return {
        ...state,
        page: action.payload,
      }

    case SET_CONDITIONS_API:
      return  Object.assign({}, state, {
        conditionsApi: action.payload,
      });

    case SET_SCHEDULES_API:
      return  Object.assign({}, state, {
        schedulesApi: action.payload,
      });

    case SET_STATUS_API:
      return  Object.assign({}, state, {
        statusApi: action.payload,
      });

    case SET_TASK_QUEUE_API:
      return  Object.assign({}, state, {
        taskQueueApi: action.payload,
      });

    case SET_TASKS_API:
      return  Object.assign({}, state, {
        tasksApi: action.payload,
      });



    default:
      return state
  }
}
