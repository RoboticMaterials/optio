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
  CARD,
  CARDS,
  CARD_HISTORY,
  PROCESS_CARDS,
  SHOW_EDITOR,
  SHOW_FORM_EDITOR,
  SHOW_BARCODE_MODAL

} from '../types/data_types'

const defaultState = {

  cards: {},
  processCards: {},
  cardHistories: {},
  error: {},
  pending: false,
  showEditor:false,
  showFormEditor:false,
  showBarcodeModal: false,

};

export default function cardsReducer(state = defaultState, action) {
  let processCards = {}

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

    case PUT + CARD + SUCCESS:
      return {
        ...state,
        cards: {...state.cards, [action.payload.card._id]: action.payload.card},
        processCards: {...state.processCards, [action.payload.processId]: {
            ...state.processCards[action.payload.processId], [action.payload.card._id]: action.payload.card
          }},
        pending: false,
      }

    case POST + CARD + SUCCESS:
      return {
        ...state,
        cards: {...state.cards, [action.payload.card._id]: action.payload.card},
        processCards: {...state.processCards, [action.payload.processId]: {
            ...state.processCards[action.payload.processId], [action.payload.card._id]: action.payload.card
          }},
        pending: false,
      }

    case DELETE + CARD + SUCCESS:
      const { [action.payload.cardId]: value, ...rest } = state.cards; // extracts payload lot from rest
      const {

        [action.payload.processId]: {[action.payload.cardId]: removedCard, ...remaining} ,
        ...unchangedProcessGroups

      } = state.processCards; // extracts payload lot from rest

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
