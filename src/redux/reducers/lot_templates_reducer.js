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
  LOT_TEMPLATE,
  LOT_TEMPLATES
} from '../types/data_types'



const defaultState = {
  lotTemplates: {},
};

export default function lotTemplatesReducer(state = defaultState, action) {

  switch (action.type) {
    case GET + LOT_TEMPLATE + SUCCESS:
      return {
        ...state,
        lotTemplates: {...state.lotTemplates, [action.payload.lotTemplate._id]: action.payload.lotTemplate},
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
        lotTemplates: {...state.lotTemplates, [action.payload.lotTemplate._id]: action.payload.lotTemplate},
        pending: false,
      }

    case DELETE + LOT_TEMPLATE + SUCCESS:
      const { [action.payload.id]: value, ...rest } = state.lotTemplates; // extracts payload from rest

      return {
        ...state,
        lotTemplates: {...rest},
        pending: false,
      }

    default:
      return state
  }
}
