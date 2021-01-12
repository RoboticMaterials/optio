import {
    GET_STATIONS_STARTED,
    GET_STATIONS_SUCCESS,
    GET_STATIONS_FAILURE,

    POST_STATION_STARTED,
    POST_STATION_SUCCESS,
    POST_STATION_FAILURE,

    PUT_STATION_STARTED,
    PUT_STATION_SUCCESS,
    PUT_STATION_FAILURE,

    DELETE_STATION_STARTED,
    DELETE_STATION_SUCCESS,
    DELETE_STATION_FAILURE,

    ADD_STATION,
    SET_SELECTED_STATION,
    UPDATE_STATION,
    SET_STATION_ATTRIBUTES,
    UPDATE_STATIONS,
    REMOVE_STATION,

} from '../types/stations_types'

// Import Utils
import { deepCopy, isEquivalent } from '../../methods/utils/utils';
import { convertD3ToReal, convertRealToD3, getRelativeOffset } from '../../methods/utils/map_utils'
import * as d3 from 'd3'



const defaultState = {
    stations: {},

    selectedStation: {},

    editingStation: {},

    error: {},
    pending: false,
}

export default function locationsReducer(state = defaultState, action) {
    // ======================================== //
    //                                          //
    //         STATION UTILITY FUNCTIONS        //
    //                                          //
    // ======================================== //

    /**
     * This function compares existing vs incoming station
     * 
     * If the incoming station exists in existing stations then use the incoming station info but update the x and y from existing
     * Using x and y from existing because it those values correlate with the local map
     * 
     * If an incoming station is not in existing stations that means it was added by another client
     * Make sure to update the new stations x and y values to match the local map's d3
     * 
     * @param {object} existingStations 
     * @param {object} incomingStations 
     */
    const onCompareExistingVsIncomingStations = (incomingStations) => {

        existingStations = state.stations

        Object.values(existingStations).forEach(existingStation => {
            // If the station exists in the backend and frontend, take the new stations, but assign local x and y
            if (existingStation._id in incomingStations) {
                Object.assign(incomingStations[existingStation._id], { x: existingStation.x, y: existingStation.y })
            }

            // If the ex
            else if (existingStation.new == true) {
                incomingStations[existingStation._id] = existingStation
            }
        })

        // Compare incoming vs existing
        Object.values(incomingStations).forEach(incomingStation => {

            // If the incoming station is not in existing station, its a new station
            if (!incomingStation._id in existingStations) {

                // If it's a new station, make sure to update it's coords to d3 coords on the local map
                [x, y] = convertRealToD3([incomingStation.pos_x, incomingStation.pos_y], d3)
                incomingStation = {
                    ...incomingStation,
                    x: x,
                    y: y,
                }

            }
        })

        return incomingStations
    }

    /**
     * Updates the state of stations to include the incoming payload station.
     * If the payload is the current selected Station, then update that as well
     * @param {object} payload 
     */
    const onUpdateStation = (station) => {
        return {
            ...state,
            stations: {
                ...state.stations,
                [station._id]: station
            },
            // If the post station is the selectedStation, then update selected station
            selectedStation: state.selectedLocation !== null && state.selectedLocation._id === station._id && station,
            pending: false,
        }
    }

    const onUpdateStations = (stations) => {

    }

    switch (action.type) {

        // ========== UTILS ========== //

        // Adds station to front-end without adding it to the backend
        case ADD_STATION:
            return onUpdateStation(action.payload)

        // Sets Stations Attributes
        case SET_STATION_ATTRIBUTES:
            Object.assign(action.payload.station, action.payload.attr)
            return onUpdateStation(action.payload)

        // Sets a selected Station
        case SET_SELECTED_STATION:
            return {
                ...state,
                selectedStation: action.payload
            }

        // Updates a station locally on the front-end
        case UPDATE_STATION:
            return onUpdateStation(action.payload)

        // Upates stations locally on the front-end
        case UPDATE_STATIONS:
            return {
                ...state,
                stations: action.payload,
            }

        // ========== GET ========== //
        case GET_STATIONS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_STATIONS_SUCCESS:

            const parsedStations = onCompareExistingVsIncomingStations(deepCopy(action.payload))

            return {
                ...state,
                stations: parsedStations,
                pending: false
            }

        case GET_STATIONS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ========== POST ========== //
        case POST_STATION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case POST_STATION_SUCCESS:
            return onUpdateStation(action.payload)

        case POST_STATION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ========== PUT ========== //
        case PUT_STATION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case PUT_STATION_SUCCESS:
            return onUpdateStation(action.payload)

        case PUT_STATION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ========== DELETE ========== //
        case DELETE_STATION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case DELETE_STATION_SUCCESS:
            const stationsCopy = deepCopy(state.stations)
            delete stationsCopy[action.payload]
            return {
                ...state,
                stations: stationsCopy,
                selectedStation: null,
                pending: false,
            }

        case DELETE_STATION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });
    }

}