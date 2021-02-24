// TODO: NOT ACTUALLY 'WORKING', COPY AND PASTED FROM DASHBOARDS AND HASNT BEEN UPDATED TO NOTIFICATIONS, BACK END IS NOT SET UP AS OF 8/21/2020

import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_STARTED,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAILURE,
  POST_NOTIFICATIONS,
  POST_NOTIFICATIONS_STARTED,
  POST_NOTIFICATIONS_SUCCESS,
  POST_NOTIFICATIONS_FAILURE,
  PUT_NOTIFICATION,
  PUT_NOTIFICATION_STARTED,
  PUT_NOTIFICATION_SUCCESS,
  PUT_NOTIFICATION_FAILURE,
  DELETE_NOTIFICATION,
  DELETE_NOTIFICATION_STARTED,
  DELETE_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION_FAILURE,
  TOGGLE_NOTIFICATION_TASK_QUEUE,
} from "../types/notifications_types";

import * as api from "../../api/dashboards_api";
import { dashboardsSchema } from "../../normalizr/schema";

export const getDashboards = () => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: GET_NOTIFICATIONS_STARTED });
    }
    function onSuccess(response) {
      dispatch({ type: GET_NOTIFICATIONS_SUCCESS, payload: response });
      return response;
    }
    function onError(error) {
      dispatch({ type: GET_NOTIFICATIONS_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const dashboards = await api.getDashboards();

      const normalizedDashboards = {};
      dashboards.map((dashboard) => {
        normalizedDashboards[dashboard._id.$oid] = dashboard;
      });

      return onSuccess(normalizedDashboards);
      // return onSuccess(dashboards)
    } catch (error) {
      return onError(error);
    }
  };
};
export const postDashboard = (dashboard) => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: POST_NOTIFICATIONS_STARTED });
    }
    function onSuccess(response) {
      dispatch({ type: POST_NOTIFICATIONS_SUCCESS, payload: response });
      return response;
    }
    function onError(error) {
      dispatch({ type: POST_NOTIFICATIONS_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      delete dashboard._id;
      const newDashboard = await api.postDashboards(dashboard);
      return onSuccess(newDashboard);
    } catch (error) {
      return onError(error);
    }
  };
};
export const putDashboard = (dashboard, ID) => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: PUT_NOTIFICATION_STARTED });
    }
    function onSuccess(updatedDashboard) {
      dispatch({ type: PUT_NOTIFICATION_SUCCESS, payload: updatedDashboard });
      return updatedDashboard;
    }
    function onError(error) {
      dispatch({ type: PUT_NOTIFICATION_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      delete dashboard._id;
      const updateDashboard = await api.putDashboards(dashboard, ID);
      return onSuccess(updateDashboard);
    } catch (error) {
      return onError(error);
    }
  };
};
export const deleteDashboard = (ID) => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: DELETE_NOTIFICATION_STARTED });
    }
    function onSuccess(response) {
      dispatch({ type: DELETE_NOTIFICATION_SUCCESS, payload: ID });
      return response;
    }
    function onError(error) {
      dispatch({ type: DELETE_NOTIFICATION_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const removeDashboards = await api.deleteDashboards(ID);
      return onSuccess(ID);
    } catch (error) {
      return onError(error);
    }
  };
};

export const toggleNotificationTaskQueue = (toggle) => {
  return { type: TOGGLE_NOTIFICATION_TASK_QUEUE, payload: toggle };
};
