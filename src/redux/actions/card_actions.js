import { normalize } from 'normalizr';

// import types
import {
    GET,
    POST,
    DELETE,
    PUT
} from '../types/prefixes';

import {
    CARDS,
    CARD,
    CARD_HISTORY,
    PROCESS_CARDS
} from '../types/data_types';

import { api_action } from './index';
import * as api from '../../api/cards_api'

// import schema
import { scheduleSchema, schedulesSchema } from '../../normalizr/schedules_schema';

import log from "../../logger"
import {convertArrayToObject} from "../../methods/utils/utils";

const logger = log.getLogger("Cards", "Redux")
logger.setLevel("debug")
// get
// ******************************
export const getCard = (cardId) =>  async (dispatch) => {
    logger.log("actions getCard cardId",cardId)

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        const card = await api.getCard(cardId);
        console.log("getCard card",card)

        // const cardsObj = convertArrayToObject(cards, "_id")
        // console.log("getCard cardsObj",cardsObj)

        // format response
        // const normalizedSchedules = normalize(schedules, schedulesSchema);

        // return payload for redux
        return {
            card,
        };
    }

    const actionName = GET + CARD;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch);

    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get
// ******************************
export const getCards = () =>  async (dispatch) => {

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        const cards = await api.getCards();
        console.log("getCards cards",cards)

        const cardsObj = convertArrayToObject(cards, "_id")
        console.log("getCards cardsObj",cardsObj)

        // format response
        // const normalizedSchedules = normalize(schedules, schedulesSchema);

        // return payload for redux
        return {
            cards: cardsObj,
        };
    }

    const actionName = GET + CARDS;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch);

    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get
// ******************************
export const getProcessCards = (processId) =>  async (dispatch) => {

    /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
    const callback = async () => {

        // make request
        const cards = await api.getProcessCards(processId);
        console.log("getProcessCards cards",cards)

        const cardsObj = convertArrayToObject(cards, "_id")
        console.log("getProcessCards cardsObj",cardsObj)

        // return payload for redux
        return {
            cards: cardsObj,
            processId
        };
    }

    const actionName = GET + PROCESS_CARDS;

    // payload is returned back
    const payload = await api_action(actionName, callback, dispatch);

    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// create
// ******************************
export const postCard = (card) =>  async dispatch => {

    const callback = async () => {
        const createdCard = await api.postCard(card);
        console.log("postCard createdCard",createdCard)
        console.log("postCard card",card)
        // const normalizedSchedules = normalize(createdSchedule, scheduleSchema);

        return {
            card: createdCard,
            processId: card.process_id
        };
    }
    //
    const actionName = POST + CARD;

    const payload = await api_action(actionName, callback, dispatch, card);

    // return Object.values(payload.createdCards)[0];

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteCard = (cardId, processId) => async (dispatch) => {

    const callback = async () => {
        await api.deleteCard(cardId);

        return {
            cardId,
            processId
        };
    }
    //
    const actionName = DELETE + CARD;
    const payload = await api_action(actionName, callback, dispatch, cardId);
    return payload;

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update
// ******************************
export const putCard = (card, cardID) => async dispatch => {
    console.log("putCard card", card)
    console.log("putCard  cardID",  cardID)

    const callback = async () => {
        const response = await api.putCard(card, cardID);
        console.log("putCard response",response)
        // const normalizedSchedule = normalize(response, scheduleSchema);
        //
        return {
            card: response,
            processId: card.process_id
        };
    }

    const actionName = PUT + CARD;
    const payload = await api_action(actionName, callback, dispatch, { card});
    return card;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

