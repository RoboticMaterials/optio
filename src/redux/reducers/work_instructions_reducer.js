import {
    GET,
    POST,
    DELETE,
    PUT
} from '../types/prefixes';

import {
    SUCCESS,
} from '../types/suffixes'

import {
    WORK_INSTRUCTION,
    WORK_INSTRUCTIONS
} from '../types/data_types'

const defaultState = {
    workInstructions: {},
    pending: false
};

export default function workInstructionsReducer(state = defaultState, action) {

    switch (action.type) {
        case GET + WORK_INSTRUCTION + SUCCESS:
            return {
                ...state,
                workInstructions: {...state.workInstructions, [action.payload.workInstruction._id]: action.payload.workInstruction},
                pending: false,
            }

        case GET + WORK_INSTRUCTIONS + SUCCESS:
            return {
                ...state,
                workInstructions: {...state.workInstructions, ...action.payload.workInstructions},
                pending: false,
            }

        case PUT + WORK_INSTRUCTION + SUCCESS:
            return {
                ...state,
                workInstructions: {...state.workInstructions, [action.payload.workInstruction._id]: action.payload.workInstruction},
                pending: false,
            }

        case POST + WORK_INSTRUCTION + SUCCESS:
            return {
                ...state,
                workInstructions: {...state.workInstructions, [action.payload.workInstruction._id]: action.payload.workInstruction},
                pending: false,
            }

        case DELETE + WORK_INSTRUCTION + SUCCESS:
            const { [action.payload.id]: value, ...rest } = state.workInstructions; // extracts payload from rest

            return {
                ...state,
                workInstructions: {...rest},
                pending: false,
            }

        default:
            return state
    }
}
