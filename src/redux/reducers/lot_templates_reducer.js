import {
  GET,
  POST,
  DELETE,
  PUT, SET
} from '../types/prefixes';

import {
  STARTED,
  SUCCESS,
  FAILURE, SELECTED
} from '../types/suffixes'

import {
  LOT_TEMPLATE,
  LOT_TEMPLATES
} from '../types/data_types'
import {createActionType} from "../actions/redux_utils";
import * as prefixes from "../types/prefixes";
import * as dataTypes from "../types/data_types";



const defaultState = {
  lotTemplates: {},
  selectedLotTemplatesId: ""
};

export default function lotTemplatesReducer(state = defaultState, action) {

  switch (action.type) {

    case createActionType([prefixes.SET, dataTypes.LOT_TEMPLATE]): {
      return {
        ...state,
        lotTemplates: {...state.lotTemplates, [action.payload.id]: {...action.payload}},
      }
    }

    case createActionType([prefixes.REMOVE, dataTypes.LOT_TEMPLATE]): {
      const {
        [action.payload.id]: removed,
        ...remaining
      } = state.lotTemplates

      return {
        ...state,
        lotTemplates: { ...remaining },
      }
    }

    case GET + LOT_TEMPLATE + SUCCESS:
      return {
        ...state,
        lotTemplates: {...state.lotTemplates, [action.payload.lotTemplate.id]: action.payload.lotTemplate},
        pending: false,
      }

    case GET + LOT_TEMPLATES + SUCCESS:
      return {
        ...state,
        lotTemplates: {...state.lotTemplates, ...action.payload.lotTemplates},
        pending: false,
      }

    case POST + LOT_TEMPLATE + SUCCESS:
    case PUT + LOT_TEMPLATE + SUCCESS:
      return {
        ...state,
        lotTemplates: {...state.lotTemplates, [action.payload.lotTemplate.id]: action.payload.lotTemplate},
        pending: false,
      }

    case DELETE + LOT_TEMPLATE + SUCCESS:
      const { [action.payload.id]: value, ...rest } = state.lotTemplates; // extracts payload from rest

      return {
        ...state,
        lotTemplates: {...rest},
        pending: false,
      }

      case SET + LOT_TEMPLATE + SELECTED: {
        return {
          ...state,
          selectedLotTemplatesId: action.payload
        }
      }

    default:
      return state
  }
}
