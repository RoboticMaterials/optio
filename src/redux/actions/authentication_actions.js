import {
  GET_REFRESH_TOKEN,
  GET_REFRESH_TOKEN_STARTED,
  GET_REFRESH_TOKEN_SUCCESS,
  GET_REFRESH_TOKEN_FAILURE,
  POST_REFRESH_TOKEN,
  POST_REFRESH_TOKEN_STARTED,
  POST_REFRESH_TOKEN_SUCCESS,
  POST_REFRESH_TOKEN_FAILURE,
} from "../types/authentication_types";

import * as api from "../../api/authentication_api";

export const getRefreshToken = () => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: GET_REFRESH_TOKEN_STARTED });
    }
    function onSuccess(response) {
      dispatch({ type: GET_REFRESH_TOKEN_SUCCESS, payload: response });
      return response;
    }
    function onError(error) {
      dispatch({ type: GET_REFRESH_TOKEN_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const refreshToken = await api.getRefreshToken();

      return onSuccess(refreshToken);
    } catch (error) {
      return onError(error);
    }
  };
};

export const postRefreshToken = (token) => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: POST_REFRESH_TOKEN_STARTED });
    }
    function onSuccess(token) {
      dispatch({ type: POST_REFRESH_TOKEN_SUCCESS, payload: token });
      return token;
    }
    function onError(error) {
      dispatch({ type: POST_REFRESH_TOKEN_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      await api.postRefreshToken(token);
      return onSuccess(token);
    } catch (error) {
      return onError(error);
    }
  };
};

export const postCognitoUserSession = (JWT) => {
  return { type: "POST_COGNITO_USER_SESSION", payload: JWT };
};
