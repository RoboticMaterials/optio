import { SET } from "../types/prefixes"
import {CARD_DRAGGING, COLUMN_HOVERING, FIELD_DRAGGING, SET_SIZE} from "../types/ui_types"

export const setCardDragging = (lotId, binId) => async dispatch => {
	dispatch({ type: SET + CARD_DRAGGING, payload: {lotId, binId} });
}

export const setFieldDragging = (bool) => async dispatch => {
	dispatch({ type: SET + FIELD_DRAGGING, payload: bool });
}

export const setColumnHovering = (isHoveringOverColumn) => async dispatch => {
	dispatch({ type: SET + COLUMN_HOVERING, payload: isHoveringOverColumn });
}
