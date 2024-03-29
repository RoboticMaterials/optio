import {v4 as uuid} from "uuid"
import {DEVICE_CONSTANTS} from "../../constants/device_constants";
import  store  from "../../redux/store/index";
import {defaultTask} from "../../constants/route_constants";
import {isArray} from "./array_utils";
import {useSelector} from "react-redux";

/**
 * Creates a default route based on store state
 */
export const generateDefaultRoute = (processId) => {
    return {
        ...defaultTask,
        processId,
        _id: uuid(), // NOTE - ID IS GENERATED HERE INSTEAD OF IN defaultTask SO THE ID IS GENERATED EACH TIME THE FUNCTION IS CALLED
    }
}

export const autoGenerateRoute = (obj) => {
    const storeState = store.getState()
    const MiRMapEnabled = storeState.localReducer.localSettings.MiRMapEnabled
    const currentMapId = storeState.localReducer.localSettings.currentMapId
    const routeConfirmationLocation = storeState.tasksReducer.routeConfirmationLocation

    const positions = storeState.positionsReducer.positions

    return {
        ...defaultTask,
        device_types: !!MiRMapEnabled ? [DEVICE_CONSTANTS.MIR_100, DEVICE_CONSTANTS.HUMAN] : [DEVICE_CONSTANTS.HUMAN],
        handoff: true,
        map_id: currentMapId,
        load: {...defaultTask.load,
               station: !!positions[routeConfirmationLocation] ? positions[routeConfirmationLocation].parent : routeConfirmationLocation,
               position: routeConfirmationLocation,
              },
        unload: {...defaultTask.unload},
        obj: obj ? obj : null,
        _id: uuid(), // NOTE - ID IS GENERATED HERE INSTEAD OF IN defaultTask SO THE ID IS GENERATED EACH TIME THE FUNCTION IS CALLED
    }
}

export const isHumanTask = (task) => {
    return task && isArray(task.device_types) && task.device_types.includes(DEVICE_CONSTANTS.HUMAN)
}

export const buildDefaultRouteName = (nameA, nameB) => {
    if(!nameA) return ""
    return nameA + " => " + nameB
}

/*
* Returns true if task ONLY supports human device (and no other types), and false otherwise
* */
export const isOnlyHumanTask = (task) => {
    var containsHuman = false
    var containsNonHuman = false
    if(task && isArray(task.device_types)) {
        task.device_types.forEach((currType) => {
            if( currType === DEVICE_CONSTANTS.HUMAN ) containsHuman = true
            if( currType !== DEVICE_CONSTANTS.HUMAN )  containsNonHuman = true
        })
    }


    return !containsNonHuman && containsHuman
}

export const isMiRandHumanTask = (task) => {
    return task && isArray(task.device_types) && task.device_types.includes(DEVICE_CONSTANTS.MIR_100) && task.device_types.includes(DEVICE_CONSTANTS.HUMAN)
}


export const isMiRTask = (task) => {
    return task && isArray(task.device_types) && task.device_types.includes(DEVICE_CONSTANTS.MIR_100)
}

export const getRouteProcesses = (routeId) => {
    const storeState = store.getState()
    const processes = storeState.processesReducer.processes

    return Object.values(processes).filter((currProcess, currIndex) => {
        if(currProcess.routes.includes(routeId)) return true
    })
}

export const isNextRouteViable = (currentRoute, nextRoute) => {
    const currentUnloadStationId = getUnloadStationId(currentRoute)
    const nextLoadStationId = getLoadStationId(nextRoute)

    if (currentUnloadStationId === nextLoadStationId) {
        return true
    }
}

export const getUnloadStationId = (route) => {
    return route?.unload
}

export const getUnloadPositionId = (route) => {
    return route?.unload
}

export const getLoadStationId = (route) => {
    return route?.load
}

export const getLoadPositionId = (route) => {
    return route?.load
}

export const getRouteStart = (route) => {
    let hasStart = getLoadStationId(route)
    if(!hasStart) hasStart = getLoadPositionId(route)

    return hasStart
}

export const getRouteEnd = (route) => {
    let hasEnd = getUnloadStationId(route)
    if(!hasEnd) hasEnd = getUnloadPositionId(route)

    return hasEnd
}

export const getHasStartAndEnd = (route) => {
    return getRouteEnd(route) && getRouteStart(route)
}

export const isStationLoadStation = (route, stationId) => {
    return stationId === getLoadStationId(route)
}



export const isStationUnloadStation = (route, stationId) => {
    return stationId === getUnloadStationId(route)
}

export const isPositionAtLoadStation = (route, positionId) => {
    const storeState = store.getState()
    const stations = storeState.stationsReducer.stations || {}

    // get load station
    const loadStationId = getLoadStationId(route)
    const loadStation = stations[loadStationId] || { children: [] }


    // if loadStation's children includes positionId, return true
    if (loadStation.children.includes(positionId)) return true

    // otherwise return false
    return false
}

export const isPositionAtUnloadStation = (route, positionId) => {
    const storeState = store.getState()
    const stations = storeState.stationsReducer.stations || {}

    // get load station
    const unloadStationId = getUnloadStationId(route)
    const unloadStation = stations[unloadStationId] || { children: [] }


    // if loadStation's children includes positionId, return true
    if (unloadStation.children.includes(positionId)) return true

    // otherwise return false
    return false

}

export const isPositionInRoutes = (routes, positionId) => {
    const storeState = store.getState()
    const stations = storeState.stationsReducer.stations || {}

    for(const currRoute of routes) {

        const {
            load,
            unload
        } = currRoute || {}

        const {
            station: loadStationId
        } = load || {}
        const loadStation = stations[loadStationId] || { children: [] }
        if(loadStation.children.includes(positionId)) return true   // found station with position as child, return true

        const {
            station: unloadStationId
        } = unload || {}
        const unloadStation = stations[unloadStationId] || { children: [] }
        if(unloadStation.children.includes(positionId)) return true // found station with position as child, return true
    }

    return false // none of the station's contained the position
}

export const getLoadStationDashboard = (route) => {
    const storeState = store.getState()
    const stations = storeState.stationsReducer.stations || {}

    const loadStationId = getLoadStationId(route)

    const station = stations[loadStationId] || {}

    const dashboards = isArray(station.dashboards) ?  station.dashboards : [null]

    return dashboards[0]
}

export const getRouteIndexInRoutes = (processRouteIds, routeId) => {
    return processRouteIds.indexOf(routeId)
}

export const isStationInRoutes = (routes, stationId) => {
    let containsStation = false

    for(const currRoute of routes) {
        if(containsStation) return containsStation

            const {
                start,
                end
            } = currRoute || {}

        if((start === stationId) || (end === stationId)) {
            return true;
        }
    }

    return false;
}

export const isStationStartRoute = (routes, stationId) => {

    for (const currRoute of routes) {
        if (currRoute.end === stationId) return false;
    }
    return true;

}

export const isStationEndRoute = (routes, stationId) => {

    for (const currRoute of routes) {
        if (currRoute.start === stationId) return false;
    }
    return true;

}
