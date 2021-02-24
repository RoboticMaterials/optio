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

import * as api from "../../api/poses_api";

// import logger
import log from "../../logger.js";

import { poseSchema, posesSchema } from "../../normalizr/poses_schema";

import { normalize, schema } from "normalizr";

const logger = log.getLogger("Poses", "Poses");

export const getPoses = () => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: GET_POSES_STARTED });
    }
    function onSuccess(poseEntities) {
      dispatch({ type: GET_POSES_SUCCESS, payload: poseEntities });
      return poseEntities;
    }
    function onError(error) {
      dispatch({ type: GET_POSES_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const poses = await api.getPoses();
      logger.debug("poses", poses);

      const normalizedData = normalize(poses, posesSchema);
      logger.debug("normalizedData", normalizedData);

      const poseEntities = normalizedData.entities.poses;
      logger.debug("poseEntities", poseEntities);

      return onSuccess(poseEntities);
    } catch (error) {
      return onError(error);
    }
  };
};
