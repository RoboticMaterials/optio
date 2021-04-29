import store from '../../redux/store/index'
import { OPERATION_TYPES, TYPES } from '../../constants/dashboard_constants'
import { isArray, isNonEmptyArray } from "./array_utils";
import { DASHBOARD_BUTTON_COLORS } from "../../constants/dashboard_constants";
import uuid from 'uuid'
import {
    CUSTOM_CHARGE_TASK_ID,
    CUSTOM_IDLE_TASK_ID,
    CUSTOM_IDLE_TASK_NAME,
    CUSTOM_TASK_ID
} from "../../constants/route_constants";

export const getChargeButton = ({ name: positionName, _id: positionId }) => {
    return {
        name: positionName,
        color: '#FFFF4B',
        task_id: 'custom_task',
        custom_task: {
            'type': 'position_move',
            'position': positionId,
            'device_type': 'MiR_100',
        },
        deviceType: 'MiR_100',
        id: CUSTOM_CHARGE_TASK_ID
    }
}

export const getIdleButton = ({ idle_location: idleLocationId }) => {
    return {
        name: CUSTOM_IDLE_TASK_NAME,
        color: '#FF4B4B',
        task_id: 'custom_task',
        custom_task: {
            'type': 'position_move',
            'position': idleLocationId,
            'device_type': 'MiR_100',
        },
        deviceType: 'MiR_100',
        id: CUSTOM_IDLE_TASK_ID
    }
}

export const getLocationDashboard = (dashboards, location) => {
    const {
        dashboards: dashboardIds = []
    } = location || {}

    const firstDashboardId = dashboardIds.length > 0 ? dashboardIds[0] : null

    return dashboards[firstDashboardId] || {}
}

export const getDashboardNameFromLocation = (location, dashboards) => {
    const dashboard = getLocationDashboard(dashboards, location)
    const displayName = getDashboardDisplayName(dashboard, location)
    return displayName
}

export const getDashboardDisplayName = (dashboard, location) => {
    const {
        name: locationName = ""
    } = location || {}

    const {
        name: dashboardName = ""
    } = dashboard || {}

    return dashboardName || `${locationName} Dashboard`
}

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

export const getContainsKickoffButton = ({ buttons }) => {
    for (const currButton of buttons) {
        const {
            type
        } = currButton

        if (type === OPERATION_TYPES.KICK_OFF.key) return true
    }

    return false
}

export const getContainsFinishButton = ({ buttons }) => {
    for (const currButton of buttons) {
        const {
            type
        } = currButton

        if (type === OPERATION_TYPES.FINISH.key) return true
    }

    return false
}

export const getOperationButton = (key) => {

    let index = 0
    for (const entry of Object.entries(OPERATION_TYPES)) {
        const currValue = entry[1]
        const currKey = entry[0]

        if (currKey === key) {
            return {
                name: currValue.name,
                color: DASHBOARD_BUTTON_COLORS[index % DASHBOARD_BUTTON_COLORS.length].hex,
                id: uuid.v4(),
                type: currKey,
            }
        }

        index = index + 1
    }
}

export const handleAvailableTasks = (tasks, station) => {
    let availableTasks = []

    // If the dashbaord is a device then have some differnt buttons available
    if (station.device_model) {
        // If the device has an idle location, add a button for it
        if (!!station.idle_location) {
            const idleButton = {
                'name': CUSTOM_IDLE_TASK_NAME,
                'color': '#FF4B4B',
                'task_id': 'custom_task',
                'custom_task': {
                    'type': 'position_move',
                    'position': station.idle_location,
                    'device_type': 'MiR_100',
                },
                'deviceType': 'MiR_100',
                'id': 'custom_task_idle'
            }

            availableTasks.push(idleButton)
        }
        const positions = store.getState().positionsReducer.positions
        // Map through positions and add a button if it's a charge position
        Object.values(positions).map((position, ind) => {
            if (position.type === 'charger_position') {
                const chargeButton = {
                    'name': position.name,
                    'color': '#FFFF4B',
                    'task_id': 'custom_task',
                    'custom_task': {
                        'type': 'position_move',
                        'position': position._id,
                        'device_type': 'MiR_100',
                    },
                    'deviceType': 'MiR_100',
                    'id': `custom_task_charge`
                }
                availableTasks.push(chargeButton)
            }
        })
    }
    else {
        Object.values(tasks).forEach(task => {
            if ((task.type == 'push' || task.type == 'both') && task.load.station == station._id) {
                availableTasks.push(task)
            } else if ((task.type == 'pull' || task.type == 'both') && task.unload.station == station._id) {
                availableTasks.push(task)
            }
        })
    }



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


/*
* returns whether or not the current button type should be allowed to be deleted from a dashboard
*
* currently none of them should be able to, but still use this function so if things change it can all be managed here
*
* args: needs button type passed in as object key, this way you can pass the entire button or just a simple object containing this key
* */
export const getCanDeleteDashboardButton = ({ type: buttonType }) => {
    switch (buttonType) {
        case TYPES.ROUTES.key:
        case OPERATION_TYPES.FINISH.key:
        case OPERATION_TYPES.KICK_OFF.key:
            return false

        case OPERATION_TYPES.REPORT.key:
            return true

        default:
            return false
    }
}

export const getIsKickoffEnabled = (availableProcessIds) => {
    return isNonEmptyArray(availableProcessIds)
}

export const getIsFinishEnabled = (availableProcessIds) => {
    return isNonEmptyArray(availableProcessIds)
}

export const getDashboardContainsRouteButton = ({ buttons: existingDashboardButtons }, { task_id: currButtonTaskId, id: buttonId, positionId }) => {
    for (const existingDashboardButton of existingDashboardButtons) {
        const {
            task_id: existingButtonTaskId = "",
            id: existingButtonId,
            custom_task
        } = existingDashboardButton || {}

        const {
            position: existingPositionId
        } = custom_task || {}

        if (currButtonTaskId === CUSTOM_TASK_ID) {
            if (buttonId === CUSTOM_IDLE_TASK_ID) {
                if (existingButtonId === buttonId) {
                    return true
                }
            }
            else if (buttonId === CUSTOM_CHARGE_TASK_ID) {
                if (existingButtonId === buttonId && positionId === existingPositionId) {
                    return true
                }
            }
        }
        else if (existingButtonTaskId === currButtonTaskId) {
            return true // quit looping
        }
    }

    return false
}

export const getDashboardContainsOperationButton = ({ buttons: existingDashboardButtons }, { type: currButtonType }) => {

    if (currButtonType === OPERATION_TYPES.REPORT.key) return false // multiple report buttons allowed

    for (const existingDashboardButton of existingDashboardButtons) {
        const {
            type: existingButtonType = ""
        } = existingDashboardButton || {}

        if (existingButtonType === currButtonType) {
            return true // quit looping
        }
    }

    return false
}