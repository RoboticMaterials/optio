import { normalize } from "normalizr";

// import types
import { GET, POST, DELETE, PUT } from "../types/prefixes";

import { JUNK } from "../types/data_types";

import { api_action } from "./index";
import * as api from "../../api/cards_api";

import log from "../../logger";
import { convertArrayToObject } from "../../methods/utils/utils";

import uuid from "uuid";
import { SUCCESS } from "../types/suffixes";

const logger = log.getLogger("Junk", "Redux");
logger.setLevel("debug");

// update
// ******************************
export const putJunk = () => async (dispatch) => {
  const junkData = {
    _id: uuid.v4(),
    text: "alemfsefmseklfmsel",
    text1: "alemfsefmseklfmsel",
    text2: "alemfsefmseklfmsel",
    text3: "alemfsefmseklfmsel",
    text4: "alemfsefmseklfmsel",
    text5: "alemfsefmseklfmsel",
    text6: "alemfsefmseklfmsel",
    text7: "alemfsefmseklfmsel",
    text8: "alemfsefmseklfmsel",
  };
  dispatch({ type: PUT + JUNK, payload: { junkData } });
};
