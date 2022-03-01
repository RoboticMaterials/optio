import {
  GET,
  POST,
  DELETE,
  PUT,

  ADD,
  UPDATE,
  REMOVE,
} from '../types/prefixes';

import {
  SUCCESS,
} from '../types/suffixes'

import {
  CARD,
  CARDS,
  CARD_HISTORY,
  PROCESS_CARDS,
  STATION_CARDS,
  SHOW_EDITOR,
  SHOW_FORM_EDITOR,
  SHOW_BARCODE_MODAL

} from '../types/data_types'

import { deepCopy } from '../../methods/utils/utils';

const defaultState = {

  cards: {},
  processCards: {},
  stationCards: {},
  cardHistories: {},
  error: {},
  pending: false,
  showEditor:false,
  showFormEditor:false,
  showBarcodeModal: false,

};

export default function cardsReducer(state = defaultState, action) {
  let processCards = {}
  let statCards = {}
  switch (action.type) {
    case GET + CARD + SUCCESS:
      return {
        ...state,
        cards: {...state.cards, [action.payload.card._id]: action.payload.card},
        pending: false,
      }

    case GET + CARDS + SUCCESS:

      Object.values(action.payload.cards).forEach((card,index) => {
        if(processCards[card.process_id]) {
          processCards[card.process_id][card._id] = card
        } else {
          processCards[card.process_id] = {
            [card._id]: card
          }
        }
      })
      return {
        ...state,
        cards: {...state.cards, ...action.payload.cards},
        processCards: processCards,
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

    case GET + STATION_CARDS + SUCCESS:
      return {
        ...state,
        stationCards: {...state.stationCards, [action.payload.stationId]: {
          ...action.payload.cards
          }},
        pending: false,
      }

    case PUT + CARD + SUCCESS:

      return {
        ...state,
        cards: {...state.cards, [action.payload.card._id]: action.payload.card},
        processCards: {...state.processCards, [action.payload.card.process_id]: {
            ...state.processCards[action.payload.card.process_id], [action.payload.card._id]: action.payload.card
          }},
        pending: false,
      }

    case POST + CARD + SUCCESS:
      return {
        ...state,
        cards: {...state.cards, [action.payload.card._id]: action.payload.card},
        processCards: {...state.processCards, [action.payload.card.process_id]: {
            ...state.processCards[action.payload.card.process_id], [action.payload.card._id]: action.payload.card
          }},
        pending: false,
      }

    case DELETE + CARD + SUCCESS:
      let cardsCopy = deepCopy(state.cards);
      let processCardsCopy = deepCopy(state.processCards);

      const processId = cardsCopy[action.payload.cardId]?.process_id
      delete cardsCopy[action.payload.cardId];

      if (!processId) {
        delete processCardsCopy[processId][action.payload.cardId];
      }

      return {
        ...state,
        cards: cardsCopy,
        processCards: processCardsCopy,
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

      case SHOW_EDITOR:
          return {
              ...state,
              showEditor: action.payload,
          }

    case SHOW_FORM_EDITOR:
      return {
        ...state,
        showFormEditor: action.payload,
      }

    case SHOW_BARCODE_MODAL:
      return {
        ...state,
        showBarcodeModal: action.payload,
      }

    default:
      return state
  }
}
