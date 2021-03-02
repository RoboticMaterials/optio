import {
    GET_OBJECTS,
    GET_OBJECTS_STARTED,
    GET_OBJECTS_SUCCESS,
    GET_OBJECTS_FAILURE,

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
    SELECT_OBJECT,
    DESELECT_OBJECT,
    SET_ROUTE_OBJECT,
    SET_EDITING_OBJECT,
    SET_SELECTED_OBJECT
} from '../types/objects_types'

import { deepCopy } from '../../methods/utils/utils';


const defaultState = {
    objects: {},
    selectedObject: null,
    editingObject: false,


    error: {},
    pending: false
};

export default function objectsReducer(state = defaultState, action) {
    let objectsCopy = {}

    switch (action.type) {

        // ======================================== //
        //                                          //
        //              Get Objects               //
        //                                          //
        // ======================================== //
        case GET_OBJECTS:
            break;

        case GET_OBJECTS_STARTED:
            return Object.assign({}, state, {
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
            return Object.assign({}, state, {
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
            return Object.assign({}, state, {
                pending: true
            });

        case POST_OBJECT_SUCCESS:
            objectsCopy = deepCopy(state.objects)
            objectsCopy[action.payload._id] = action.payload
            return {
                ...state,
                objects: objectsCopy,
                pending: false,

            }

        case POST_OBJECT_FAILURE:
            return Object.assign({}, state, {
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
            return Object.assign({}, state, {
                pending: true
            });

        case PUT_OBJECT_SUCCESS:
            objectsCopy = deepCopy(state.objects)
            objectsCopy[action.payload._id] = action.payload

            return {
                ...state,
                objects: objectsCopy
            }

        case PUT_OBJECT_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        case DELETE_OBJECT:
            break;

        case DELETE_OBJECT_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case DELETE_OBJECT_SUCCESS:
            objectsCopy = deepCopy(state.objects)
            delete objectsCopy[action.payload]

            return {
                ...state,
                objects: objectsCopy
            }

        case DELETE_OBJECT_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });



        // ======================================== //
        //                                          //
        //             Objects Utils              //
        //                                          //
        // ======================================== //

        case ADD_OBJECT:
            objectsCopy = deepCopy(state.objects)
            objectsCopy[action.payload.object._id] = action.payload.object
            return {
                ...state,
                objects: objectsCopy,
                selectedObject: objectsCopy[action.payload.object._id],
            }

        case UPDATE_OBJECT:
            objectsCopy = deepCopy(state.objects)
            objectsCopy[action.payload.object._id] = action.payload.object

            if (state.selectedObject !== null) {
                return {
                    ...state,
                    objects: objectsCopy,
                    selectedObject: objectsCopy[state.selectedObject._id]
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
                    selectedObject: deepCopy(action.payload.objects[state.selectedObject._id])
                }
            } else {
                return {
                    ...state,
                    objects: deepCopy(action.payload.objects)
                }
            }

        case REMOVE_OBJECT:
            objectsCopy = deepCopy(state.objects)
            delete objectsCopy[action.payload.id]

            return {
                ...state,
                objects: objectsCopy,
            }


        case SET_OBJECT_ATTRIBUTES:

            objectsCopy = deepCopy(state.objects)
            objectsCopy = {
                ...objectsCopy,
                [state.selectedObject._id]: {
                    ...state.selectedObject,
                    ...action.payload,
                }
            }

            // Object.assign(objectsCopy[action.payload.id], action.payload.attr)
            return {
                ...state,
                objects: objectsCopy,
                selectedObject: deepCopy(objectsCopy[state.selectedObject._id])
            }


        case SELECT_OBJECT:
            objectsCopy = deepCopy(state.objects)
            return {
                ...state,
                selectedObject: objectsCopy[action.payload.id]
            }

        case DESELECT_OBJECT:
            return {
                ...state,
                selectedObject: null,
            }

        case SET_SELECTED_OBJECT:
            return {
                ...state,
                selectedObject: action.payload.object
            }

            case SET_ROUTE_OBJECT:
                return {
                    ...state,
                    routeObject: action.payload.object
                }

            case SET_EDITING_OBJECT:
                return {
                    ...state,
                    editingObject: action.payload.bool
                }

        default:
            return state;
    }
}
