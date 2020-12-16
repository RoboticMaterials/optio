import { SET } from "../types/prefixes"
import {CARD_DRAGGING, COLUMN_HOVERING, SET_SIZE} from "../types/ui_types"

export const setCardDragging = (isCardDragging) => async dispatch => {
	dispatch({ type: SET + CARD_DRAGGING, payload: isCardDragging });
}

export const setColumnHovering = (isHoveringOverColumn) => async dispatch => {
	dispatch({ type: SET + COLUMN_HOVERING, payload: isHoveringOverColumn });
}

export const setSize = (processId, size) => async dispatch => {
	dispatch({type: SET_SIZE, payload: {processId, size}})
}
