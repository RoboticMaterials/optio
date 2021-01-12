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
    UPDATE_STATION,
    SET_STATION_ATTRIBUTES,
    UPDATE_STATIONS,
    REMOVE_STATION,

    HOVER_STATION_INFO,
} from '../types/stations_types'

import { deepCopy, isEquivalent } from '../../methods/utils/utils';


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
                // TODO: ACTUALLY DO THIS!!!
            }
        })

    }

    switch (action.type) {
        
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
            return setStation(action.payload.station)

        case POST_STATION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });
    }

}