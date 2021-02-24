import {
  GET_MODELS,
  GET_MODELS_STARTED,
  GET_MODELS_SUCCESS,
  GET_MODELS_FAILURE,
} from "../types/models_types";

import * as api from "../../api/models_api";

//import logger
import log from "../../logger.js";

import { modelSchema, modelsSchema } from "../../normalizr/models_schema";

import { normalize, schema } from "normalizr";

const logger = log.getLogger("Models", "Models");

// get
// ******************************
export const getModels = () => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: GET_MODELS_STARTED });
    }
    function onSuccess(models) {
      dispatch({ type: GET_MODELS_SUCCESS, payload: models });
      return models;
    }
    function onError(error) {
      dispatch({ type: GET_MODELS_FAILURE, payload: error });
      return error;
    }

    try {
      onStart();
      const models = await api.getModels();
      logger.debug("getModels: models", models);

      // models are currently returned as array of strings
      // so no need to normalize
      // if model response fomat changes to objects,
      // uncomment this block and update schema as necessary
      /*

      const normalizedData = normalize(models, modelsSchema);
      logger.debug("normalizedData", normalizedData)

      const modelEntities = normalizedData.entities.models;
      logger.debug("modelEntities", modelEntities)
      */

      return onSuccess(models);
    } catch (error) {
      return onError(error);
    }
  };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
