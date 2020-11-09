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
  CARDS
} from '../types/data_types'

import {uuidv4} from "../../methods/utils/utils";

var count = 0

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const STATION_NAMES = [
    "d5d852d1-58ae-46b1-bbc3-717ad0bcc11b",
  "d3cb02a4-0402-4253-9ef8-90ab00ade680",
  "1b4ab529-5faa-460f-a0a3-8690ef683d59",
  "96ac8ba8-209e-4050-b16e-2333b56e3923",
  "1807a2b4-e2f0-47f8-861d-b080007cbd07",
  "7eabf577-96f0-440f-adad-4d69a593289a"
]

const getCard = () => {
  const id = uuidv4()
  count = count + 1

  return [id,
    {
      _id: id,
      name: "card" + count,
      stationId: STATION_NAMES[getRandomInt(STATION_NAMES.length - 1)]
    }
  ]
}


let TEMP_CARDS = {


}

for (let i = 0; i < 10; i++) {
  let card = getCard()
  TEMP_CARDS[card[0]] = card[1]
}

const defaultState = {

  cards: TEMP_CARDS,
  error: {},
  pending: false
};

export default function cardsReducer(state = defaultState, action) {

  switch (action.type) {
    case PUT + CARD + SUCCESS:
      return {
        ...state,
        // processes: action.payload,
        pending: false,
      }

    default:
      return state
  }
}
