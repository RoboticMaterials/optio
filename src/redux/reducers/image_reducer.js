import {
  GET_POSES,
  GET_POSES_STARTED,
  GET_POSES_SUCCESS,
  GET_POSES_FAILURE,
  GET_POSE,
  GET_POSE_STARTED,
  GET_POSE_SUCCESS,
  GET_POSE_FAILURE,
} from "../types/poses_types";

import log from "../../logger.js";

const logger = log.getLogger("Poses", "Poses");

const defaultState = {
  poses: {},
  error: {},
  pending: false,
};

export default function posesReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_POSES_SUCCESS:
      return Object.assign({}, state, {
        poses: { ...action.payload },
        pending: false,
      });

    case GET_POSES_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
        pending: false,
      });

    case GET_POSES_STARTED:
      return Object.assign({}, state, {
        pending: true,
      });

    default:
      return state;
  }
}
