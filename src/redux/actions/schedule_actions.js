import { normalize } from 'normalizr';

// import types
import {
    GET,
    POST,
    DELETE,
    PUT
} from '../types/prefixes';

import {
    SCHEDULES,
    SCHEDULE
} from '../types/data_types';

import { api_action } from './index';
import * as api from '../../api/schedules_api'

// import schema
import { scheduleSchema, schedulesSchema } from '../../normalizr/schedules_schema';

import log from "../../logger"

const logger = log.getLogger("Schedules", "Redux")

// get
// ******************************
export const getSchedules = () =>  async (dispatch) => {

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        const schedules = await api.getSchedules();

        // format response
        const normalizedSchedules = normalize(schedules, schedulesSchema);

        // return payload for redux
        return {
            schedulesObj: normalizedSchedules.entities.schedules,
            scheduleIds: normalizedSchedules.result
        };
    }

    const actionName = GET + SCHEDULES;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch);

    return payload.schedulesObj;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// create
// ******************************
export const postSchedule = (schedule) =>  async dispatch => {

    const callback = async () => {
        const createdSchedule = await api.postSchedule(schedule);
        const normalizedSchedules = normalize(createdSchedule, scheduleSchema);

        return {
            createdSchedules:normalizedSchedules.entities.schedules,
        };
    }

    const actionName = POST + SCHEDULE;

    const payload = await api_action(actionName, callback, dispatch, schedule);

    return Object.values(payload.createdSchedules)[0];

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteSchedule = (scheduleId) => async (dispatch) => {

    const callback = async () => {
        await api.deleteSchedule(scheduleId);

        return {
            scheduleId
        };
    }

    const actionName = DELETE + SCHEDULE;
    const payload = await api_action(actionName, callback, dispatch, scheduleId);
    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update
// ******************************
export const putSchedule = (scheduleId, schedule) => async dispatch => {

    logger.log("action_putSchedule: scheduleId:",scheduleId)
    logger.log("action_putSchedule: schedule:",schedule)

    const callback = async () => {
        const response = await api.putSchedule(scheduleId, schedule);
        const normalizedSchedule = normalize(response, scheduleSchema);

        return {
            scheduleId,
            schedules: normalizedSchedule.entities.schedules
        };
    }

    const actionName = PUT + SCHEDULE;
    const payload = await api_action(actionName, callback, dispatch, {scheduleId, schedule});
    return payload.scheduleId;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// add edited schedules (temp storage for unsaved schedules, so no api call)
// ******************************
export const addUnsavedSchedules = (schedules) => {
  return async dispatch => {
      const payload = schedules;
      dispatch({ type: "ADD_SCHEDULES_UNSAVED", payload });
      return schedules;
  };

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export function addSchedules(schedules) {
  return {
    type: "ADD_SCHEDULES",
    schedules
  };
}
