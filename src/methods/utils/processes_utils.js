import { deepCopy } from './utils'

/**
 * This function checks to see if a process is broken. 
 * A process is broken because it has dissjointed routes, theres a gap between an unload station and a load station between 2 consecutive routes
 * 
 * 
 * @param {object} process Process to check and see if it is broken
 * @param {object} routes All routes
 */
export const isBrokenProcess = (process, routes) => {

    // Loops through and 
    for (let i = 0; i < process.routes.length - 1; i++) {
        const currentRoute = routes[process.routes[i]]
        const nextRoute = routes[process.routes[i + 1]]
        if (currentRoute.unload.station !== nextRoute.load.station) {
            // Have to return the current route index plus 1 because if the route that is before the broken route is the first route in s process, then the index is 0, which is considered falsy
            return i + 1
        }
    }
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
 * @param {object} process Selected Process
 * @param {objecet} route Selected Route
 * @param {object} routes All the routes
 */
export const willRouteDeleteBreakProcess = (process, route, routes) => {

    if (route._id !== process.routes[process.routes.length - 1] && route._id !== process.routes[0]) {

        const copyProcess = deepCopy(process)
        const index = copyProcess.routes.indexOf(route._id)
        copyProcess.routes.splice(index, 1)

        return isBrokenProcess(copyProcess, routes)
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
 * @param {object} process Selected Process
 * @param {object} route New Route
 */
export const willRouteAdditionFixProcess = (process, route, routes) => {
    const copyProcess = deepCopy(process)
    const routeBeforeBreak = routes[process.routes[process.broken - 1]]
    const routeAfterBreak = routes[process.routes[process.broken]]

    if (routeBeforeBreak.unload.station === route.load.station && routeAfterBreak.load.station === route.unload.station) {
        copyProcess.routes.splice(process.broken, 0, route._id)
        if (!!isBrokenProcess(copyProcess, routes)) {
            return isBrokenProcess(copyProcess, routes)
        }
        else {
            return false
        }
    }
}