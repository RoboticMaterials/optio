import { normalize, schema } from 'normalizr';

import {
    GET_TOUCH_EVENTS,
    GET_TOUCH_EVENTS_STARTED,
    GET_TOUCH_EVENTS_SUCCESS,
    GET_TOUCH_EVENTS_FAILURE,

    GET_LOT_TOUCH_EVENTS,
    GET_LOT_TOUCH_EVENTS_STARTED,
    GET_LOT_TOUCH_EVENTS_SUCCESS,
    GET_LOT_TOUCH_EVENTS_FAILURE,

    POST_TOUCH_EVENTS,
    POST_TOUCH_EVENTS_STARTED,
    POST_TOUCH_EVENTS_SUCCESS,
    POST_TOUCH_EVENTS_FAILURE,

    OPEN_TOUCH_EVENT,
    OPEN_TOUCH_EVENT_STARTED,
    OPEN_TOUCH_EVENT_SUCCESS,
    OPEN_TOUCH_EVENT_FAILURE,

    CLOSE_TOUCH_EVENT,
    CLOSE_TOUCH_EVENT_STARTED,
    CLOSE_TOUCH_EVENT_SUCCESS,
    CLOSE_TOUCH_EVENT_FAILURE,

    GET_OPEN_TOUCH_EVENTS,
    GET_OPEN_TOUCH_EVENTS_STARTED,
    GET_OPEN_TOUCH_EVENTS_SUCCESS,
    GET_OPEN_TOUCH_EVENTS_FAILURE,

    GET_OPEN_STATION_TOUCH_EVENTS,
    GET_OPEN_STATION_TOUCH_EVENTS_STARTED,
    GET_OPEN_STATION_TOUCH_EVENTS_SUCCESS,
    GET_OPEN_STATION_TOUCH_EVENTS_FAILURE,

    PUT_TOUCH_EVENTS,
    PUT_TOUCH_EVENTS_STARTED,
    PUT_TOUCH_EVENTS_SUCCESS,
    PUT_TOUCH_EVENTS_FAILURE,

    DELETE_TOUCH_EVENTS,
    DELETE_TOUCH_EVENTS_STARTED,
    DELETE_TOUCH_EVENTS_SUCCESS,
    DELETE_TOUCH_EVENTS_FAILURE,
} from '../types/touch_events_types'

import * as api from '../../api/touch_events_api'
import { eventsSchema } from '../../normalizr/schema';


export const getLotTouchEvents = (lotId) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: GET_LOT_TOUCH_EVENTS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: GET_LOT_TOUCH_EVENTS_SUCCESS, payload: {lotId, events: response }});
            return response;
        }
        function onError(error) {
            dispatch({ type: GET_LOT_TOUCH_EVENTS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const events = await api.getLotTouchEvents(lotId);

            return onSuccess(events)
            // return onSuccess(events)
        } catch (error) {
            return onError(error)
        }
    }
}

export const postTouchEvent = (touch_event) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: POST_TOUCH_EVENTS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: POST_TOUCH_EVENTS_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: POST_TOUCH_EVENTS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const newTouchEvent = await api.postTouchEvent(touch_event);
            return onSuccess(newTouchEvent)
        } catch (error) {
            return onError(error)
        }
    }
}

export const postOpenTouchEvent = (touchEvent) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: OPEN_TOUCH_EVENT_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: OPEN_TOUCH_EVENT_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: OPEN_TOUCH_EVENT_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const newTouchEvent = await api.openTouchEvent(touchEvent);
            return onSuccess(newTouchEvent)
        } catch (error) {
            return onError(error)
        }
    }
}

export const postCloseTouchEvent = (touchEvent) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: CLOSE_TOUCH_EVENT_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: CLOSE_TOUCH_EVENT_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: CLOSE_TOUCH_EVENT_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const closedTouchEvent = await api.closeTouchEvent(touchEvent);
            return onSuccess(closedTouchEvent)
        } catch (error) {
            return onError(error)
        }
    }
}

export const getOpenTouchEvents = () => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: GET_OPEN_TOUCH_EVENTS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: GET_OPEN_TOUCH_EVENTS_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: GET_OPEN_TOUCH_EVENTS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const events = await api.getOpenTouchEvents();

            return onSuccess(events)
            // return onSuccess(events)
        } catch (error) {
            return onError(error)
        }
    }
}

export const getOpenStationTouchEvents = (stationId) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: GET_OPEN_STATION_TOUCH_EVENTS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: GET_OPEN_STATION_TOUCH_EVENTS_SUCCESS, payload: {stationId, events: response }});
            return response;
        }
        function onError(error) {
            dispatch({ type: GET_OPEN_STATION_TOUCH_EVENTS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const events = await api.getOpenStationTouchEvents(stationId);

            return onSuccess(events)
            // return onSuccess(events)
        } catch (error) {
            return onError(error)
        }
    }
}