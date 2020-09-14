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
  
  import { deepCopy } from '../../methods/utils/utils';
  
  
  const defaultState = {
  objects: {},
  selectedObject: null,
  
  error: {},
  pending: false
  };
  
  export default function objectsReducer(state = defaultState, action) {
    let index = ''
    let objectID = ''
    let objectsCopy = deepCopy(state.objects)
  
    switch (action.type) {
  
    // ======================================== //
    //                                          //
    //              Get Objects               //
    //                                          //
    // ======================================== //
        case GET_OBJECTS:
            break;
  
        case GET_OBJECTS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });
  
        case GET_OBJECTS_SUCCESS:
            objectsCopy = deepCopy(action.payload)
            return {
                ...state,
                objects: action.payload,
                pending: false
            }
  
        case GET_OBJECTS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });
  
    // ======================================== //
    //                                          //
    //             Post Objects               //
    //                                          //
    // ======================================== //
  
        case POST_OBJECT:
            break;
  
        case POST_OBJECT_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });
  
        case POST_OBJECT_SUCCESS:
            objectsCopy[action.payload._id.$oid] = action.payload
            return {
                ...state,
                objects: objectsCopy,
                pending: false,
  
            }
  
        case POST_OBJECT_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });
  
    // ======================================== //
    //                                          //
    //             Put Objects                //
    //                                          //
    // ======================================== //
  
        case PUT_OBJECT:
            break;
  
        case PUT_OBJECT_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });
  
        case PUT_OBJECT_SUCCESS:
            objectsCopy[action.payload._id.$oid] = action.payload
  
            return {
                ...state,
                objects: objectsCopy
            }
  
        case PUT_OBJECT_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });
  
        case DELETE_OBJECT:
            break;
  
        case DELETE_OBJECT_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });
  
        case DELETE_OBJECT_SUCCESS:
  
            delete objectsCopy[action.payload]
  
            return {
                ...state,
                objects: objectsCopy
            }
  
        case DELETE_OBJECT_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });
  
        
  
    // ======================================== //
    //                                          //
    //             Objects Utils              //
    //                                          //
    // ======================================== //
  
        case ADD_OBJECT:
            objectsCopy[action.payload.object._id.$oid] = action.payload.object
            return {
                ...state,
                objects: objectsCopy
            }
  
        case UPDATE_OBJECT:
  
            objectsCopy[action.payload.object._id.$oid] = action.payload.object
  
            if (state.selectedObject !== null) {
              return {
                  ...state,
                  objects: objectsCopy,
                  selectedObject: objectsCopy[state.selectedObject._id.$oid]
              }
          } else {
              return {
                  ...state,
                  objects: objectsCopy
              }
          }
  
        case UPDATE_OBJECTS:
            objectsCopy = deepCopy(action.payload.objects)
  
            if (state.selectedObject !== null) {
                return {
                    ...state,
                    objects: deepCopy(action.payload.objects),
                    selectedObject: deepCopy(action.payload.objects[state.selectedObject._id.$oid])
                }
            } else {
                return {
                    ...state,
                    objects: deepCopy(action.payload.objects)
                }
            }
  
        case REMOVE_OBJECT:
            delete objectsCopy[action.payload.id]
  
            return {
                ...state,
                objects: objectsCopy,
            }
            
  
        case SET_OBJECT_ATTRIBUTES:
            Object.assign(objectsCopy[action.payload.id], action.payload.attr)
  
            if (state.selectedObject !== null) {
                return {
                    ...state,
                    objects: objectsCopy,
                    selectedObject: deepCopy(objectsCopy[state.selectedObject._id.$oid])
                }
            } else {
                return {
                    ...state,
                    objects: objectsCopy,
                }
            }
  
  
        case SELECT_OBJECT:
            return {
                ...state,
                selectedObject: objectsCopy[action.payload.id]
            }
  
        case DESELECT_OBJECT:
            return {
                ...state,
                selectedObject: null,
            }
  
        default:
            return state;
    }
  }
  