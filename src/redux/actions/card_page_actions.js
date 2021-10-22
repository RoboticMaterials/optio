import { SET } from "../types/prefixes"
import {LOT_DRAGGING, LOT_DROPPING, COLUMN_HOVERING, FIELD_DRAGGING, SET_SIZE, LOT_HOVERING, DRAGGING_STATION_ID, DRAG_FROM_BIN} from "../types/ui_types"

export const setDroppingLotId = (lotId, binId) => async dispatch => {
	dispatch({ type: SET + LOT_DROPPING, payload: {lotId, binId} });
}

export const setDraggingLotId = (lotId) => async dispatch => {
	dispatch({ type: SET + LOT_DRAGGING, payload: {lotId} });
}

export const setLotHovering = (lotId) => async dispatch => {
	dispatch({ type: SET + LOT_HOVERING, payload: {lotId} });
}


export const setFieldDragging = (bool) => async dispatch => {
	dispatch({ type: SET + FIELD_DRAGGING, payload: bool });
}

export const setColumnHovering = (isHoveringOverColumn) => async dispatch => {
	dispatch({ type: SET + COLUMN_HOVERING, payload: isHoveringOverColumn });
}

export const setDraggingStationId = (stationId) => async dispatch => {
	dispatch({ type: DRAGGING_STATION_ID, payload: stationId});
}

export const setDragFromBin = (stationId) => async dispatch => {
	dispatch({ type: DRAG_FROM_BIN, payload: stationId});
}
