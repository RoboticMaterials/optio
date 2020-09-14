import {
    STARTED,
    SUCCESS,
    FAILURE
} from '../types/suffixes';


import { getActionName } from "../../methods/utils/redux_utils";

const requestStatusReducer = (state = {}, action) => {

    const { type } = action;
    const actionName = getActionName(type);

    if (!actionName) {
        return {
             ...state,
        }
    }

    if (type.endsWith(STARTED)) {
        return {
             ...state,
             [actionName]: {
                 pending: true
             }
        };
    }

    if (type.endsWith(SUCCESS) || type.endsWith(FAILURE)) {
        return {
             ...state,
             [actionName]: {
                 pending: false
             }
        };
    }

    return {
        ...state
    };
};

export default requestStatusReducer;
