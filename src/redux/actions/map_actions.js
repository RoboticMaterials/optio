import {
    GET_MAPS,
    GET_MAPS_STARTED,
    GET_MAPS_SUCCESS,
    GET_MAPS_FAILURE,

    GET_MAP,
    GET_MAP_STARTED,
    GET_MAP_SUCCESS,
    GET_MAP_FAILURE,

    SET_MAP_ATTRIBUTES,
} from '../types/map_types'


import * as api from '../../api/map_api'

// get all maps
// ******************************
export const getMaps = () => {
  return async dispatch => {

    function onStart() {
      dispatch({ type: GET_MAPS_STARTED });
    }
    function onSuccess(response) {
      dispatch({ type: GET_MAPS_SUCCESS, payload: response });
      return response;
    }
    function onError(error) {
      dispatch({ type: GET_MAPS_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const maps = await api.getMaps();
      return onSuccess(maps);
    } catch (error) {
      return onError(error);
    }
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get map details
// ******************************
export const getMap = (map_id) => {
    return async dispatch => {
  
      function onStart() {
        dispatch({ type: GET_MAP_STARTED });
      }
      function onSuccess(response) {
        dispatch({ type: GET_MAP_SUCCESS, payload: response });
        return response;
      }
      function onError(error) {
        dispatch({ type: GET_MAP_FAILURE, payload: error });
        return error;
      }
  
      try {
        onStart();
        const map = await api.getMap(map_id);
        return onSuccess(map);
      } catch (error) {
        return onError(error);
      }
    };
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update map details
// ******************************

export const setMapAttributes = (attr) => {
    return dispatch => {
      try {
        dispatch({ type: SET_MAP_ATTRIBUTES, payload: {attr: attr}})
        return true
      } catch (error) {
        return error
      }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~