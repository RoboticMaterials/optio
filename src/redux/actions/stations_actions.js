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
    UPDATE_STATIONS,
    REMOVE_STATION,
    SET_STATION_ATTRIBUTES,
    SET_SELECTED_STATION,

} from '../types/stations_types'

import { deepCopy } from '../../methods/utils/utils';
import uuid from 'uuid';

import * as api from '../../api/stations_api'

// get
// ******************************
export const getStations = () => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: GET_STATIONS_STARTED });
        }
        function onSuccess(stations) {
            dispatch({ type: GET_STATIONS_SUCCESS, payload: stations });
            return stations;
        }
        function onError(error) {
            dispatch({ type: GET_STATIONS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const stations = await api.getStations();

            const normalizedStations = {}
            stations.map((station) => {
                normalizedStations[station._id] = station
            })

            return onSuccess(normalizedStations);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// post
// ******************************
export const postStation = (station) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: POST_STATION_STARTED });
        }
        function onSuccess(station) {
            dispatch({ type: POST_STATION_SUCCESS, payload: station });
            return station;
        }
        function onError(error) {
            dispatch({ type: POST_STATION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            if (!('_id' in station)) {
                station._id = uuid.v4()
                console.log('QQQQ Added UUID to Station, this shouldnt Happen!!')
                alert('QQQQ Added UUID to Station, this shouldnt Happen!!')
            }
            delete station.temp
            delete station.new
            const newStation = await api.postStation(station);
            return onSuccess(newStation);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// put
// ******************************
export const putStation = (station) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: PUT_STATION_STARTED });
        }
        function onSuccess(station) {
            dispatch({ type: PUT_STATION_SUCCESS, payload: station });
            return station;
        }
        function onError(error) {
            dispatch({ type: PUT_STATION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            let stationCopy = deepCopy(station)
            delete stationCopy.temp
            const updateStation = await api.putStation(stationCopy, stationCopy._id);
            return onSuccess(updateStation)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteStation = (ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_STATION_STARTED });
        }
        function onSuccess(id) {
            dispatch({ type: DELETE_STATION_SUCCESS, payload: id });
            return id;
        }
        function onError(error) {
            dispatch({ type: DELETE_STATION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const removeStation = await api.deleteStation(ID);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// get Station Analytics
// ******************************
export const getStationAnalytics = async (id, timeSpan) => {
    try {
        const stationAnalytics = await api.getStationAnalytics(id, timeSpan);
        return stationAnalytics
    } catch (error) {
    }
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const addStation = (station) => {
    return { type: ADD_STATION, payload: station }
}

export const updateStationTO_BE_DELETED = (station) => {
    return { type: UPDATE_STATION, payload: { station } }
}

export const updateStationsTO_BE_DELETED = (stations) => {
    return { type: UPDATE_STATIONS, payload: { stations } }
}

export const removeStationTO_BE_DELETED = (id) => {
    return { type: REMOVE_STATION, payload: { id } }
}

export const setStationAttributes = (id, attr) => {
    return { type: SET_STATION_ATTRIBUTES, payload: { id, attr } }
}

export const setSelectedStation = (station) => {
    return {type: SET_SELECTED_STATION, payload: station}
}