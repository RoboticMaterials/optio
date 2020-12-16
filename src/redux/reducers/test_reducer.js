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
        junkData: {...state.junkData, [action.payload.junkData._id]: action.payload.junkData},
      }

    default:
      return state
  }
}
