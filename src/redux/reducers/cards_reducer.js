import {
  GET,
  POST,
  DELETE,
  PUT
} from '../types/prefixes';

import {
  STARTED,
  SUCCESS,
  FAILURE
} from '../types/suffixes'

import {
  CARD,
  CARDS,
  CARD_HISTORY,
  PROCESS_CARDS
} from '../types/data_types'

import {uuidv4} from "../../methods/utils/utils";


const defaultState = {

  cards: {},
  processCards: {},
  cardHistories: {},
  error: {},
  pending: false
};

export default function cardsReducer(state = defaultState, action) {

  switch (action.type) {
    case GET + CARD + SUCCESS:
      return {
        ...state,
        cards: {...state.cards, [action.payload.card._id]: action.payload.card},
        pending: false,
      }

    case GET + CARDS + SUCCESS:
      return {
        ...state,
        cards: {...state.cards, ...action.payload.cards},
        pending: false,
      }

    case GET + PROCESS_CARDS + SUCCESS:
      return {
        ...state,
        processCards: {...state.processCards, [action.payload.processId]: {
          ...state.processCards[action.payload.processId], ...action.payload.cards
          }},
        pending: false,
      }

    case PUT + CARD + SUCCESS:
      console.log("PUT + CARD + SUCCESS action", action)
      return {
        ...state,
        cards: {...state.cards, [action.payload.card._id]: action.payload.card},
        processCards: {...state.processCards, [action.payload.processId]: {
            ...state.processCards[action.payload.processId], [action.payload.card._id]: action.payload.card
          }},
        pending: false,
      }

    case POST + CARD + SUCCESS:
      console.log("PUT + CARD + SUCCESS action", action)
      return {
        ...state,
        cards: {...state.cards, [action.payload.card._id]: action.payload.card},
        processCards: {...state.processCards, [action.payload.processId]: {
            ...state.processCards[action.payload.processId], [action.payload.card._id]: action.payload.card
          }},
        pending: false,
      }

    case DELETE + CARD + SUCCESS:
      console.log("DELETE + CARD + SUCCESS action", action)
      const { [action.payload.cardId]: value, ...rest } = state.cards; // extracts payload card from rest
      const {

        [action.payload.processId]: {[action.payload.cardId]: removedCard, ...remaining} ,
        ...unchangedProcessGroups

      } = state.processCards; // extracts payload card from rest

      return {
        ...state,
        cards: {...rest},
        processCards: {...unchangedProcessGroups, [action.payload.processId]: remaining},
        pending: false,
      }

    case GET + CARD_HISTORY + SUCCESS:
      return {
        ...state,
        cardHistories: {...state.cardHistories, [action.payload.cardHistory.card_id]: action.payload.cardHistory},
        pending: false,
      }

    case POST + CARD_HISTORY + SUCCESS:
      return {
        ...state,
        cardHistories: {...state.cardHistories, [action.payload.cardHistory.card_id]: action.payload.cardHistory},
        pending: false,
      }

    case PUT + CARD_HISTORY + SUCCESS:
      return {
        ...state,
        cardHistories: {...state.cardHistories, [action.payload.cardHistory.card_id]: action.payload.cardHistory},
        pending: false,
      }

    default:
      return state
  }
}
