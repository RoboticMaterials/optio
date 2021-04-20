// import types
import {
    GET
} from '../types/prefixes';

import {
    USER
} from '../types/data_types';

import { api_action } from './index';
import * as api from '../../api/user_api'

import {createActionType} from "./redux_utils";

// get
// ******************************
export const getUser = (userId) =>  async (dispatch) => {

    const callback = async () => {

        const user = await api.getUser(userId)

        return user
        
    }

    const actionName = createActionType([GET, USER])  

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch, userId);

    return payload;

};