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
  LOT,
  LOTS,
} from '../types/data_types'



const defaultState = {
  lots: {},
};

export default function lotsReducer(state = defaultState, action) {

  switch (action.type) {
    case GET + LOT + SUCCESS:
      return {
        ...state,
        lots: {...state.lots, [action.payload.lot._id]: action.payload.lot},
      }

    case GET + LOTS + SUCCESS:
      return {
        ...state,
        lots: {...state.lots, ...action.payload.lots},
      }

    case PUT + LOT + SUCCESS:
      return {
        ...state,
        lots: {...state.lots, [action.payload.lot._id]: action.payload.lot},
      }

    case POST + LOT + SUCCESS:
      return {
        ...state,
        lots: {...state.lots, [action.payload.lot._id]: action.payload.lot},
      }

    case DELETE + LOT + SUCCESS:
      const { [action.payload.lotId]: value, ...rest } = state.lots; // extracts payload lot from rest

      return {
        ...state,
        lots: {...rest},
      }

    default:
      return state
  }
}
