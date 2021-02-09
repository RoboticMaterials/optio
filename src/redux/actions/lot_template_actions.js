import { normalize } from 'normalizr';

// import types
import {
    GET,
    POST,
    DELETE,
    PUT
} from '../types/prefixes';

import {
   LOT_TEMPLATES,
    LOT_TEMPLATE
} from '../types/data_types';

import { api_action } from './index';
import * as api from '../../api/lot_templates'

// import schema
import { scheduleSchema, schedulesSchema } from '../../normalizr/schedules_schema';

import log from "../../logger"
import {convertArrayToObject} from "../../methods/utils/utils";

const logger = log.getLogger("Cards", "Redux")
logger.setLevel("debug")
// get
// ******************************
export const getLotTemplate = (id) =>  async (dispatch) => {

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        const lotTemplate = await api.getLotTemplate(id);

        // const cardsObj = convertArrayToObject(cards, "_id")
        // console.log("getCard cardsObj",cardsObj)

        // format response
        // const normalizedSchedules = normalize(schedules, schedulesSchema);

        // return payload for redux
        return {
            lotTemplate,
        };
    }

    const actionName = GET + LOT_TEMPLATE;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch, {id});

    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get
// ******************************
export const getLotTemplates = () =>  async (dispatch) => {

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        const lotTemplates = await api.getLotTemplates();

        const lotTemplatesObj = convertArrayToObject(lotTemplates, "_id")

        // return payload for redux
        return {
            lotTemplates: lotTemplatesObj,
        };
    }

    const actionName = GET + LOT_TEMPLATES;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch);

    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// create
// ******************************
export const postLotTemplate = (lotTemplate) =>  async dispatch => {

    const callback = async () => {
        const createdLotTemplate = await api.postLotTemplate(lotTemplate);
        console.log("createdLotTemplate",createdLotTemplate)
        // const normalizedSchedules = normalize(createdSchedule, scheduleSchema);

        return {
            lotTemplate: createdLotTemplate,
        };
    }
    //
    const actionName = POST + LOT_TEMPLATE;

    const payload = await api_action(actionName, callback, dispatch, {lotTemplate});

    return payload
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteLotTemplate = (id) => async (dispatch) => {

    const callback = async () => {
        await api.deleteLotTemplate(id);

        return {
            id
        };
    }
    //
    const actionName = DELETE + LOT_TEMPLATE;
    const payload = await api_action(actionName, callback, dispatch, {id});
    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update
// ******************************
export const putLotTemplate = (lotTemplate, id) => async dispatch => {

    const callback = async () => {
        const response = await api.putLotTemplate(lotTemplate, id);

        return {
            lotTemplate: response,
        };
    }

    const actionName = PUT + LOT_TEMPLATE;
    const payload = await api_action(actionName, callback, dispatch, {lotTemplate, id});
    return payload;
};
