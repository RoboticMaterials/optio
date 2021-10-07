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
            const events = await api.getTouchEvents(lotId);

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