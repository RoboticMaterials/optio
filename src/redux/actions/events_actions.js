import { normalize, schema } from 'normalizr';

import {
    GET_EVENTS,
    GET_EVENTS_STARTED,
    GET_EVENTS_SUCCESS,
    GET_EVENTS_FAILURE,

    POST_EVENTS,
    POST_EVENTS_STARTED,
    POST_EVENTS_SUCCESS,
    POST_EVENTS_FAILURE,

    PUT_EVENTS,
    PUT_EVENTS_STARTED,
    PUT_EVENTS_SUCCESS,
    PUT_EVENTS_FAILURE,

    DELETE_EVENTS,
    DELETE_EVENTS_STARTED,
    DELETE_EVENTS_SUCCESS,
    DELETE_EVENTS_FAILURE,
} from '../types/events_types'

import * as api from '../../api/events_api'
import { eventsSchema } from '../../normalizr/schema';


export const getEvents = () => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: GET_EVENTS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: GET_EVENTS_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: GET_EVENTS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const events = await api.getEvents();
            events.forEach((event, ind) => {
                events[ind].position.pos_x = event.position.x
                events[ind].position.pos_y = event.position.y
            })

            // Uncomment when you want to make events an object
            const normalizedEvents = normalize(events, eventsSchema);

            return onSuccess(normalizedEvents.entities.events)
            // return onSuccess(events)
        } catch (error) {
            return onError(error)
        }
    }
}
export const postEvents = (events) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: POST_EVENTS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: POST_EVENTS_SUCCESS, payload: response });
            return response;
        }
        function onError(error) {
            dispatch({ type: POST_EVENTS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const newEvents = await api.postEvents(events);
            return onSuccess(newEvents)
        } catch (error) {
            return onError(error)
        }
    }
}
export const putEvents = (event, ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: PUT_EVENTS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: PUT_EVENTS_SUCCESS, payload: response.data });
            return response;
        }
        function onError(error) {
            dispatch({ type: PUT_EVENTS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const updateEvents = await api.putEvents(event, ID);
            return onSuccess(updateEvents)
        } catch (error) {
            return onError(error)
        }
    }
}
export const deleteEvents = (ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_EVENTS_STARTED });
        }
        function onSuccess(response) {
            dispatch({ type: DELETE_EVENTS_SUCCESS, payload: ID });
            return response;
        }
        function onError(error) {
            dispatch({ type: DELETE_EVENTS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const removeEvents = await api.deleteEvents(ID);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}

export const updateEvents = (events) => {
    return { type: 'UPDATE_EVENTS', payload: { events } }
}
