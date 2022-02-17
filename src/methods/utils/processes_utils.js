import { deepCopy } from "./utils";
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
            const currentRoute = routes[i];
            const nextRoute = routes[i + 1];

            const unloadStationId = getUnloadStationId(currentRoute);
            const loadStationId = getLoadStationId(nextRoute);

            if (unloadStationId !== loadStationId) {
                // Have to return the current route index plus 1 because if the route that is before the broken route is the first route in s process, then the index is 0, which is considered falsy
                return i + 1;
            }
        }
    }

    return 0;
};

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
    if (
        routeId !== routes[routes.length - 1]._id &&
        routeId !== routes[0]._id
    ) {
        const copyProcessRoutes = deepCopy(routes);
        const index = copyProcessRoutes.findIndex(
            (currRoute) => currRoute._id === routeId
        );
        copyProcessRoutes.splice(index, 1);

        return isBrokenProcess(copyProcessRoutes);
    } else {
        return false;
    }
};

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
    const copyRoutes = deepCopy(routes);
    const routeBeforeBreak = routes[brokenIndex - 1];
    const routeAfterBreak = routes[brokenIndex];

    if (
        getUnloadStationId(routeBeforeBreak) === getLoadStationId(route) &&
        getLoadStationId(routeAfterBreak) === getUnloadStationId(route)
    ) {
        copyRoutes.splice(brokenIndex, 0, route); // splice route into arr

        if (!!isBrokenProcess(copyRoutes)) {
            return isBrokenProcess(copyRoutes);
        } else {
            return false;
        }
    }

    copyRoutes.splice(brokenIndex, 0, route);
    if (!!isBrokenProcess(copyRoutes)) {
        return isBrokenProcess(copyRoutes);
    } else {
        return false;
    }
};

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
    const { routes: routeIds = [] } = process || {};

    // object that will contain {stationId: true} for each station in the process
    // an object is used instead of an array because an object can only contain a key once
    // if an array was used, the array would have to be checked each time a station is added to ensure duplicates aren't added
    var stationIds = {};

    // loop through each routeId, get the load / unload station of the route and add it to the stationIds obj
    routeIds.forEach((currRouteId) => {
        // get route from id
        const currRoute = routes[currRouteId] || {}; // default to empty obj

        // get unload and load objects
        const { unload = {}, load = {} } = currRoute;

        // get unload station id
        const { station: unloadStationId } = unload;

        // get load station id
        const { station: loadStationId } = load;

        // if unloadStationId and loadStationId exist, add to stationIds obj
        if (loadStationId) stationIds[loadStationId] = true;
        if (unloadStationId) stationIds[unloadStationId] = true;
    });

    // return stationIds obj
    return stationIds;
};

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
    const { routes: routeIds = [] } = process || {};

    // object that will contain {stationId: true} for each station in the process
    // an object is used instead of an array because an object can only contain a key once
    // if an array was used, the array would have to be checked each time a station is added to ensure duplicates aren't added
    var stationIds = [];

    // loop through each routeId, get the load / unload station of the route and add it to the stationIds obj
    routeIds.forEach((currRouteId, index) => {
        // get route from id
        const currRoute = routes[currRouteId] || {}; // default to empty obj

        // get unload and load objects
        const { unload = {}, load = {} } = currRoute;

        if (!stationIds.includes(currRoute.load)) {
            stationIds.push(currRoute.load);
        }
        if (!stationIds.includes(currRoute.unload)) {
            stationIds.push(currRoute.unload);
        }
    });

    // return stationIds obj
    return stationIds;
};

/**
 * Gets all stations that belong to a process when editing that process
 * Editing a process has the actual object vs the id of the route inside it's routes array
 * @param {*} process
 * @returns
 */
export const getProcessStationsWhileEditing = (process) => {
    let stationIds = [];
    const { routes } = process || [];
    routes.forEach((route) => {
        const loadStation = route.load.station;
        const unloadStation = route.unload.station;
        if (!stationIds.includes(loadStation)) {
            stationIds.push(loadStation);
        }

        if (!stationIds.includes(unloadStation)) {
            stationIds.push(unloadStation);
        }
    });

    return stationIds;
};

export const getProcessName = (processId) => {
    const processes = store.getState().processesReducer.processes || {};
    const process = processes[processId] || {};
    const { name = "" } = process;

    return name;
};

export const getNextStationInProcess = (process, currentStationId) => {
    const routes = store.getState().tasksReducer.tasks || {};
    const stations = store.getState().stationsReducer.stations || {};
    let nextStation;
    const processStations = getProcessStationsSorted(process, routes);
    const currentStationIndex = processStations.findIndex((currItem) => {
        if (isObject(currItem)) {
            return currItem._id === currentStationId;
        } else {
            return currItem === currentStationId;
        }
    });

    // If the current index is the same as the length, then its the last station in the process, so take the first station
    if (currentStationIndex === processStations.length - 1) {
        nextStation = processStations[0];
    }
    // Else take the next station in the array
    else {
        nextStation = processStations[currentStationIndex + 1];
    }

    if (!isObject(nextStation)) {
        return stations[nextStation];
    } else {
        return nextStation;
    }
};

export const getPreviousRoute = (processRoutes, currentRouteId) => {
    const storeState = store.getState();
    const routes = storeState.tasksReducer.tasks;
    var previousRoute;

    const currentRouteindex = processRoutes.findIndex((currItem) => {
        if (isObject(currItem)) {
            return currItem._id === currentRouteId;
        } else {
            return currItem === currentRouteId;
        }
    });
    // If the current route index is above 0 then find the route before
    if (currentRouteindex > 0) {
        previousRoute = processRoutes[currentRouteindex - 1];
    }
    // Else its the the first route so ge the last route of the process,
    else {
        previousRoute = processRoutes[processRoutes.length - 1];
    }

    if (!isObject(previousRoute)) {
        return routes[previousRoute];
    } else {
        return previousRoute;
    }
};

export const getNextRoute = (processRoutes, currentRouteId) => {
    const storeState = store.getState();
    const routes = storeState.tasksReducer.tasks;
    let nextRoute;

    const currentRouteindex = processRoutes.findIndex((currItem) => {
        if (isObject(currItem)) {
            return currItem._id === currentRouteId;
        } else {
            return currItem === currentRouteId;
        }
    });

    // If the current index is the same as the length, then its the last roue in the process, so take the first route
    if (currentRouteindex === processRoutes.length - 1) {
        nextRoute = processRoutes[0];
    }
    // Else take the next route in the array
    else {
        nextRoute = processRoutes[currentRouteindex + 1];
    }

    if (!isObject(nextRoute)) {
        return routes[nextRoute];
    } else {
        return nextRoute;
    }
};

export const callOnStations = (processId, callback) => {
    const storeState = store.getState();
    const routes = storeState.tasksReducer.tasks || {};
    const process = storeState.processesReducer.processes[processId] || {};

    let prevLoadStationId; // tracks previous load station id when looping through routes
    let prevUnloadStationId; // tracks previous unload station id when looping through routes
    let stationIds = [];

    // loop through routes, get load / unload station id and create entry in tempCardsSorted for each station
    process.routes &&
        process.routes.forEach((currRouteId, index) => {
            // get current route and load / unload station ids
            const currRoute = routes[currRouteId];
            const loadStationId = getLoadStationId(currRoute);
            const unloadStationId = getUnloadStationId(currRoute);

            // only add loadStation entry if the previous unload wasn't identical (in order to avoid duplicates)
            if (prevUnloadStationId !== loadStationId) {
                callback(loadStationId);
            }

            // add entry in tempCardsSorted
            callback(unloadStationId);

            // update prevLoadStationId and prevUnloadStationId
            prevLoadStationId = loadStationId;
            prevUnloadStationId = unloadStationId;
        });
};

export const getStationIds = (processId) => {
    let stationIds = [];

    const callback = (stationId) => {
        stationIds.push(stationId);
    };

    callOnStations(processId, callback);

    return stationIds;
};

export const getStationAttributes = (processId, attributes) => {
    const storeState = store.getState();
    const stations = storeState.stationsReducer.stations || {};

    let stationAttributes = [];

    const isAttributesNotEmpty = isNonEmptyArray(attributes);

    const callback = (stationId) => {
        const station = stations[stationId];

        let currentStationAttributes;

        if (isAttributesNotEmpty) {
            currentStationAttributes = {};
            attributes.forEach((currAttribute) => {
                currentStationAttributes[currAttribute] =
                    station[currAttribute];
            });
        } else {
            currentStationAttributes = { ...station };
        }

        stationAttributes.push(currentStationAttributes);
    };

    callOnStations(processId, callback);

    return stationAttributes;
};

// Gets the previous station that is a warehouse
// If it is a warehouse, it returns that station,
// If not, it returns false
export const getPreviousWarehouseStation = (processID, stationID) => {
    const storeState = store.getState();
    const routes = storeState.tasksReducer.tasks || {};
    const process = storeState.processesReducer.processes[processID] || {};
    const stations = storeState.stationsReducer.stations || {};

    let warehouse = null;
    for (const ind in process.routes) {
        let loadStation = stations[routes[process.routes[ind]].load];
        let unloadStation = stations[routes[process.routes[ind]].unload];

        if (
            unloadStation._id === stationID &&
            loadStation.type === "warehouse"
        ) {
            warehouse = loadStation;
        }
    }

    if (!!warehouse) return warehouse;
    else return false;
};

/***
 * All processes must end in single stations. This function returns binary whether or not that is true for
 * a given set of routes
 */
export const doRoutesConverge = (routes) => {
    let loadStations = routes.map((route) => route.load);
    let unloadStations = routes.map((route) => route.unload);

    let numTerminalStations = 0;
    for (var unloadStation of unloadStations) {
        if (
            loadStations.find(
                (loadStation) => loadStation === unloadStation
            ) === undefined
        ) {
            numTerminalStations += 1;
        }
    }

    return numTerminalStations === 1;
};

/**
 * Find the IDs of the start stations of a process. If stations is provided, it will not include start nodes
 * that are warehouses. (Note this needs to be recursive in the case that )
 *
 * @param {Array} processRoutes
 * @param {Array} stations
 * @returns
 */
export const findProcessStartNodes = (processRoutes, stations) => {
    if (processRoutes.length === 0) return [];
    let loadStations = processRoutes.map((route) =>
        !!route ? route.load : {}
    );
    let unloadStations = processRoutes.map((route) =>
        !!route ? route.unload : {}
    );

    let startNodes = [];
    for (var loadStation of loadStations) {
        if (
            unloadStations.find(
                (unloadStation) => unloadStation === loadStation
            ) === undefined &&
            !startNodes.includes(loadStation)
        ) {
            startNodes.push(loadStation);
        }
    }

    if (startNodes.length === 0) return []

    if (
        stations !== undefined &&
        startNodes.every((nodeId) => stations[nodeId]?.type === "warehouse")
    ) {
        const newRoutes = deepCopy(processRoutes).filter(
            (route) => !startNodes.includes(route.load)
        );
        return findProcessStartNodes(newRoutes, stations);
    } else if (stations !== undefined) {
        return startNodes.filter(
            (node) => stations[node]?.type !== "warehouse"
        );
    }

    return startNodes;
};

export const findProcessEndNodes = (routes) => {
    let loadStations = routes.map((route) => (!!route ? route.load : {}));
    let unloadStations = routes.map((route) => (!!route ? route.unload : {}));

    let endNodes = []
    for (var unloadStation of unloadStations) {
        if (
            loadStations.find(
                (loadStation) => loadStation === unloadStation
            ) === undefined
        ) {
            endNodes.push(unloadStation);
        }
    }
    return endNodes;
};

/**
 * Looks through the incoming routes and determines if all incoming parts are satisfied.
 * If the parts are satisfied, then the worker can move the lot along, otherwise they
 * need to wait until all parts come in. This gets complicated because you have to
 * backpropogate through the graph to determine if a part was diverged as a split or
 * a choice.
 *
 * Basic Algorithm:
 * Starting at the start nodes, recurse through the graph. When you reach a diverging
 * node, the returned value becomes an array where the first value is 'AND' or 'OR'
 * depending on whether it is a split or choice node. As you continue to traverse,
 * if you come to a converging node, those two paths will reach the same station
 * (ex: ['AND', 'Station3', 'Station3']) which can be collapsed simply into 'Station3'.
 * once you reach the desired station, stop traversing.
 *
 * @param {array} routes
 * @param {ID} stationId
 */
export const handleMergeExpression = (stationId, process, routes, stations, clean=true) => {
    if (!process) return []

    const processRoutes = process.routes.map((routeId) => routes[routeId]);

    const recursivePrint = (exp) => {
        if (!Array.isArray(exp)) return routes[exp]?.name || exp
        else if (exp.length === 1) return exp
        exp = deepCopy(exp)
      for (var i=1; i<exp.length; i++) {
        if (Array.isArray(exp[i])) {
            exp[i] = recursivePrint(exp[i])
        } else {
            exp[i] = routes[exp[i]]?.name || exp[i]
        }
      }
      return exp
    }

    /***
     * Cleans up an expression.
     */
    const cleanExpression = (expression) => {
        if (!Array.isArray(expression)) {
            return expression
        } else if (expression[0] === null) {
            // If the first element is null, there is no AND or OR. Its just the child ('through' node)
            return expression[1];
        } else {
            // Remove all nulls from the expression. Nulls are set when the recursion hits the end
            // of the process but didnt come across the desired stationId
            let nonNullExpression = expression.filter((el) => !!el);

            // If len < 2, this isnt even an expression (reached process end without hitting stationId)
            if (nonNullExpression.length < 2) {
                return null;
            } else if (
                // If all pieces are the same, theres no need for an AND or OR
                nonNullExpression.every(
                    (element, idx) =>
                        idx === 0 ||
                        JSON.stringify(element) ===
                            JSON.stringify(nonNullExpression[1])
                )
            ) {
                return nonNullExpression[1];
            } else {
                // Otherwise, just return the expression
                return nonNullExpression;
            }
        }
    }

    let node, outgoingRoutes, nextRoutes, routeId;
    const recursiveExpand = (sExpression, traversed) => {
        let sExpressionCopy = deepCopy(sExpression);
        for (var entryIdx = 1; entryIdx < sExpression.length; entryIdx++) {
            routeId = sExpression[entryIdx];

            if (traversed.includes(routeId)) {
                sExpressionCopy[entryIdx] = null;
                continue
            }
            traversed.push(routeId)

            node = routes[routeId].unload;
            outgoingRoutes = getNodeOutgoing(node, processRoutes);
            if (node === stationId) { // We've found our station
                /**
                 * OKAY, this is where cycles get tricky. When you find your station, THIS MAY NOT BE THE ONLY SOLUTION.
                 * So instead, this is an OR with all possible solutions. I.E. save this solution, but keep recursing in case a
                 * route later down the graph has a solution as well.
                 */

                if (outgoingRoutes.length === 0) {
                    sExpressionCopy[entryIdx] = routeId
                } else if (outgoingRoutes.length === 1) {
                    sExpressionCopy[entryIdx] = ['OR', routeId, recursiveExpand([null, outgoingRoutes[0]._id], deepCopy(traversed))]
                } else {
                    nextRoutes = outgoingRoutes.map((route) => route._id);
                    if (
                        outgoingRoutes.some(
                            (route) => route.divergeType === "split"
                        )
                    ) {
                        sExpressionCopy[entryIdx] = ['OR', routeId, recursiveExpand([
                            "AND",
                            ...nextRoutes,
                        ], deepCopy(traversed))]
                    } else {
                        sExpressionCopy[entryIdx] = ['OR', routeId, recursiveExpand([
                            "OR",
                            ...nextRoutes,
                        ], deepCopy(traversed))]
                    }
                }


                sExpressionCopy[entryIdx] = cleanExpression(sExpressionCopy[entryIdx]);
                
                
            } else if (outgoingRoutes.length === 0) {
                if (clean) {
                    sExpressionCopy[entryIdx] = null
                }
            } else if (outgoingRoutes.length === 1) {// Not a diverging node
                // NOTE, the recursive function only accepts an array, so we have to populate the first value with null.
                // This null is removed before the expression is returned \/
                sExpressionCopy[entryIdx] = recursiveExpand([
                    null,
                    outgoingRoutes[0]._id,
                ], deepCopy(traversed));
            } else { // Diverging node, new sub expression and expand
                nextRoutes = outgoingRoutes.map((route) => route._id);
                if (
                    outgoingRoutes.some(
                        (route) => route.divergeType === "split"
                    )
                ) {
                    sExpressionCopy[entryIdx] = recursiveExpand([
                        "AND",
                        ...nextRoutes,
                    ], deepCopy(traversed));
                } else {
                    sExpressionCopy[entryIdx] = recursiveExpand([
                        "OR",
                        ...nextRoutes,
                    ], deepCopy(traversed));
                }
            }
        }

        return cleanExpression(sExpressionCopy)
    };

    const startNodes = findProcessStartNodes(processRoutes, stations); // Dont consider warehouses start nodes
    let startRouteExpression =
        process.startDivergeType === "split" ? ["AND"] : ["OR"];
    for (var startNode of startNodes) {
        outgoingRoutes = getNodeOutgoing(startNode, processRoutes);
        if (outgoingRoutes.length === 1) {
            // NOTE, the recursive function only accepts an array, so we have to populate the first value with null.
            // This null is removed before the expression is returned \/
            startRouteExpression.push(
                recursiveExpand([null, outgoingRoutes[0]._id], [])
            );
        } else {
            nextRoutes = outgoingRoutes.map((route) => route._id);
            if (outgoingRoutes.some((route) => route.divergeType === "split")) {
                startRouteExpression.push(
                    recursiveExpand(["AND", ...nextRoutes], [])
                );
            } else {
                startRouteExpression.push(
                    recursiveExpand(["OR", ...nextRoutes], [])
                );
            }
        }
    }

    const cleanedExpression = cleanExpression(startRouteExpression)

    
    //console.log(!!stations && stations[stationId]?.name || stationId, recursivePrint(cleanedExpression))
    
    return cleanedExpression;
};

export const getNodeIncoming = (node, processRoutes, filterLoopRoutes=false) => {
    return processRoutes.filter((route) => {
        return route.unload === node && (!filterLoopRoutes || !isLoopingRoute(route._id, processRoutes))
    });
};

export const getNodeOutgoing = (node, processRoutes) => {
    return processRoutes.filter((route) => route.load === node);
};

export const isNodeStartWarehouse = (node, processRoutes, stations) => {
    return (
        stations[node]?.type === "warehouse" &&
        getNodeIncoming(node, processRoutes).length === 0
    );
};

export const flattenProcessStations = (processRoutes, stations) => {

    let flattenedStations = [];
    let traveresedRoutes = {};
    processRoutes.forEach(route => traveresedRoutes[route._id] = false)

    const DFS = (node, routes, depth) => {

        const incomingRoutes = getNodeIncoming(node, routes, true);
        const nonTraversedIncomingRoutes = incomingRoutes.filter(route => traveresedRoutes[route._id] === false)

        if (nonTraversedIncomingRoutes.length === 0) { // youve traversed all incoming routes, now add this station
            if (incomingRoutes.length > 1) { // This station was a merge node, that means move up one in depth
                depth--;
            }
            if (flattenedStations.find(({stationID}) => stationID === node) === undefined) {
                flattenedStations.push({
                    depth,
                    stationID: node
                })
            }
            
        } else if (incomingRoutes.filter(inRoute => !isLoopingRoute(inRoute._id, processRoutes)).length > 1) { // This is a merge node but we havent traversed all incoming routes, keep going until we have
            return
        }

        const outgoingRoutes = getNodeOutgoing(node, routes).filter(outgoingRoute => !traveresedRoutes[outgoingRoute._id]);
        if (outgoingRoutes.length > 1) { // This is a diverging node, move down in depth
            depth++;
        }

        for (var nextRoute of outgoingRoutes) {
            traveresedRoutes[nextRoute._id] = true;
            DFS(nextRoute.unload, routes, depth);
        }

    }

    const processRoutesWithoutWarehouseStartNodes =
        processRoutes.filter((route) => {
            if (stations[route.load]?.type === "warehouse") {
                const warehouseIncomingRoutes = getNodeIncoming(
                    route.load,
                    processRoutes
                );
                if (warehouseIncomingRoutes.length === 0) {
                    return false;
                }
            }
            return true;
        });

    let startNodes = findProcessStartNodes(processRoutesWithoutWarehouseStartNodes, stations);
    for (var startNode of startNodes) {
        DFS(startNode, processRoutesWithoutWarehouseStartNodes, (startNodes.length > 1 ? 1 : 0));
    }

    return flattenedStations;


}

const DFSFindCycleRoute = (routeId, routes, stack) => {

    let node = stack[stack.length-1];
    let outgoingRoutes = getNodeOutgoing(node, routes);

    for (var outgoingRoute of outgoingRoutes) {
        let nextNode = outgoingRoute.unload;
        if (stack.includes(nextNode)) {
            if (outgoingRoute._id === routeId) {
                return true;
            } else {
                continue
            }
        }
        let nextStack = deepCopy(stack);
        nextStack.push(nextNode);
        if (DFSFindCycleRoute(routeId, routes, nextStack)) return true
    }

    return false

}

export const isLoopingRoute = (routeId, processRoutes) => {

    const startNodes = findProcessStartNodes(processRoutes);

    for (var startNode of startNodes) {
        let stack = [startNode];
        if (DFSFindCycleRoute(routeId, processRoutes, stack)) return true
        
    }
    return false

}
