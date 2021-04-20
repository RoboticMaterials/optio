// import types
import {
    GET
} from '../types/prefixes';

import {
    USER
} from '../types/data_types';

import { api_action } from './index';
import * as api from '../../api/organization_api'

import {createActionType} from "./redux_utils";

// get
// ******************************
export const getOrg = (orgId) =>  async (dispatch) => {

    const callback = async () => {

        const organization = await api.getOrg(orgId)

        return {
            ...organization
        };
    }

    const actionName = createActionType([GET, USER])  

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch, orgId);

    return payload;

};