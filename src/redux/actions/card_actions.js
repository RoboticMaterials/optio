import { normalize } from 'normalizr';

// import types
import {
    GET,
    POST,
    DELETE,
    PUT
} from '../types/prefixes';

import {
    CARDS,
    CARD
} from '../types/data_types';

import { api_action } from './index';
import * as api from '../../api/schedules_api'

// import schema
import { scheduleSchema, schedulesSchema } from '../../normalizr/schedules_schema';

import log from "../../logger"

const logger = log.getLogger("Cards", "Redux")

// get
// ******************************
export const getCards = () =>  async (dispatch) => {

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        // const schedules = await api.getSchedules();

        // format response
        // const normalizedSchedules = normalize(schedules, schedulesSchema);

        // return payload for redux
        // return {
        //     schedulesObj: normalizedSchedules.entities.schedules,
        //     scheduleIds: normalizedSchedules.result
        // };
    }

    const actionName = GET + CARDS;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch);

    return payload.cardsObj;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// create
// ******************************
export const postCard = (card) =>  async dispatch => {

    // const callback = async () => {
    //     // const createdCard = await api.postCard(card);
    //     // const normalizedSchedules = normalize(createdSchedule, scheduleSchema);
    //
    //     return {
    //         createdCards: normalizedSchedules.entities.cards,
    //     };
    // }
    //
    // const actionName = POST + CARD;
    //
    // const payload = await api_action(actionName, callback, dispatch, card);
    //
    // return Object.values(payload.createdCards)[0];

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteSchedule = (scheduleId) => async (dispatch) => {

    // const callback = async () => {
    //     await api.deleteSchedule(scheduleId);
    //
    //     return {
    //         scheduleId
    //     };
    // }
    //
    // const actionName = DELETE + SCHEDULE;
    // const payload = await api_action(actionName, callback, dispatch, scheduleId);
    // return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update
// ******************************
export const putCard = (card) => async dispatch => {

    const callback = async () => {
        // const response = await api.putSchedule(scheduleId, schedule);
        // const normalizedSchedule = normalize(response, scheduleSchema);
        //
        return {
            card
        };
    }

    const actionName = PUT + CARD;
    const payload = await api_action(actionName, callback, dispatch, { card});
    return card;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

