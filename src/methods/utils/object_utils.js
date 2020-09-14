/**
 *  Goes through all the tasks and finds any tasks that belong to that location.
 *  It then sees if that task belongs to that location either as load or unload task.
 *  Then adds the key: taskID and value: object ID to be used for the object builder
 * */ 
export const handleParseTaskBasedOnLoadUnload = (tasks, location) => {

    let parsedTasks = { load: {}, unload: {} }
    Object.values(tasks).forEach(task => {

        // If location is load
        if (task.load.location == location._id) {
            parsedTasks.load = {
                ...parsedTasks.load,
                [task._id.$oid]: task.obj
            }

            // If location is unload
        } else if (task.unload.location == location._id) {
            parsedTasks.unload = {
                ...parsedTasks.unload,
                [task._id.$oid]: task.obj
            }
        }
    })
    return parsedTasks
}