import {
  GET_SETTINGS,
  GET_SETTINGS_STARTED,
  GET_SETTINGS_SUCCESS,
  GET_SETTINGS_FAILURE,
  POST_SETTINGS,
  POST_SETTINGS_STARTED,
  POST_SETTINGS_SUCCESS,
  POST_SETTINGS_FAILURE,
  DEVICE_ENABLED,
} from "../types/setting_types";

import * as api from "../../api/settings_api";

export const getSettings = () => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: GET_SETTINGS_STARTED });
    }
    function onSuccess(response) {
      dispatch({ type: GET_SETTINGS_SUCCESS, payload: response });

      return response;
    }
    function onError(error) {
      dispatch({ type: GET_SETTINGS_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const settings = await api.getSettings();

      // Uncomment when you want to make SETTINGS an object
      // const normalizedSETTINGS = normalize(SETTINGS, SETTINGSSchema);

      // return onSuccess(normalizedSETTINGS.entities.SETTINGS)

      return onSuccess(settings);
    } catch (error) {
      return onError(error);
    }
  };
};
export const postSettings = (settings) => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: POST_SETTINGS_STARTED });
    }
    function onSuccess(response) {
      dispatch({ type: POST_SETTINGS_SUCCESS, payload: settings });
      return response;
    }
    function onError(error) {
      dispatch({ type: POST_SETTINGS_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const newSettings = await api.postSettings(JSON.stringify(settings));
      return onSuccess(newSettings);
    } catch (error) {
      return onError(error);
    }
  };
};

export const deviceEnabled = (state) => {
  return { type: DEVICE_ENABLED, payload: state };
};
