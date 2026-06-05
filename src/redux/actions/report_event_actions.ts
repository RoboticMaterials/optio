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

import log from "../../logger"


// create
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
