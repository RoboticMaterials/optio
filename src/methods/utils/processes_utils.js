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
        const nextRoute = routes[process.routes[i+1]]
        if(currentRoute.unload.station !== nextRoute.load.station){
            console.log('QQQQ Process is broken')
            return true
        }
    }
}

/**
 * This function returns true if the route you are deleting will break the Process
 * 
 * Currently the way it tells if it will break the process is to tell if its not the first or last route in a process\
 * If it is the first or last route, then the process does not break
 * 
 * 
 * @param {object} process Selected Process
 * @param {objecet} route Selected Route
 * @param {object} routes All the routes
 */
export const willRouteDeleteBreakProcess = (process, route, routes) => {

    if(route._id !== process.routes[process.routes.length -1] && route._id !== process.routes[0]){
        return true
    }
}