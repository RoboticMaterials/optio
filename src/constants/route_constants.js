import {DEVICE_CONSTANTS} from "./device_constants";
import uuid from 'uuid'

export const ROUTE_TYPES = {
    PUSH: "push",
    PULL: "pull"
}

export const defaultTask = {
    name: '',
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
        instructions: 'Load',
        timeout: '01:00'
    },
    unload: {
        position: null,
        station: null,
        sound: null,
        instructions: 'Unload'
    },
    _id: uuid.v4(),
}