import {
  SET_CONDITIONS_API,
  SET_SCHEDULES_API,
  SET_DASHBOARDS_API,
  SET_SKILLS_API,
  SET_DASHBOARD_BUTTONS_API,
  SET_STATUS_API,
  SET_TASK_QUEUE_API,
  SET_TASKS_API,
} from '../types/api_types';

import {
  SET
} from "../types/prefixes"

import {
  DATA_PAGE
} from "../types/data_types"

// set page
// ******************************
export const setDataPage = (page) => {
  return async dispatch => {
    dispatch({ type: SET + DATA_PAGE, payload: page });
  };
};

// setConditionsApi
// ******************************
export const setConditionsApi = (api) => {
  return async dispatch => {
    dispatch({ type: SET_CONDITIONS_API, payload: api });
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// setConditionsApi
// ******************************
export const setSchedulesApi = (api) => {
  return async dispatch => {
    dispatch({ type: SET_SCHEDULES_API, payload: api });
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// setStatusApi
// ******************************
export const setStatusApi = (api) => {
  return async dispatch => {
    dispatch({ type: SET_STATUS_API, payload: api });
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// setTaskQueueApi
// ******************************
export const setTaskQueueApi = (api) => {
  return async dispatch => {
    dispatch({ type: SET_TASK_QUEUE_API, payload: api });
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// setTasksApi
// ******************************
export const setTasksApi = (api) => {
  return async dispatch => {
    dispatch({ type: SET_TASKS_API, payload: api });
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
