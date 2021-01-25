import { deepCopy } from './utils'
import {isObject} from "./object_utils";
import store from "../../redux/store";
import {getLoadStationId, getUnloadStationId} from "./route_utils";

/**
 * This function checks to see if a process is broken. 
 * A process is broken because it has dissjointed routes, theres a gap between an unload station and a load station between 2 consecutive routes
 * 
 * 
 * @param {object} processRoutes Process to check and see if it is broken
 * @param {object} routes All routes
 */
export const isBrokenProcess = (routes) => {

    // can't be broken if there is only 1 route
    if(routes.length > 1) {
        // Loops through and
        for (let i = 0; i < routes.length - 1; i++) {
            const currentRoute = routes[i]
            const nextRoute = routes[i + 1]
            if (currentRoute.unload.station !== nextRoute.load.station) {
                // Have to return the current route index plus 1 because if the route that is before the broken route is the first route in s process, then the index is 0, which is considered falsy
                return i + 1
            }
        }
    }

    return 0

}

/**
 * This function returns true if the route you are deleting will break the Process
 * 
 * Currently the way it tells if it will break the process is to tell if its not the first or last route in a process
 * If it is the first or last route, then the process does not break
 * 
 * RETURNS FALSE IF DELETE DOES NOT BREAK PROCESS
 * It returns an int of where the break will be (int's are truthy)
 * 
 * @param {array} processRoutes Selected Process
 * @param {object} routeId Selected Route
 */
export const willRouteDeleteBreakProcess = (routes, routeId) => {

    // if not first or last route
    if (routeId !== routes[routes.length - 1]._id && routeId !== routes[0]._id) {

        const copyProcessRoutes = deepCopy(routes)
        const index = copyProcessRoutes.findIndex((currRoute) => currRoute._id === routeId)
        copyProcessRoutes.splice(index, 1)

        return isBrokenProcess(copyProcessRoutes)
    }
    else {
        return false
    }
}

/**
 * This checks to see if the route being added to the process will fix the broken process
 * 
 * The way it tells is by getting the route before the break and checks to see if the new route's load location is the route before breaks unload location.
 * If thats the case than we see if the route after break's load station is the new routes unload location.
 * 
 * If the new route's load and unload location fix the missing gap then it fixes that part of the broken process
 * 
 * Perform a check to see if there's still another part of the process is broken after fix
 * If it's fix then the process is not broken anymore, if not, update the break point
 * 
 * RETURNS FALSE IF THE PROCESS IS FIXED
 * It returns an int of where the new break is if it's still broken (int's are truthy)
 * 
 * @param {object} processRoutes Selected Process
 * @param {int} brokenIndex index of broken route
 * @param {object} route New Route
 */
export const willRouteAdditionFixProcess = (routes, brokenIndex, route) => {
    const copyRoutes = deepCopy(routes)
    const routeBeforeBreak = routes[brokenIndex - 1]
    const routeAfterBreak = routes[brokenIndex]

    if (getUnloadStationId(routeBeforeBreak) === getLoadStationId(route) && getLoadStationId(routeAfterBreak) === getUnloadStationId(route) ) {

        copyRoutes.splice(brokenIndex, 0, route) // splice route into arr

        if (!!isBrokenProcess(copyRoutes)) {
            return isBrokenProcess(copyRoutes)
        }
        else {
            return false
        }
    }

    copyRoutes.splice(brokenIndex, 0, route)
    if (!!isBrokenProcess(copyRoutes)) {
        return isBrokenProcess(copyRoutes)
    }
    else {
        return false
    }
}

/**
 * This returns the list of ***UNIQUE*** station ids belonging to a process
 *
 * In order to get the list of station ids, this function first gets the list of route ids belonging to the process from the process's routes key
 *
 * For each route id, the corresponding route object is retrieved from the routes object
 *
 * From each route object, the unload and load objects are extracted
 * from the unload and load objects, the station id is extracted
 *
 * Each station id is added to an object to accumulate all stations belonging to the process
 * NOTE: an object is used for this purpose since it efficiently and automatically ensures that each entry will be unique (since object keys are unique).
 *      If an array is desired, simply call Object.keys() on the returned object where needed
 *
 * RETURNS an object containing the key of each station contained in the process with value set as true
 *
 * @param {object} process The process to get stations from
 * @param {object} routes Object containing all routes with each route's id as keys
 */
export const getProcessStations = (process, routes) => {
    const { routes: routeIds = [] } = process || {}

    // object that will contain {stationId: true} for each station in the process
    // an object is used instead of an array because an object can only contain a key once
    // if an array was used, the array would have to be checked each time a station is added to ensure duplicates aren't added
    var stationIds = {}

    // loop through each routeId, get the load / unload station of the route and add it to the stationIds obj
    routeIds.forEach((currRouteId) => {

        // get route from id
        const currRoute = routes[currRouteId] || {} // default to empty obj

        // get unload and load objects
        const {
            unload = {},
            load = {}
        } = currRoute

        // get unload station id
        const {
            station: unloadStationId
        } = unload

        // get load station id
        const {
            station: loadStationId
        } = load

        // if unloadStationId and loadStationId exist, add to stationIds obj
        if(unloadStationId) stationIds[unloadStationId] = true
        if(loadStationId) stationIds[loadStationId] = true
    })

    // return stationIds obj
    return stationIds
}

export const getPreviousRoute = (processRoutes, currentRouteId) => {
    const storeState = store.getState()
    const routes = storeState.tasksReducer.tasks
    var previousRoute

    const currentRouteindex = processRoutes.findIndex((currItem) => {
        if(isObject(currItem)) {
            return currItem._id === currentRouteId
        }
        else {
            return currItem === currentRouteId
        }

    })

    if(currentRouteindex > 0 ) {
        previousRoute = processRoutes[currentRouteindex - 1]
    }
    else {
        previousRoute = processRoutes[processRoutes.length - 1]
    }

    if(!isObject(previousRoute)) {
        return routes[previousRoute]
    }
    else {
        return previousRoute
    }

}




