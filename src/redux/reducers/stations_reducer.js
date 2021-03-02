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
    EDITING_STATION

} from '../types/stations_types'

// Import Utils
import { deepCopy, isEquivalent } from '../../methods/utils/utils';
import { compareExistingVsIncomingLocations } from '../../methods/utils/locations_utils'

const defaultState = {
    stations: {},

    selectedStation: null,

    editingStation: false,

    d3: {},

    error: {},
    pending: false,
}

export default function stationsReducer(state = defaultState, action) {
    let stationsCopy
    /**
     * Updates the state of stations to include the incoming payload station.
     * If the payload is the current selected Station, then update that as well
     * @param {object} station
     */
    const onUpdateStation = (station) => {
        return {
            ...state,
            stations: {
                ...state.stations,
                [station._id]: station
            },
            // If the post station is the selectedStation, then update selected station
            selectedStation: state.selectedStation !== null && state.selectedStation._id === station._id && station,
            pending: false,
        }
    }

    switch (action.type) {

        // ======================================== //
        //                                          //
        //                UTILS                     //
        //                                          //
        // ======================================== //

        // Adds station to front-end without adding it to the backend
        case ADD_STATION:
            return onUpdateStation(action.payload)

        // Sets Stations Attributes
        case SET_STATION_ATTRIBUTES:
            // If there is a selected station and the payload is that station, then edit the selected station and dont edit the station in state
            if (!!state.selectedStation && action.payload.id === state.selectedStation._id) {
                return {
                    ...state,
                    selectedStation: {
                        ...state.selectedStation,
                        ...action.payload.attr
                    }
                }
            }

            else {
                let updatedStation = state.stations[action.payload.id]
                Object.assign(updatedStation, action.payload.attr)
                return onUpdateStation(updatedStation)
            }

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
                stations: action.payload.stations,
                selectedStation: !!action.payload.selectedStation ? action.payload.selectedStation : state.selectedStation,
                d3: !!action.payload.d3 ? action.payload.d3 : state.d3
            }

        case EDITING_STATION:
            return {
                ...state,
                editingStation: action.payload
            }

        case REMOVE_STATION:
            stationsCopy = deepCopy(state.stations)
            delete stationsCopy[action.payload]
            return {
                ...state,
                stations: stationsCopy
            }

        // ========== GET ========== //
        case GET_STATIONS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_STATIONS_SUCCESS:
            const parsedStations = compareExistingVsIncomingLocations(deepCopy(action.payload), deepCopy(state.stations), state.d3)
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
            stationsCopy = deepCopy(state.stations)
            delete stationsCopy[action.payload]
            return {
                ...state,
                stations: stationsCopy,
                selectedStation: null,
                pending: false,
                hello: true,
            }

        case DELETE_STATION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        default:
            return state
    }

}
