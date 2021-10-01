import { normalize, schema } from 'normalizr';

import {
    GET_TOUCH_EVENTS,
    GET_TOUCH_EVENTS_STARTED,
    GET_TOUCH_EVENTS_SUCCESS,
    GET_TOUCH_EVENTS_FAILURE,

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


// export const getTouchEvents = () => {
//     return async dispatch => {
//         function onStart() {
//             dispatch({ type: GET_TOUCH_EVENTS_STARTED });
//         }
//         function onSuccess(response) {
//             dispatch({ type: GET_TOUCH_EVENTS_SUCCESS, payload: response });
//             return response;
//         }
//         function onError(error) {
//             dispatch({ type: GET_TOUCH_EVENTS_FAILURE, payload: error });
//             return error;
//         }

//         try {
//             onStart();
//             const events = await api.getTouchEvents();
//             events.forEach((event, ind) => {
//                 events[ind].position.pos_x = event.position.x
//                 events[ind].position.pos_y = event.position.y
//             })

//             // Uncomment when you want to make events an object
//             const normalizedTouchEvents = normalize(events, eventsSchema);

//             return onSuccess(normalizedTouchEvents.entities.events)
//             // return onSuccess(events)
//         } catch (error) {
//             return onError(error)
//         }
//     }
// }
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
            const newTouchEvents = await api.postTouchEvent(touch_event);
            return onSuccess(newTouchEvents)
        } catch (error) {
            return onError(error)
        }
    }
}
// export const putTouchEvent = (event, ID) => {
//     return async dispatch => {
//         function onStart() {
//             dispatch({ type: PUT_TOUCH_EVENTS_STARTED });
//         }
//         function onSuccess(response) {
//             dispatch({ type: PUT_TOUCH_EVENTS_SUCCESS, payload: response.data });
//             return response;
//         }
//         function onError(error) {
//             dispatch({ type: PUT_TOUCH_EVENTS_FAILURE, payload: error });
//             return error;
//         }

//         try {
//             onStart();
//             const updateTouchEvents = await api.putTouchEvents(event, ID);
//             return onSuccess(updateTouchEvents)
//         } catch (error) {
//             return onError(error)
//         }
//     }
// }
// export const deleteTouchEvent = (ID) => {
//     return async dispatch => {
//         function onStart() {
//             dispatch({ type: DELETE_TOUCH_EVENTS_STARTED });
//         }
//         function onSuccess(response) {
//             dispatch({ type: DELETE_TOUCH_EVENTS_SUCCESS, payload: ID });
//             return response;
//         }
//         function onError(error) {
//             dispatch({ type: DELETE_TOUCH_EVENTS_FAILURE, payload: error });
//             return error;
//         }

//         try {
//             onStart();
//             const removeTouchEvents = await api.deleteTouchEvents(ID);
//             return onSuccess(ID)
//         } catch (error) {
//             return onError(error)
//         }
//     }
// }

export const updateTouchEvents = (events) => {
    return { type: 'UPDATE_TOUCH_TOUCH_EVENTS', payload: { events } }
}
