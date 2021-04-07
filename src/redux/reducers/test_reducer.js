import {
  PUT
} from '../types/prefixes';

import {
  JUNK
} from '../types/data_types'


const defaultState = {
  junkData: {},
};

export default function cardsReducer(state = defaultState, action) {

  switch (action.type) {
    case PUT + JUNK:
      return {
        ...state,
        junkData: {...state.junkData, [action.payload.junkData.id]: action.payload.junkData},
      }

    default:
      return state
  }
}
