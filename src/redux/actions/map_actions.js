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
    SET_CURRENT_MAP,
    SET_MAP_ZOOM
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
      return onSuccess(maps.map((currMap) => {
          return {
              ...currMap,
              id: currMap._id
          }
      }));
    } catch (error) {
      return onError(error);
    }
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get map details
// ******************************
export const getMap = (mapId) => {
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
        const map = await api.getMap(mapId);
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

// update map details
// ******************************

export const setCurrentMap = (map) => {
    return dispatch => {
        try {
            dispatch({ type: SET_CURRENT_MAP, payload: map})
            return true
        } catch (error) {
            return error
        }
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
