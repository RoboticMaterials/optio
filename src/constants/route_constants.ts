import {DEVICE_CONSTANTS} from "./device_constants";
import {v4 as uuid} from "uuid"

export const CUSTOM_TASK_ID = "custom_task"
export const CUSTOM_CHARGE_TASK_ID = "custom_task_charge"
export const CUSTOM_IDLE_TASK_ID = "custom_task_idle"
export const CUSTOM_IDLE_TASK_NAME = "Send to Idle Location"



export const ROUTE_TYPES = {
    PUSH: "push",
    PULL: "pull"
}


/*
* NOTE: DO NOT GENERATE ID HERE, OTHERWISE IT WILL ONLY BE GENERATED ONCE ON LOAD AND NEW TASKS WILL ALL HAVE THE SAME ID
* */
// export const defaultTask = {
//     name: '',
//     obj: null,
//     type: ROUTE_TYPES.PUSH,
//     quantity: 1,
//     device_types: [],
//     handoff: true,
//     track_quantity: true,
//     map_id: null,
//     new: true,
//     processes: [],
// }

export const defaultTask = {
    processId: null,
    name: '',
    handoff: true,
    type: ROUTE_TYPES.PUSH,

    part: null,
    inOutRatio: 1,
    
    load: null,
    unload: null,
    timeout: '09:00',

    isNew: true
}