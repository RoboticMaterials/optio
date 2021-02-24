import { SET } from "../types/prefixes";
import { CARD_DRAGGING, COLUMN_HOVERING, SET_SIZE } from "../types/ui_types";

const defaultState = {
  isCardDragging: false,
  isHoveringOverColumn: false,
  sizes: {},
  draggedLotInfo: {},
};

const cardPageReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET + CARD_DRAGGING:
      return {
        ...state,
        draggedLotInfo: action.payload,
      };

    case SET_SIZE:
      return {
        ...state,
        sizes: {
          ...state.sizes,
          [action.payload.processId]: action.payload.size,
        },
      };

    case SET + COLUMN_HOVERING:
      return {
        ...state,
        isHoveringOverColumn: action.payload,
      };

    default:
      return state;
  }
};

export default cardPageReducer;
