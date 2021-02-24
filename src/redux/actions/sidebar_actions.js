import {
  SET_MODE,
  SET_ACTION,
  SET_WIDTH,
  SET_OPEN,
} from "../types/sidebar_types";

export const setMode = (mode) => {
  return { type: SET_MODE, payload: { mode } };
};

export const setAction = (action) => {
  return { type: SET_ACTION, payload: { action } };
};

export const setWidth = (width) => {
  return { type: SET_WIDTH, payload: width };
};

export const setOpen = (state) => {
  return { type: SET_OPEN, payload: state };
};
