import store from '../../redux/store/index'

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
    console.log('QQQQ HURR', station)
    // If the device has an idle location, add a button for it
    // if (!!device.idle_location) {
    //     buttons = [
    //         ...buttons,
    //         {
    //             'name': 'Send to Idle Location',
    //             'color': '#FF4B4B',
    //             'task_id': 'custom_task',
    //             'custom_task': {
    //                 'type': 'position_move',
    //                 'position': device.idle_location,
    //                 'device_type': 'MiR_100',
    //             },
    //             'deviceType': 'MiR_100',
    //             'id': 'custom_task_idle'
    //         }
    //     ]
    // }

    // Map through positions and add a button if it's a charge position
    // Object.values(positions).map((position, ind) => {
    //     if (position.type === 'charger_position') {
    //         buttons = [
    //             ...buttons,
    //             {
    //                 'name': position.name,
    //                 'color': '#FFFF4B',
    //                 'task_id': 'custom_task',
    //                 'custom_task': {
    //                     'type': 'position_move',
    //                     'position': position._id,
    //                     'device_type': 'MiR_100',
    //                 },
    //                 'deviceType': 'MiR_100',
    //                 'id': `custom_task_charge_${ind}`
    //             }
    //         ]
    //     }
    // })


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