import { normalize, schema } from "normalizr";

import { TASKS, TASK, ANALYSIS } from "../types/tasks_types";

import { GET_, _STARTED, _SUCCESS, _FAILURE } from "../types/api_types";

import * as api from "../../api/task_analysis_api";

import { tasksAnalysisSchema } from "../../normalizr/schema";

// get
// ******************************
export const getTasksAnalysis = () => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: GET_ + TASKS + ANALYSIS + _STARTED });
    }
    function onSuccess(tasksAnalysis) {
      dispatch({
        type: GET_ + TASKS + ANALYSIS + _SUCCESS,
        payload: tasksAnalysis,
      });
      return tasksAnalysis;
    }
    function onError(error) {
      dispatch({ type: GET_ + TASKS + ANALYSIS + _FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const tasksAnalysis = await api.getTasksAnalysis();
      const schema = normalize(tasksAnalysis, tasksAnalysisSchema);
      return onSuccess(schema.entities.taskAnalysis);
    } catch (error) {
      return onError(error);
    }
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get
// ******************************
export const getTaskAnalysis = (id) => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: GET_ + TASK + ANALYSIS + _STARTED });
    }
    function onSuccess(taskAnalysis) {
      dispatch({
        type: GET_ + TASK + ANALYSIS + _SUCCESS,
        payload: taskAnalysis,
      });
      return taskAnalysis;
    }
    function onError(error) {
      dispatch({ type: GET_ + TASK + ANALYSIS + _FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const taskAnalysis = await api.getTaskAnalysis(id);

      return onSuccess(taskAnalysis);
    } catch (error) {
      return onError(error);
    }
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
