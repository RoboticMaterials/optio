import {
  GET_OBJECTS,
  GET_OBJECTS_STARTED,
  GET_OBJECTS_SUCCESS,
  GET_OBJECTS_FAILURE,

  GET_OBJECT,
  GET_OBJECT_STARTED,
  GET_OBJECT_SUCCESS,
  GET_OBJECT_FAILURE,

  POST_OBJECT,
  POST_OBJECT_STARTED,
  POST_OBJECT_SUCCESS,
  POST_OBJECT_FAILURE,

  PUT_OBJECT,
  PUT_OBJECT_STARTED,
  PUT_OBJECT_SUCCESS,
  PUT_OBJECT_FAILURE,

  DELETE_OBJECT,
  DELETE_OBJECT_STARTED,
  DELETE_OBJECT_SUCCESS,
  DELETE_OBJECT_FAILURE,

  ADD_OBJECT,
  UPDATE_OBJECT,
  UPDATE_OBJECTS,
  REMOVE_OBJECT,
  SET_OBJECT_ATTRIBUTES,
  VALIDATE_OBJECT,
  SELECT_OBJECT,
  SET_SELECTED_OBJECT,
  DESELECT_OBJECT,
} from '../types/objects_types'

import { mapArrayToObjById, deepCopy } from '../../methods/utils/utils';
import { formatScheduleItem } from '../../methods/utils/data_utils';

import * as api from '../../api/objects_api'

// get
// ******************************
export const getObjects = () => {
return async dispatch => {

  function onStart() {
    dispatch({ type: GET_OBJECTS_STARTED });
  }
  function onSuccess(response) {
    dispatch({ type: GET_OBJECTS_SUCCESS, payload: response });
    return response;
  }
  function onError(error) {
    dispatch({ type: GET_OBJECTS_FAILURE, payload: error });
    return error;
  }

  try {
    onStart();
    const objects = await api.getObjects();

    const normalizedObjects = {}
    objects.map((object) => {
        normalizedObjects[object._id.$oid] = object
    })

    return onSuccess(normalizedObjects);
  } catch (error) {
    return onError(error);
  }
};
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get object details
// ******************************
// export const getObject = (object_id) => {
//   return async dispatch => {

//     function onStart() {
//       dispatch({ type: GET_OBJECT_STARTED });
//     }
//     function onSuccess(response) {
//       dispatch({ type: GET_OBJECT_SUCCESS, payload: response });
//       return response;
//     }
//     function onError(error) {
//       dispatch({ type: GET_OBJECT_FAILURE, payload: error });
//       return error;
//     }

//     try {
//       onStart();
//       const object_details = await api.getObject(object_id);
//       return onSuccess(object_details);
//     } catch (error) {
//       return onError(error);
//     }
//   };
// };
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// post
// ******************************
export const postObject = (object) => {
return async dispatch => {

  function onStart() {
    dispatch({ type: POST_OBJECT_STARTED });
  }
  function onSuccess(newObject) {
    dispatch({ type: POST_OBJECT_SUCCESS, payload: newObject });
    return newObject;
  }
  function onError(error) {
    dispatch({ type: POST_OBJECT_FAILURE, payload: error });
    return error;
  }

  try {
    onStart();
    const newObject = await api.postObject(object);
    return onSuccess(newObject);
  } catch (error) {
    return onError(error);
  }
};
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// put
// ******************************
export const putObject = (object, ID) => {
return async dispatch => {
    function onStart() {
        dispatch({ type: PUT_OBJECT_STARTED });
      }
      function onSuccess(updateObject) {
        dispatch({ type: PUT_OBJECT_SUCCESS, payload: updateObject });
        return updateObject;
      }
      function onError(error) {
        dispatch({ type: PUT_OBJECT_FAILURE, payload: error });
        return error;
      }

    try {
        onStart();
        let objectCopy = deepCopy(object)
        delete objectCopy._id
        const updateObject = await api.putObject(objectCopy, ID);
        return onSuccess(updateObject)
    } catch(error) {
        return onError(error)
    }
}
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteObject = (ID) => {
return async dispatch => {
    function onStart() {
        dispatch({ type: DELETE_OBJECT_STARTED });
      }
      function onSuccess(response) {
        dispatch({ type: DELETE_OBJECT_SUCCESS, payload: ID });
        return response;
      }
      function onError(error) {
        dispatch({ type: DELETE_OBJECT_FAILURE, payload: error });
        return error;
      }

    try {
        onStart();
        const removeObject = await api.deleteObject(ID);
        return onSuccess(ID)
    } catch(error) {
        return onError(error)
    }
}
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const addObject = (object) => {
return { type: ADD_OBJECT, payload: {object}}
}

export const updateObject = (object) => {
return { type: UPDATE_OBJECT, payload: {object}}
}

export const updateObjects = (objects) => {
return { type: UPDATE_OBJECTS, payload: {objects}}
}

export const removeObject = (id) => {
return { type: REMOVE_OBJECT, payload: {id}}
}

export const setObjectAttributes = (id, attr) => {
return { type: SET_OBJECT_ATTRIBUTES, payload: {id, attr}}
}

export const selectObject = (id) => {
return { type: SELECT_OBJECT, payload : {id} }
}

export const deselectObject = () => {
return { type: DESELECT_OBJECT }
}
