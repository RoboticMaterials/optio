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

import {
    GET_POSITIONS_STARTED,
    GET_POSITIONS_SUCCESS,
    GET_POSITIONS_FAILURE,

    POST_POSITION_STARTED,
    POST_POSITION_SUCCESS,
    POST_POSITION_FAILURE,

    PUT_POSITION_STARTED,
    PUT_POSITION_SUCCESS,
    PUT_POSITION_FAILURE,

    DELETE_POSITION_STARTED,
    DELETE_POSITION_SUCCESS,
    DELETE_POSITION_FAILURE,

    ADD_POSITION,
    UPDATE_POSITION,
    SET_POSITION_ATTRIBUTES,
    UPDATE_POSITIONS,
    REMOVE_POSITION
} from '../types/positions_types'

import {
    SELECT_LOCATION,
    SET_SELECTED_LOCATION,
    SET_SELECTED_LOCATION_COPY,
    SET_SELECTED_LOCATION_CHILDREN_COPY,
    DESELECT_LOCATION,
} from '../types/locations_types'


import { deepCopy, isEquivalent } from '../../methods/utils/utils';

/**
 * This reducer is different than the rest of the common reducers. The way locations are formatted is that a location
 * can either be a position or a station. Each station may have a list of children, where each child is a position. 
 * Therefore, each position can either have a parent (which is a station) or have parent == null, meaning it is a stand-alone
 * (or idle) position. 
 * 
 * 'locations' is an object that combines all stations and all stand-along positions. This is all the locations that are displayed
 * in the locations sidebar. Therefore, any time we change a station or a position, we must also update the locations.
 * 
 * Additionally, since a location can either be a station or position, I have added an abstraction for location actions to update, delete, set, etc.
 * a location, and have that function appropriatly route the operation to either alter a position or a location. This is done in location_actions.js.
 * 
 * NOTE: This distinction of being a station or a position is held in the 'schema' attribute
 */

const defaultState = {
    stations: {},
    positions: {},
    locations: {},

    selectedLocation: null,
    selectedLocationCopy: null,
    selectedLocationChildrenCopy: null,

    hoverStationInfo: null,

    error: {},
    pending: false
};

export default function locationsReducer(state = defaultState, action) {
    let index = ''
    let ID = ''

    const filterLocations = (stations, positions) => {
        const unfilteredLocationsArr = [...Object.values(stations), ...Object.values(positions)]
        const filterdLocationsArr = unfilteredLocationsArr.filter(loc => loc.schema == 'station' || (loc.schema == 'position' && loc.parent === null))

        let locations = {}
        filterdLocationsArr.forEach(location =>
            locations[location._id] = location
        )

        return locations
    }

    // ======================================== //
    //                                          //
    //         STATION UTILITY FUNCTIONS        //
    //                                          //
    // ======================================== //

    const setStations = (stations) => {
        let stationsCopy = deepCopy(stations)
        let positionsCopy = deepCopy(state.positions)


        if (state.selectedLocation !== null) { // The updated station is the selected location
            return {
                ...state,
                stations: stationsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                selectedLocation: deepCopy(stationsCopy[state.selectedLocation._id]),
                pending: false
            }
        } else {
            return {
                ...state,
                stations: stationsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                pending: false
            }
        }
    }

    const setStation = (station) => {
        let stationsCopy = deepCopy(state.stations)
        let positionsCopy = deepCopy(state.positions)

        stationsCopy[station._id] = deepCopy(station)

        if (state.selectedLocation !== null && state.selectedLocation._id === station._id) { // The updated station is the selected location
            return {
                ...state,
                stations: stationsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                selectedLocation: deepCopy(station),
                pending: false
            }
        } else {
            return {
                ...state,
                stations: stationsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                pending: false
            }
        }
    }

    const removeStation = (id) => {
        let stationsCopy = deepCopy(state.stations)
        let positionsCopy = deepCopy(state.positions)

        delete stationsCopy[id]

        if (state.selectedLocation !== null && state.selectedLocation._id === id) { // The deleted station is the selected location
            return {
                ...state,
                stations: stationsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                selectedLocation: null,
                pending: false
            }
        } else {
            return {
                ...state,
                stations: stationsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                pending: false
            }
        }
    }

    const setStationAttributes = (id, attr) => {
        let stationsCopy = deepCopy(state.stations)
        let positionsCopy = deepCopy(state.positions)

        if (!(id in stationsCopy)) { return state }

        Object.assign(stationsCopy[id], attr)

        if (state.selectedLocation !== null && state.selectedLocation._id === id) { // The updated station is the selected location
            return {
                ...state,
                stations: stationsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                selectedLocation: deepCopy(stationsCopy[state.selectedLocation._id]),
                pending: false
            }
        } else {
            return {
                ...state,
                stations: stationsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                pending: false
            }
        }
    }

    // ======================================== //
    //                                          //
    //        POSITION UTILITY FUNCTIONS        //
    //                                          //
    // ======================================== //

    // TODO: Commented out Deep Copy's here for now (left selectedLocation with deepCopy though). 
    const setPositions = (positions) => {
        // let stationsCopy = deepCopy(state.stations)
        // let positionsCopy = deepCopy(positions)

        let stationsCopy = state.stations
        let positionsCopy = positions

        // const positionsStateCopy = deepCopy(state.positions)
        let positionsStateCopy = state.positions

        // IMPORTANT: Removes 'deleted' positions from the reducer state. 
        // These 'deleted' positions have been deleted on the front end, but since deleting a position on the backend causes a bug, the key 'change_key'
        // is added to the position and set to 'delete' and the backend will delete it when it needs to be
        Object.values(positionsCopy).map((position) => {
            if (!!position.change_key && position.change_key === 'deleted') {
                delete positionsCopy[position._id]
            }
        })

        // What this does is add the x and y coordinates of the states positions to the positions coming into this function
        // The reason why this has to be done is that on page load, the X and Y coordinates for each postion are calulated but not added to the back end,
        // when a get call for positions is made for the backend, the calculated X and Y coordinates are deleted (since they dont exist on the backend). 
        // This takes the calculated X and Y coordinates already calculated in state and adds them to the incoming positions if the positions copy doesn match. They wouldnt match because the backend does not have X and Y coordinates
        if (!isEquivalent(positionsCopy, positionsStateCopy)) {

            Object.keys(positionsStateCopy).map((key, ind) => {
                return positionsCopy[key] = {
                    ...positionsCopy[key],
                    x: positionsStateCopy[key].x,
                    y: positionsStateCopy[key].y,
                }
            })
        }

        if (state.selectedLocation !== null) { // The updated position is the selected location
            return {
                ...state,
                positions: positionsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                // selectedLocation: positionsCopy[state.selectedLocation._id],
                selectedLocation: deepCopy(positionsCopy[state.selectedLocation._id]),
                pending: false
            }
        } else {
            return {
                ...state,
                positions: positionsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                pending: false
            }
        }
    }

    const setPosition = (position) => {
        let stationsCopy = deepCopy(state.stations)
        let positionsCopy = deepCopy(state.positions)


        positionsCopy[position._id] = deepCopy(position)

        if (state.selectedLocation !== null && state.selectedLocation._id === position._id) { // The updated position is the selected location
            return {
                ...state,
                positions: positionsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                selectedLocation: deepCopy(position),
                pending: false
            }
        } else {
            return {
                ...state,
                positions: positionsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                pending: false
            }
        }
    }

    const removePosition = (id) => {
        let stationsCopy = deepCopy(state.stations)
        let positionsCopy = deepCopy(state.positions)

        delete positionsCopy[id]

        if (state.selectedLocation !== null && state.selectedLocation._id === id) { // The deleted position is the selected location
            return {
                ...state,
                positions: positionsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                selectedLocation: null,
                pending: false
            }
        } else {
            return {
                ...state,
                positions: positionsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                pending: false
            }
        }
    }

    const setPositionAttributes = (id, attr) => {
        let stationsCopy = deepCopy(state.stations)
        let positionsCopy = deepCopy(state.positions)


        if (!(id in positionsCopy)) { return state }
        Object.assign(positionsCopy[id], attr)

        if (state.selectedLocation !== null && state.selectedLocation._id === id) { // The updated position is the selected location
            return {
                ...state,
                positions: positionsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                selectedLocation: deepCopy(positionsCopy[state.selectedLocation._id]),
                pending: false
            }
        } else {
            return {
                ...state,
                positions: positionsCopy,
                locations: filterLocations(stationsCopy, positionsCopy),
                pending: false
            }
        }
    }

    switch (action.type) {

        // ======================================== //
        //                                          //
        //                 STATIONS                 //
        //                                          //
        // ======================================== //

        // ========== GET ========== //
        case GET_STATIONS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_STATIONS_SUCCESS:
            return setStations(action.payload.stations)

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

        // ========== PUT ========== //
        case PUT_STATION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case PUT_STATION_SUCCESS:
            return setStation(action.payload.station)

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
            return removeStation(action.payload.id)

        case DELETE_STATION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });


        // ========== UTILS ========== //
        case ADD_STATION:
            return setStation(action.payload.station)

        case UPDATE_STATION:
            return setStation(action.payload.station)

        case UPDATE_STATIONS:
            return setStations(action.payload.stations)

        case REMOVE_STATION:
            return removeStation(action.payload.id)

        case SET_STATION_ATTRIBUTES:
            return setStationAttributes(action.payload.id, action.payload.attr)

        case HOVER_STATION_INFO:
            return {
                ...state,
                hoverStationInfo: action.payload.info,
            }

        // ======================================== //
        //                                          //
        //                 POSITIONS                //
        //                                          //
        // ======================================== //

        // ========== GET ========== //
        case GET_POSITIONS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_POSITIONS_SUCCESS:
            return setPositions(action.payload.positions)

        case GET_POSITIONS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ========== POST ========== //
        case POST_POSITION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case POST_POSITION_SUCCESS:
            return setPosition(action.payload.position)

        case POST_POSITION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ========== PUT ========== //
        case PUT_POSITION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case PUT_POSITION_SUCCESS:
            return setPosition(action.payload.position)

        case PUT_POSITION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ========== DELETE ========== //
        case DELETE_POSITION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case DELETE_POSITION_SUCCESS:
            return removePosition(action.payload.id)

        case DELETE_POSITION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });


        // ========== UTILS ========== //
        case ADD_POSITION:
            return setPosition(action.payload.position)

        case UPDATE_POSITION:
            return setPosition(action.payload.position)

        case UPDATE_POSITIONS:
            return setPositions(action.payload.positions)

        case REMOVE_POSITION:
            return removePosition(action.payload.id)

        case SET_POSITION_ATTRIBUTES:
            return setPositionAttributes(action.payload.id, action.payload.attr)


        // ======================================== //
        //                                          //
        //                 LOCATIONS                //
        //                                          //
        // ======================================== //

        case SELECT_LOCATION:
            let locationsCopy = deepCopy(state.locations)

            return {
                ...state,
                selectedLocation: locationsCopy[action.payload.id]
            }

        case SET_SELECTED_LOCATION:
            return {
                ...state,
                selectedLocation: action.payload.location
            }

        case DESELECT_LOCATION:
            return {
                ...state,
                selectedLocation: null,
            }

        case SET_SELECTED_LOCATION_COPY:
            return {
                ...state,
                selectedLocationCopy: action.payload
            }

        case SET_SELECTED_LOCATION_CHILDREN_COPY:
            return {
                ...state,
                selectedLocationChildrenCopy: action.payload
            }



        default:
            return state;
    }
}
