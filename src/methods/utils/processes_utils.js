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

        // get unload station id
        const { station: unloadStationId } = unload;

        // get load station id
        const { station: loadStationId } = load;

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

    if (
        stations !== undefined &&
        startNodes.every((nodeId) => stations[nodeId].type === "warehouse")
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

export const findProcessEndNode = (routes) => {
    let loadStations = routes.map((route) => (!!route ? route.load : {}));
    let unloadStations = routes.map((route) => (!!route ? route.unload : {}));

    for (var unloadStation of unloadStations) {
        if (
            loadStations.find(
                (loadStation) => loadStation === unloadStation
            ) === undefined
        ) {
            return unloadStation;
        }
    }
    return null;
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
export const handleMergeExpression = (stationId, process, routes, stations) => {
    const processRoutes = process.routes.map((routeId) => routes[routeId]);

    let node, outgoingRoutes, nextRoutes, routeId;
    const recursiveExpand = (sExpression) => {
        let sExpressionCopy = deepCopy(sExpression);
        for (var entryIdx = 1; entryIdx < sExpression.length; entryIdx++) {
            routeId = sExpression[entryIdx];
            node = routes[routeId].unload;
            outgoingRoutes = getNodeOutgoing(node, processRoutes);
            if (node === stationId) {
                sExpressionCopy[entryIdx] = routeId;
            } else if (outgoingRoutes.length === 0) {
                sExpressionCopy[entryIdx] = null;
            } else if (outgoingRoutes.length === 1) {
                // NOTE, the recursive function only accepts an array, so we have to populate the first value with null.
                // This null is removed before the expression is returned \/
                sExpressionCopy[entryIdx] = recursiveExpand([
                    null,
                    outgoingRoutes[0]._id,
                ]);
            } else {
                nextRoutes = outgoingRoutes.map((route) => route._id);
                if (
                    outgoingRoutes.some(
                        (route) => route.divergeType === "split"
                    )
                ) {
                    sExpressionCopy[entryIdx] = recursiveExpand([
                        "AND",
                        ...nextRoutes,
                    ]);
                } else {
                    sExpressionCopy[entryIdx] = recursiveExpand([
                        "OR",
                        ...nextRoutes,
                    ]);
                }
            }
        }

        if (sExpressionCopy[0] === null) {
            return sExpressionCopy[1];
        } else {
            sExpressionCopy = sExpressionCopy.filter((el) => el !== null);

            if (sExpression.length < 2) {
                return null;
            } else if (
                sExpressionCopy.every(
                    (element, idx) =>
                        idx === 0 ||
                        JSON.stringify(element) ===
                            JSON.stringify(sExpressionCopy[1])
                )
            ) {
                return sExpressionCopy[1];
            } else {
                return sExpressionCopy;
            }
        }
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
                recursiveExpand([null, outgoingRoutes[0]._id])
            );
        } else {
            nextRoutes = outgoingRoutes.map((route) => route._id);
            if (outgoingRoutes.some((route) => route.divergeType === "split")) {
                startRouteExpression.push(
                    recursiveExpand(["AND", ...nextRoutes])
                );
            } else {
                startRouteExpression.push(
                    recursiveExpand(["OR", ...nextRoutes])
                );
            }
        }
    }

    startRouteExpression = startRouteExpression.filter((el) => el !== null);
    if (
        startRouteExpression.every(
            (element, idx) =>
                idx === 0 ||
                JSON.stringify(element) ===
                    JSON.stringify(startRouteExpression[1])
        )
    ) {
        // If all the elements of an AND or OR are the same, then collapse it into a single node
        return startRouteExpression[1];
    } else {
        return startRouteExpression;
    }
};

export const getNodeIncoming = (node, processRoutes) => {
    return processRoutes.filter((route) => route.unload === node);
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

const removeRoute = (id, routes) => {
    let removeIdx = routes.findIndex((route) => route._id === id);
    routes.splice(removeIdx, 1);
    return routes;
};

const newNode = () => {
    return {
        collapsed: false,
        children: [],
    };
};

export const flattenProcessStations = (originalProcessRoutes, stations) => {
    let backwardMergeNodes = [];
    let visited = [];

    const verbose = false;

    const backwardTraverse = (node, processRoutes, graph) => {
        let incomingRoutes = getNodeIncoming(node, processRoutes);
        let outgoingRoutes = getNodeOutgoing(node, processRoutes);

        if (outgoingRoutes.length > 1) {
            if (verbose) console.log(stations[node].name, "MERGE");
            // This is a merge node, save this node, but halt recursion
            if (!backwardMergeNodes.includes(node)) {
                backwardMergeNodes.push(node);
            }
            return graph;
        } else if (incomingRoutes.length === 0) {
            // THis is a start node, and there is no further recursion to do
            if (verbose) console.log(stations[node].name, "TERMINATE");
            if (!visited.includes(node)) {
                visited.push(node);
                graph.children.unshift(node);
            }
            return graph;
        } else if (incomingRoutes.length === 1) {
            // Single route intering, recurse a single route
            if (verbose) console.log(stations[node].name, "THROUGH");
            if (!visited.includes(node)) {
                visited.push(node);
                graph.children.unshift(node);
            }
            graph = backwardTraverse(
                incomingRoutes[0].load,
                processRoutes,
                deepCopy(graph)
            );
        } else {
            // Multiple incoming routes, recurse all of them and make subgraphs
            if (verbose) console.log(stations[node].name, "SPLIT");
            if (!visited.includes(node)) {
                visited.push(node);
                graph.children.unshift(node);
            }
            let newSubgraph = newNode();
            for (var incomingRoute of incomingRoutes) {
                // each incoming route will be it's own subgraph
                newSubgraph.children.unshift(
                    backwardTraverse(
                        incomingRoute.load,
                        processRoutes,
                        newNode()
                    )
                );
            }
            if (newSubgraph.children.length > 0) {
                graph.children.unshift(newSubgraph);
            }

            if (verbose) console.log(stations[node].name, "OUT");

            // All the saved up merge nodes should be added to the graph and recursed
            let backwardMergeNodesCopy = deepCopy(backwardMergeNodes);
            backwardMergeNodes = [];
            while (backwardMergeNodesCopy.length) {
                let mergeNode = backwardMergeNodesCopy.pop();
                if (verbose) console.log(stations[mergeNode].name, "MERGE ADD");

                for (var route of getNodeOutgoing(mergeNode, processRoutes)) {
                    processRoutes = removeRoute(route._id, processRoutes);
                }
                if (!visited.includes(mergeNode)) {
                    visited.push(mergeNode);
                    graph.children.unshift(mergeNode);
                }

                graph = backwardTraverse(
                    mergeNode,
                    processRoutes,
                    deepCopy(graph)
                );
            }
        }

        return graph;
    };

    const processRoutesWithoutWarehouseStartNodes =
        originalProcessRoutes.filter((route) => {
            if (stations[route.load]?.type === "warehouse") {
                const warehouseIncomingRoutes = getNodeIncoming(
                    route.load,
                    originalProcessRoutes
                );
                if (warehouseIncomingRoutes.length === 0) {
                    return false;
                }
            }
            return true;
        });

    const endNode = findProcessEndNode(processRoutesWithoutWarehouseStartNodes);
    const outGraph = backwardTraverse(
        endNode,
        processRoutesWithoutWarehouseStartNodes,
        newNode()
    );
    return outGraph;
};

export const flattenProcessStations2 = (originalRoutes, stations) => {
    let mergeNode = null;
    let visited = [];

    const traverseProcessGraph = (node, routes, graph) => {
        if (node === null) {
            // There are not any nodes currently in the flattened graph. Start by recursivly
            // looping through and flattening from the start nodes (this is depth 0)

            let startNodes = findProcessStartNodes(routes, stations);
            console.log(
                "start",
                startNodes.map((ID) => stations[ID].name)
            );
            if (startNodes.length === 1) {
                graph = traverseProcessGraph(
                    startNodes[0],
                    routes,
                    deepCopy(graph)
                );
            } else {
                let newSubgraph = newNode();
                for (var startNode of startNodes) {
                    newSubgraph.children.push(
                        traverseProcessGraph(startNode, routes, newNode())
                    );
                }
                if (newSubgraph.children.length > 0) {
                    graph.children.push(newSubgraph);
                }

                if (!!mergeNode) {
                    const mergeNodeCopy = mergeNode;
                    mergeNode = null;
                    for (var route of getNodeIncoming(mergeNodeCopy, routes)) {
                        routes = removeRoute(route._id, routes);
                    }
                    if (!visited.includes(mergeNodeCopy)) {
                        visited.push(mergeNodeCopy);
                        graph.children.push(mergeNodeCopy);
                    }
                    graph = traverseProcessGraph(
                        mergeNodeCopy,
                        routes,
                        deepCopy(graph)
                    );
                }
            }
        } else {
            // This is a depth 1+ recursive search, so we have a node to start from

            let incomingRoutes = getNodeIncoming(node, routes);
            let outgoingRoutes = getNodeOutgoing(node, routes);
            if (incomingRoutes.length > 1) {
                // This is a merge node, save this node, but halt recursion
                mergeNode = node;
                return graph;
            } else if (outgoingRoutes.length === 1) {
                if (!visited.includes(node)) {
                    visited.push(node);
                    graph.children.push(node);
                }
                graph = traverseProcessGraph(
                    outgoingRoutes[0].unload,
                    routes,
                    deepCopy(graph)
                );
            } else {
                if (!visited.includes(node)) {
                    visited.push(node);
                    graph.children.push(node);
                }
                let newSubgraph = newNode();
                for (var outgoingRoute of outgoingRoutes) {
                    newSubgraph.children.push(
                        traverseProcessGraph(
                            outgoingRoute.unload,
                            routes,
                            newNode()
                        )
                    );
                }
                if (newSubgraph.children.length > 0) {
                    graph.children.push(newSubgraph);
                }

                if (!!mergeNode) {
                    const mergeNodeCopy = mergeNode;
                    mergeNode = null;
                    for (var route of getNodeIncoming(mergeNodeCopy, routes)) {
                        routes = removeRoute(route._id, routes);
                    }
                    if (!visited.includes(mergeNodeCopy)) {
                        visited.push(mergeNodeCopy);
                        graph.children.push(mergeNodeCopy);
                    }
                    graph = traverseProcessGraph(
                        mergeNodeCopy,
                        routes,
                        deepCopy(graph)
                    );
                }
            }
        }

        return graph;
    };

    const outGraph = traverseProcessGraph(null, originalRoutes, newNode());
    console.log(outGraph);
    return outGraph;
};
