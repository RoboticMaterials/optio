// @ts-nocheck
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

import { deepCopy } from '../../methods/utils/utils'

const defaultState = {
    maps: [],
    currentMap: {},

    error: {},
    pending: false,
    reduxZoom: 2
};

export default function mapReducer(state=defaultState, action) {
    let currentMapCopy = {}

    switch (action.type) {

        // ======================================== //
        //                                          //
        //              Get All Maps                //
        //                                          //
        // ======================================== //

        case GET_MAPS:
            break;

        case GET_MAPS_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

        case GET_MAPS_SUCCESS:
            return  {
                ...state,
                maps: action.payload,
                pending: false
            }

        case GET_MAPS_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ======================================== //
        //                                          //
        //            Get Map Details               //
        //                                          //
        // ======================================== //

        case GET_MAP:
            break;

        case GET_MAP_STARTED:
            return  Object.assign({}, state, {
                pending: true
            });

        case GET_MAP_SUCCESS:
            currentMapCopy = deepCopy(action.payload)
            currentMapCopy.d3 = {
                scale: 1,
                translate: [0,0],
                boundingClientHeight: null
            }

            return{
                ...state,
                currentMap: currentMapCopy,
                pending: false
            }

        case GET_MAP_FAILURE:
            return  Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ======================================== //
        //                                          //
        //              Post Map                    //
        //                                          //
        // ======================================== //

        case POST_MAP_STARTED:
            return { ...state, pending: true }

        case POST_MAP_SUCCESS:
            return {
                ...state,
                maps: [...state.maps, action.payload],
                pending: false,
            }

        case POST_MAP_FAILURE:
            return { ...state, error: action.payload, pending: false }

        // ======================================== //
        //                                          //
        //              Delete Map                  //
        //                                          //
        // ======================================== //

        case DELETE_MAP_STARTED:
            return { ...state, pending: true }

        case DELETE_MAP_SUCCESS:
            return {
                ...state,
                maps: state.maps.filter(m => m._id !== action.payload),
                pending: false,
            }

        case DELETE_MAP_FAILURE:
            return { ...state, error: action.payload, pending: false }

        // ======================================== //
        //                                          //
        //            Map Utility Funcs             //
        //                                          //
        // ======================================== //

        case SET_MAP_ATTRIBUTES:
            currentMapCopy = deepCopy(state.currentMap)
            Object.assign(currentMapCopy, {...action.payload.attr})

            return {
                ...state,
                currentMap: currentMapCopy
            }

        case SET_CURRENT_MAP:
            return {
                ...state,
                currentMap: action.payload
            }

        default:
            return state;
    }
}
