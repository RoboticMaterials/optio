import { normalize } from 'normalizr';

// import types
import {
    GET,
    POST,
    DELETE,
    PUT
} from '../types/prefixes';

import {
    CARD_HISTORY,
} from '../types/data_types';

import { api_action } from './index';

import log from "../../logger"
import * as api from "../../api/card_history_api";
import {convertArrayToObject} from "../../methods/utils/utils";

const logger = log.getLogger("Card History", "Redux")

// get
// ******************************
export const getCardHistory = (cardId) =>  async (dispatch) => {

    const callback = async () => {

        // make request
        const card = await api.getCardHistory(cardId);
        console.log("getCardHistory lot",card)

        // const cardsObj = convertArrayToObject(cards, "_id")
        // console.log("getCards cardsObj",cardsObj)

        // format response
        // const normalizedSchedules = normalize(schedules, schedulesSchema);

        // return payload for redux
        return {
            cardHistory: card,
        };
    }

    const actionName = GET + CARD_HISTORY;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch);

    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

