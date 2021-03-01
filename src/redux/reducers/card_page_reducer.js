import { SET } from "../types/prefixes"
import {LOT_DRAGGING, COLUMN_HOVERING, LOT_HOVERING, FIELD_DRAGGING, SET_SIZE, LOT_DROPPING} from "../types/ui_types"


const defaultState = {
	isCardDragging: false,
	isFieldDragging: null,
	isHoveringOverColumn: false,
	hoveringLotId: null,
	sizes: {},
	droppedLotInfo: {},
	draggingLotId: null
}

const cardPageReducer = (state = defaultState, action) => {


	switch (action.type) {
		case SET + LOT_DROPPING:
			return {
				...state,
				droppedLotInfo: action.payload
			}

		case SET + LOT_DRAGGING:
			return {
				...state,
				draggingLotId: action.payload.lotId
			}

		case SET + LOT_HOVERING: {
			return {
				...state,
				hoveringLotId: action.payload.lotId
			}
		}



		case SET + FIELD_DRAGGING:
			return {
				...state,
				isFieldDragging: action.payload
			}

		case SET_SIZE:
			return {
				...state,
				sizes: {...state.sizes, [action.payload.processId]: action.payload.size},
			}

		case SET + COLUMN_HOVERING:
			return {
				...state,
				isHoveringOverColumn: action.payload
			}


		default:
			return state
	}
}

export default cardPageReducer