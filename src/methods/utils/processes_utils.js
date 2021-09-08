import { deepCopy } from './utils'
import { isObject } from "./object_utils";
import store from "../../redux/store";
import { getLoadStationId, getUnloadStationId } from "./route_utils";
import { useSelector } from "react-redux";
import { isArray, isNonEmptyArray } from "./array_utils";

/**
 * This function checks to see if a process is broken. 
 * A process is broken because it has dissjointed routes, theres a gap between an unload station and a load station between 2 consecutive routes
 * 
 * 
 * @param {object} processRoutes Process to check and see if it is broken
 * @param {object} routes All routes
 */
export const isBrokenProcess = (routes) => {

    return false;

    // can't be broken if there is only 1 route
    if (routes.length > 1) {
        // Loops through and
        for (let i = 0; i < routes.length - 1; i++) {
            const currentRoute = routes[i]
            const nextRoute = routes[i + 1]

            const unloadStationId = getUnloadStationId(currentRoute)
            const loadStationId = getLoadStationId(nextRoute)


            if (unloadStationId !== loadStationId) {
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

    if (getUnloadStationId(routeBeforeBreak) === getLoadStationId(route) && getLoadStationId(routeAfterBreak) === getUnloadStationId(route)) {

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
        if (loadStationId) stationIds[loadStationId] = true
        if (unloadStationId) stationIds[unloadStationId] = true
    })

    // return stationIds obj
    return stationIds
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
 export const getProcessStationsSorted = (process, routes) => {
    const { routes: routeIds = [] } = process || {}

    // object that will contain {stationId: true} for each station in the process
    // an object is used instead of an array because an object can only contain a key once
    // if an array was used, the array would have to be checked each time a station is added to ensure duplicates aren't added
    var stationIds = []

    // loop through each routeId, get the load / unload station of the route and add it to the stationIds obj
    routeIds.forEach((currRouteId, index) => {

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
        if (loadStationId && index == 0) stationIds.push(loadStationId)
        if (unloadStationId) stationIds.push(unloadStationId)
    })

    // return stationIds obj
    return stationIds
}



/**
 * Gets all stations that belong to a process when editing that process
 * Editing a process has the actual object vs the id of the route inside it's routes array
 * @param {*} process 
 * @returns 
 */
export const getProcessStationsWhileEditing = (process) => {
    let stationIds = []
    const { routes } = process || []
    routes.forEach((route) => {
        const loadStation = route.load.station
        const unloadStation = route.unload.station
        if (!stationIds.includes(loadStation)) {
            stationIds.push(loadStation)
        }

        if (!stationIds.includes(unloadStation)) {
            stationIds.push(unloadStation)
        }
    })

    return stationIds
}

export const getProcessName = (processId) => {
    const processes = store.getState().processesReducer.processes || {}
    const process = processes[processId] || {}
    const {
        name = ""
    } = process

    return name
}

export const getNextStationInProcess = (process, currentStationId) => {
    const routes = store.getState().tasksReducer.tasks || {}
    const stations = store.getState().stationsReducer.stations || {}
    let nextStation
    const processStations = getProcessStationsSorted(process, routes)
    const currentStationIndex = processStations.findIndex((currItem) => {
        if (isObject(currItem)) {
            return currItem._id === currentStationId
        }
        else {
            return currItem === currentStationId
        }

    })

    // If the current index is the same as the length, then its the last station in the process, so take the first station
    if (currentStationIndex === processStations.length - 1) {
        nextStation = processStations[0]
    }
    // Else take the next station in the array
    else {
        nextStation = processStations[currentStationIndex + 1]
    }

    if (!isObject(nextStation)) {
        return stations[nextStation]
    }
    else {
        return nextStation
    }
}

export const getPreviousRoute = (processRoutes, currentRouteId) => {
    const storeState = store.getState()
    const routes = storeState.tasksReducer.tasks
    var previousRoute

    const currentRouteindex = processRoutes.findIndex((currItem) => {
        if (isObject(currItem)) {
            return currItem._id === currentRouteId
        }
        else {
            return currItem === currentRouteId
        }

    })
    // If the current route index is above 0 then find the route before
    if (currentRouteindex > 0) {
        previousRoute = processRoutes[currentRouteindex - 1]
    }
    // Else its the the first route so ge the last route of the process,  
    else {
        previousRoute = processRoutes[processRoutes.length - 1]
    }

    if (!isObject(previousRoute)) {
        return routes[previousRoute]
    }
    else {
        return previousRoute
    }

}

export const getNextRoute = (processRoutes, currentRouteId) => {
    const storeState = store.getState()
    const routes = storeState.tasksReducer.tasks
    let nextRoute

    const currentRouteindex = processRoutes.findIndex((currItem) => {
        if (isObject(currItem)) {
            return currItem._id === currentRouteId
        }
        else {
            return currItem === currentRouteId
        }

    })

    // If the current index is the same as the length, then its the last roue in the process, so take the first route
    if (currentRouteindex === processRoutes.length - 1) {
        nextRoute = processRoutes[0]
    }
    // Else take the next route in the array
    else {
        nextRoute = processRoutes[currentRouteindex + 1]
    }

    if (!isObject(nextRoute)) {
        return routes[nextRoute]
    }
    else {
        return nextRoute
    }

}

export const callOnStations = (processId, callback) => {
    const storeState = store.getState()
    const routes = storeState.tasksReducer.tasks || {}
    const process = storeState.processesReducer.processes[processId] || {}

    let prevLoadStationId		// tracks previous load station id when looping through routes
    let prevUnloadStationId		// tracks previous unload station id when looping through routes
    let stationIds = []

    // loop through routes, get load / unload station id and create entry in tempCardsSorted for each station
    process.routes && process.routes.forEach((currRouteId, index) => {

        // get current route and load / unload station ids
        const currRoute = routes[currRouteId]
        const loadStationId = getLoadStationId(currRoute)
        const unloadStationId = getUnloadStationId(currRoute)

        // only add loadStation entry if the previous unload wasn't identical (in order to avoid duplicates)
        if (prevUnloadStationId !== loadStationId) {
            callback(loadStationId)
        }

        // add entry in tempCardsSorted
        callback(unloadStationId)

        // update prevLoadStationId and prevUnloadStationId
        prevLoadStationId = loadStationId
        prevUnloadStationId = unloadStationId
    })
}

export const getStationIds = (processId) => {
    let stationIds = []

    const callback = (stationId) => {
        stationIds.push(stationId)
    }

    callOnStations(processId, callback)

    return stationIds
}

export const getStationAttributes = (processId, attributes) => {
    const storeState = store.getState()
    const stations = storeState.stationsReducer.stations || {}

    let stationAttributes = []

    const isAttributesNotEmpty = isNonEmptyArray(attributes)

    const callback = (stationId) => {
        const station = stations[stationId]

        let currentStationAttributes

        if (isAttributesNotEmpty) {
            currentStationAttributes = {}
            attributes.forEach((currAttribute) => {
                currentStationAttributes[currAttribute] = station[currAttribute]
            })
        }
        else {
            currentStationAttributes = { ...station }
        }

        stationAttributes.push(currentStationAttributes)
    }

    callOnStations(processId, callback)

    return stationAttributes
}

// Gets the previous station that is a warehouse
// If it is a warehouse, it returns that station,
// If not, it returns false
export const getPreviousWarehouseStation = (processID, stationID) => {
    const storeState = store.getState()
    const routes = storeState.tasksReducer.tasks || {}
    const process = storeState.processesReducer.processes[processID] || {}
    const stations = storeState.stationsReducer.stations || {}


    const processStations = Object.keys(getProcessStations(process, routes))
    const currStationIndex = processStations.findIndex(el => el === stationID)
    const warehouseID = processStations[currStationIndex - 1]
    const warehouse = stations[warehouseID]

    if (!!warehouse && warehouse?.type === 'warehouse') {
        return warehouse
    }
    else {
        return false
    }
}

/***
 * All processes must end in single stations. This function returns binary whether or not that is true for 
 * a given set of routes
 */
export const doRoutesConverge = (routes) => {
    let loadStations = routes.map(route => route.load);
    let unloadStations = routes.map(route => route.unload);

    let numTerminalStations = 0;
    for (var unloadStation of unloadStations) {
        if (loadStations.find(loadStation => loadStation === unloadStation) === undefined) {
            numTerminalStations += 1;
        }
    }

    return numTerminalStations === 1;
}

const findProcessStartNodes = (routes) => {
    let loadStations = routes.map(route => route.load);
    let unloadStations = routes.map(route => route.unload);

    let startNodes = [];
    for (var loadStation of loadStations) {
        if (unloadStations.find(unloadStation => unloadStation === loadStation) === undefined) {
            startNodes.push(loadStation)
        }
    }

    return startNodes;
}

const getNodeIncoming = (node, routes) => {
    return routes.filter(route => route.unload === node)
}

const getNodeOutgoing = (node, routes) => {
    return routes.filter(route => route.load === node)
}

const removeRoute = (id, routes) => {
    let removeIdx = routes.findIndex(route => route._id === id);
    routes.splice(removeIdx, 1);
    return routes;
}


// [[[A B] [C]] D [[E [F] [G] H] [I] J]

// out = [
//     {
//         collapsed: false,
//         children: [
//             {
//                 collapsed: false,
//                 children: ['A', 'B']
//             },
//             ['C'],
//         ],
//     },
//     'D',
//     {
//         collapsed: false,
//         children: [
//             {
//                 collapsed: false,
//                 children: [
//                     'E',
//                     ['F'],
//                     ['G'],
//                     'H'
//                 ]   
//             },
//             'I'
//         ]
//     },
//     'J'
// ]

// out = [
//     {
//         collapsed: false,
//         children: [{
//             collapsed: false,
//             children: ['A', 'B']
//         },
//         {
//             collapsed: false,
//             children: ['C']
//         }]
//     },
//     'D',
//     {
//         collapsed: false,
//         children: [
//             {
//                 collapsed: false,
//                 children: [
//                     'E',
//                     {
//                         collapsed: false,
//                         children: ['F']
//                     },
//                     {
//                         collapsed: false,
//                         children: ['G']
//                     },
//                     'H'
//                 ]
//             },
//             'I'
//         ]
//     },
//     'J'
// ]

const newNode = () => {
    return {
        collapsed: false,
        children: []
    }   
}

export const flattenProcessStations = (routes, stations) => {

    let mergeNode = null;

    const traverseProcessGraph = (node, routes, flattenedStations, stations) => {
    
        if (node === null) {
            // There are not any nodes currently in the flattened graph. Start by recursivly
            // looping through and flattening from the start nodes (this is depth 0)
            
            let startNodes = findProcessStartNodes(routes);
            if (startNodes.length === 1) {
                flattenedStations = traverseProcessGraph(startNode, routes, deepCopy(flattenedStations), stations)
            } else {
                let newSubgraph = newNode();
                for (var startNode of startNodes) {
                    newSubgraph.children.push(traverseProcessGraph(startNode, routes, newNode(), stations))
                }
                if (newSubgraph.children.length) {
                    flattenedStations.children.push(newSubgraph);
                }
                if (!!mergeNode) {
                    const mergeNodeCopy = mergeNode;
                    mergeNode = null;
                    for (var route of getNodeIncoming(mergeNodeCopy, routes)) {
                        routes = removeRoute(route._id, routes)
                    }
                    flattenedStations = traverseProcessGraph(mergeNodeCopy, routes, deepCopy(flattenedStations), stations)
                }
            }
    
        } else {
            // This is a depth 1+ recursive search, so we have a node to start from
    
            let incomingRoutes = getNodeIncoming(node, routes)
            let outgoingRoutes = getNodeOutgoing(node, routes)
            if (incomingRoutes.length > 1) {
                // This is a merge node, save this node, but halt recursion
                mergeNode = node
                return flattenedStations;
            } else if (outgoingRoutes.length === 1) {
                flattenedStations.children.push(node)
                // routes = removeRoute(outgoingRoutes[0]._id, routes)
                flattenedStations = traverseProcessGraph(outgoingRoutes[0].unload, routes, deepCopy(flattenedStations), stations)
            } else {
                flattenedStations.children.push(node)
                let newSubgraph = newNode();
                for (var outgoingRoute of outgoingRoutes) {
                    // routes = removeRoute(outgoingRoute._id, routes)
                    newSubgraph.children.push(traverseProcessGraph(outgoingRoute.unload, routes, newNode(), stations))
                }
                if (newSubgraph.children.length) {
                    flattenedStations.children.push(newSubgraph);
                }
                

                if (!!mergeNode) {
                    const mergeNodeCopy = mergeNode;
                    mergeNode = null;
                    for (var route of getNodeIncoming(mergeNodeCopy, routes)) {
                        routes = removeRoute(route._id, routes)
                    }
                    flattenedStations = traverseProcessGraph(mergeNodeCopy, routes, deepCopy(flattenedStations), stations)
                }
            }
        }
    
        
        
        return flattenedStations;
    }

    return traverseProcessGraph(null, routes, newNode(), stations)

}

