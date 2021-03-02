import {
    TOGGLE_NOTIFICATION_TASK_QUEUE,
} from '../types/notifications_types'


const defaultState = {
    hiddenNotifications: {},
    notifications: [
        {
            type: "station_alert",
            label: "Workstation 3",
            message: "Takt time is 10s slower than normal",
            priority: "warning",
            dateTime: new Date(2020, 7, 25, 11, 34)
        },
        {
            type: "device_alert",
            label: "MiR 3",
            message: "Battery low",
            priority: "critical",
            dateTime: new Date(2020, 7, 24, 15, 12)
        },
        {
            type: "station_alert",
            label: "Shipping",
            message: "Station has denyed task request 'Finished Cartridges to Shipping'",
            priority: "alert",
            dateTime: new Date(2020, 7, 22, 15, 54)
        },
        {
            type: "station_alert",
            label: "Workstation 4",
            message: "Takt time is 8s faster than normal",
            priority: "alert",
            dateTime: new Date(2020, 7, 10, 16, 32)
        }

    ],

    toggleNotificationTaskQueue: 'taskQueue'
}

const notificationsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'HIDDEN_NOTIFICATIONS':

            // Need to assign to new object because React doesn't see the object change as a state change. 
            // This makes react think a state change is happening so the component rerenders
            const newPayload = { ...action.payload }

            return {
                ...state,
                hiddenNotifications: newPayload,
            }

        case TOGGLE_NOTIFICATION_TASK_QUEUE:
            return {
                ...state,
                toggleNotificationTaskQueue: action.payload,
            }

        default:
            return state
    }
}

export default notificationsReducer