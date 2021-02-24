import { normalize } from "normalizr";

// import types
import { GET, POST, DELETE, PUT } from "../types/prefixes";

import { LOT, LOTS } from "../types/data_types";

import { api_action } from "./index";

// import schema
import {
  scheduleSchema,
  schedulesSchema,
} from "../../normalizr/schedules_schema";

import log from "../../logger";
import { convertArrayToObject } from "../../methods/utils/utils";
import * as api from "../../api/lots_api";

const logger = log.getLogger("Lots", "Redux");
logger.setLevel("debug");
// get
// ******************************
export const getLot = (lotId) => async (dispatch) => {
  /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
  const callback = async () => {
    // make request
    const lot = await api.getLot(lotId);

    // const cardsObj = convertArrayToObject(cards, "_id")
    // console.log("getCard cardsObj",cardsObj)

    // format response
    // const normalizedSchedules = normalize(schedules, schedulesSchema);

    // return payload for redux
    return {
      lot,
    };
  };

  const actionName = GET + LOT;

  // payload is returned back
  const payload = await api_action(actionName, callback, dispatch);

  return payload;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get
// ******************************
export const getLots = () => async (dispatch) => {
  /*
        Invoked in api_action()
        Whatever is returned from this function is the payload
        that will be dispatched to redux (if successful)
    */
  const callback = async () => {
    // make request
    const lots = await api.getLots();

    const lotsObj = convertArrayToObject(lots, "_id");

    // format response
    // const normalizedSchedules = normalize(schedules, schedulesSchema);

    // return payload for redux
    return {
      lots: lotsObj,
    };
  };

  const actionName = GET + LOTS;

  // payload is returned back
  const payload = await api_action(actionName, callback, dispatch);

  return payload;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get
// ******************************
// export const getProcessCards = (processId) =>  async (dispatch) => {
//
//     /*
//         Invoked in api_action()
//         Whatever is returned from this function is the payload
//         that will be dispatched to redux (if successful)
//     */
//     const callback = async () => {
//
//         // make request
//         const cards = await api.getProcessCards(processId);
//         console.log("getProcessCards cards",cards)
//
//         const cardsObj = convertArrayToObject(cards, "_id")
//         console.log("getProcessCards cardsObj",cardsObj)
//
//         // return payload for redux
//         return {
//             cards: cardsObj,
//             processId
//         };
//     }
//
//     const actionName = GET + PROCESS_CARDS;
//
//     // payload is returned back
//     const payload = await api_action(actionName, callback, dispatch);
//
//     return payload;
//
// };
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// create
// ******************************
export const postLot = (lot) => async (dispatch) => {
  const callback = async () => {
    const createdLot = await api.postLot(lot);
    // const normalizedSchedules = normalize(createdSchedule, scheduleSchema);

    return {
      lot: createdLot,
      processId: lot.process_id,
    };
  };
  //
  const actionName = POST + LOT;

  const payload = await api_action(actionName, callback, dispatch, lot);

  return payload.lot;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteLot = (lotId, processId) => async (dispatch) => {
  const callback = async () => {
    await api.deleteLot(lotId);

    return {
      lotId,
      processId,
    };
  };
  //
  const actionName = DELETE + LOT;
  const payload = await api_action(actionName, callback, dispatch, lotId);
  return payload;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// update
// ******************************
export const putLot = (lot, lotId) => async (dispatch) => {
  const callback = async () => {
    const response = await api.putLot(lot, lotId);
    // const normalizedSchedule = normalize(response, scheduleSchema);
    //
    return {
      lot: response,
      processId: lot.process_id,
    };
  };

  const actionName = PUT + LOT;
  const payload = await api_action(actionName, callback, dispatch, { lot });
  return lot;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
