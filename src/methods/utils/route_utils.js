import uuid from 'uuid'
import {DEVICE_CONSTANTS} from "../../constants/device_constants";
import  store  from "../../redux/store/index";
import {defaultTask} from "../../constants/route_constants";

/**
 * Creates a default route based on store state
 */
export const generateDefaultRoute = (task, deviceType) => {
    const storeState = store.getState()
    const MiRMapEnabled = storeState.localReducer.localSettings.MiRMapEnabled
    const currentMap = storeState.mapReducer.currentMap

    return {
        ...defaultTask,
        device_types: !!MiRMapEnabled ? [DEVICE_CONSTANTS.MIR_100, DEVICE_CONSTANTS.HUMAN] : [DEVICE_CONSTANTS.HUMAN],
        handoff: !!MiRMapEnabled ? false : true,
        map_id: currentMap._id,
        load: {...defaultTask.load},
        unload: {...defaultTask.unload},
        _id: uuid.v4(), // NOTE - ID IS GENERATED HERE INSTEAD OF IN defaultTask SO THE ID IS GENERATED EACH TIME THE FUNCTION IS CALLED
    }
}

export const isHumanTask = (task) => {
    console.log("isHumanTask task",task)
    return task.device_types.includes(DEVICE_CONSTANTS.HUMAN)
}

/*
* Returns true if task ONLY supports human device (and no other types), and false otherwise
* */
export const isOnlyHumanTask = (task) => {
    var containsHuman = false
    var containsNonHuman = false
    task.device_types.forEach((currType) => {
        if( currType === DEVICE_CONSTANTS.HUMAN ) containsHuman = true
        if( currType !== DEVICE_CONSTANTS.HUMAN )  containsNonHuman = true
    })

    return !containsNonHuman && containsHuman
}

export const isMiRandHumanTask = (task) => {
    return task.device_types.includes(DEVICE_CONSTANTS.MIR_100) && task.device_types.includes(DEVICE_CONSTANTS.HUMAN)
}


export const isMiRTask = (task) => {
    return task.device_types.includes(DEVICE_CONSTANTS.MIR_100)
}

export const getRouteProcesses = (routeId) => {
    const storeState = store.getState()
    const processes = storeState.processesReducer.processes

    return Object.values(processes).filter((currProcess, currIndex) => {
        if(currProcess.routes.includes(routeId)) return true
    })
}