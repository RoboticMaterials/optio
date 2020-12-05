import { normalize } from 'normalizr';

// import types
import {
    GET,
    POST,
    DELETE,
    PUT
} from '../types/prefixes';

import {
    REPORT_EVENTS,
    REPORT_EVENT
} from '../types/data_types';

import { api_action } from './index';
import * as api from '../../api/report_events_api'

// import schema
// import { scheduleSchema, schedulesSchema } from '../../normalizr/schedules_schema';

import log from "../../logger"
import {convertArrayToObject} from "../../methods/utils/utils";

const logger = log.getLogger("ReportEvents", "Redux")

// get
// ******************************
export const getReportEvents = () =>  async (dispatch) => {

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        const reportEvents = await api.getReportEvents();
        const reportEventsObj = convertArrayToObject(reportEvents, "_id")

        // format response
        // const normalizedSchedules = normalize(schedules, schedulesSchema);

        // return payload for redux
        return {
            reportEventsObj
        };
    }

    const actionName = GET + REPORT_EVENTS;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch);

    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// create
// ******************************
export const postReportEvent = (reportEvent) =>  async dispatch => {

    const callback = async () => {
        const createdReportEvent = await api.postReportEvent(reportEvent);
        // const normalizedSchedules = normalize(createdSchedule, scheduleSchema);

        return {
            createdReportEvent
        };
    }

    const actionName = POST + REPORT_EVENT;

    const payload = await api_action(actionName, callback, dispatch, reportEvent);

    return payload

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteReportEvent = (id) => async (dispatch) => {

    const callback = async () => {
        await api.deleteReportEvent(id);

        return {
            id
        };
    }

    const actionName = DELETE + REPORT_EVENT;
    const payload = await api_action(actionName, callback, dispatch, id);
    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update
// ******************************
export const putReportEvent = (id, reportEvent) => async dispatch => {


    const callback = async () => {
        const updatedReportEvent = await api.putReportEvent(reportEvent, id);

        return {
            updatedReportEvent
        };
    }

    const actionName = PUT + REPORT_EVENT           ;
    const payload = await api_action(actionName, callback, dispatch);
    return payload;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
