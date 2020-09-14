export const postToDashboards = (dashboardName) => {
    // Requires: buttonID, param, type, buttonName, dashboardName
    const newDashboard = {
        "buttons": [
        ],
        "name": dashboardName,
        "saved": false,
    }
    return newDashboard     
}

export const findDashboardByID = (availableDashboards, ID) => {
    const dashboardNameIndex = Object.values(availableDashboards).findIndex(d => {
        return d._id.$oid === ID;
    })
    return dashboardNameIndex
}

export const handleAvailableTasks = (tasks, station) => {
    let availableTasks = []
    Object.values(tasks).forEach(task => {
        if ((task.type == 'push' || task.type == 'both') && task.load.station == station._id) {
            availableTasks.push(task)
        } else if ((task.type == 'pull' || task.type == 'both') && task.unload.station == station._id) {
            availableTasks.push(task)
        }
    })
    return availableTasks
}

export const handleCurrentDashboard = (dashboards, dashboardID) => {
    let availableDash = []
    Object.assign(availableDash, dashboards)

    availableDash = Object.values(availableDash)

    const dashboardNameIndex = Object.values(availableDash).findIndex(d => {
        return d._id.$oid === dashboardID;
    })

    return availableDash[dashboardNameIndex]
}