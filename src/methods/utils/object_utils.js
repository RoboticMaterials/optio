/**
 *  Goes through all the tasks and finds any tasks that belong to that location.
 *  It then sees if that task belongs to that location either as load or unload task.
 *  Then adds the key: taskID and value: object ID to be used for the object builder
 * */ 
export const handleParseTaskBasedOnLoadUnload = (tasks, stationID) => {

    let parsedTasks = { load: {}, unload: {} }

    Object.values(tasks).forEach(task => {

        // If station is load
        if (task.load.station == stationID) {
            parsedTasks.load = {
                ...parsedTasks.load,
                [task._id]: task.obj
            }

            // If station is unload
        } else if (task.unload.station == stationID) {
            parsedTasks.unload = {
                ...parsedTasks.unload,
                [task._id]: task.obj
            }
        }
    })
    return parsedTasks
}

export const isEmpty = (obj) => {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}