import {
  POST_DASHBOARDS,
  POST_DASHBOARDS_STARTED,
  POST_DASHBOARDS_SUCCESS,
  POST_DASHBOARDS_FAILURE,
} from "../types/dashboard_types";

import * as api from "../../api/dashboards_api";

export const getPlan = (condition) => {
  return async (dispatch) => {
    function onStart() {
      dispatch({ type: "PLAN_STARTED" });
    }
    function onSuccess(response) {
      dispatch({ type: "PLAN_SUCCESS", payload: response });
      return response;
    }
    function onError(error) {
      dispatch({ type: "PLAN_FAILURE", payload: error });
      return error;
    }

    try {
      onStart();
      const newDashboards = await api.postDashboards(dashboards);
      console.log("Post Dashbord response", newDashboards);
      return onSuccess(newDashboards);
    } catch (error) {
      return onError(error);
    }
  };
};
