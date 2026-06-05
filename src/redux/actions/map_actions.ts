import {
    GET_MAPS,
    GET_MAPS_STARTED,
    GET_MAPS_SUCCESS,
    GET_MAPS_FAILURE,

    GET_MAP,
    GET_MAP_STARTED,
    GET_MAP_SUCCESS,
    GET_MAP_FAILURE,

    POST_MAP_STARTED,
    POST_MAP_SUCCESS,
    POST_MAP_FAILURE,

    DELETE_MAP_STARTED,
    DELETE_MAP_SUCCESS,
    DELETE_MAP_FAILURE,

    SET_MAP_ATTRIBUTES,
    SET_CURRENT_MAP,
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

// post a new map
// ******************************
export const postMap = (mapData) => {
    return async dispatch => {
        function onSuccess(map) {
            dispatch({ type: POST_MAP_SUCCESS, payload: map })
            return map
        }
        function onError(error) {
            dispatch({ type: POST_MAP_FAILURE, payload: error })
            return error
        }
        try {
            dispatch({ type: POST_MAP_STARTED })
            const map = await api.postMap(mapData)
            return onSuccess(map)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete a map
// ******************************
export const deleteMap = (map_id) => {
    return async dispatch => {
        function onSuccess(id) {
            dispatch({ type: DELETE_MAP_SUCCESS, payload: id })
            return id
        }
        function onError(error) {
            dispatch({ type: DELETE_MAP_FAILURE, payload: error })
            return error
        }
        try {
            dispatch({ type: DELETE_MAP_STARTED })
            const id = await api.deleteMap(map_id)
            return onSuccess(id)
        } catch (error) {
            return onError(error)
        }
    }
}
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
