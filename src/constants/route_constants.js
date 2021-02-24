import { DEVICE_CONSTANTS } from "./device_constants";
import uuid from "uuid";

export const ROUTE_TYPES = {
  PUSH: "push",
  PULL: "pull",
};

/*
 * NOTE: DO NOT GENERATE ID HERE, OTHERWISE IT WILL ONLY BE GENERATED ONCE ON LOAD AND NEW TASKS WILL ALL HAVE THE SAME ID
 * */
export const defaultTask = {
  name: "",
  obj: null,
  type: ROUTE_TYPES.PUSH,
  quantity: 1,
  device_types: [],
  handoff: true,
  track_quantity: true,
  map_id: null,
  new: true,
  processes: [],
  load: {
    position: null,
    station: null,
    sound: null,
    instructions: "Load",
    timeout: "09:00",
  },
  unload: {
    position: null,
    station: null,
    sound: null,
    instructions: "Unload",
  },
};
