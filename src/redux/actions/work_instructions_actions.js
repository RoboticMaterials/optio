import { normalize } from 'normalizr';

// import types
import {
    GET,
    POST,
    DELETE,
    PUT
} from '../types/prefixes';

import {
    WORK_INSTRUCTIONS,
    WORK_INSTRUCTION,
} from '../types/data_types';

import { api_action } from './index';
import * as api from '../../api/work_instructions_api'

// import schema
import { scheduleSchema, schedulesSchema } from '../../normalizr/schedules_schema';

import log from "../../logger"
import {convertArrayToObject} from "../../methods/utils/utils";

const logger = log.getLogger("Cards", "Redux")
logger.setLevel("debug")



// get
// ******************************
export const getWorkInstruction = (id) =>  async (dispatch) => {

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        const workInstruction = await api.getWorkInstruction(id);

        // const cardsObj = convertArrayToObject(cards, "_id")
        // console.log("getCard cardsObj",cardsObj)

        // format response
        // const normalizedSchedules = normalize(schedules, schedulesSchema);

        // return payload for redux
        return {
            workInstruction,
        };
    }

    const actionName = GET + WORK_INSTRUCTION;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch, id);

    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get
// ******************************
export const getWorkInstructions = () =>  async (dispatch) => {

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        const workInstructions = await api.getWorkInstructions();

        const workInstructionsObj = convertArrayToObject(workInstructions, "_id")

        // return payload for redux
        return {
            workInstructions: workInstructionsObj,
        };
    }

    const actionName = GET + WORK_INSTRUCTIONS;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch);

    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// create
// ******************************
export const postWorkInstruction = (workInstruction) =>  async dispatch => {

    const callback = async () => {
        const createdWorkInstruction = await api.postWorkInstruction(workInstruction);
        // const normalizedSchedules = normalize(createdSchedule, scheduleSchema);

        return {
            workInstruction: createdWorkInstruction,
        };
    }
    //
    const actionName = POST + WORK_INSTRUCTION;

    const payload = await api_action(actionName, callback, dispatch, workInstruction);

    return payload.workInstruction
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteWorkInstruction = (id) => async (dispatch) => {

    const callback = async () => {
        await api.deleteWorkInstruction(id);

        return {
            id,
        };
    }
    //
    const actionName = DELETE + WORK_INSTRUCTION;
    const payload = await api_action(actionName, callback, dispatch, id);
    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update
// ******************************
export const putCard = (workInstruction, id) => async dispatch => {

    const callback = async () => {
        const response = await api.putWorkInstruction(workInstruction, id);

        return {
            workInstruction: response,
        };
    }

    const actionName = PUT + WORK_INSTRUCTION;
    const payload = await api_action(actionName, callback, dispatch, { workInstruction, id});
    return workInstruction;
};


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
