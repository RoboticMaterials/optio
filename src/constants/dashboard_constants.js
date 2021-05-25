export const ADD_TASK_ALERT_TYPE = {
    TASK_EXISTS: "TASK_EXISTS",
    TASK_ADDED: "TASK_ADDED",
    ADDING: "ADDING",
    REPORT_SEND_SUCCESS: "REPORT_SEND_SUCCESS",
    REPORT_SEND_FAILURE: "REPORT_SEND_FAILURE",
    KICK_OFF_SUCCESS: "KICK_OFF_SUCCESS",
    KICK_OFF_FAILURE: "KICK_OFF_FAILURE",
    FINISH_SUCCESS: "FINISH_SUCCESS",
    FINISH_FAILURE: "FINISH_FAILURE",
}

export const PAGES = {
    DASHBOARDS: "Dashboards",
    EDITING: "Editing",
    DASHBOARD: "Dashboard"
}

export const DASHBOARD_BUTTON_COLORS = [
    {
        hex: '#FF4B4B',
        label: "Red"
    },
    {
        hex: '#56d5f5',
        label: "Blue"
    },
    {
        hex: '#50de76',
        label: "Green"
    },
    {
        hex: '#f2ae41',
        label: "Orange"
    },
    {
        hex: '#c7a0fa',
        label: "Purple"
    }
]

export const OPERATION_TYPES = {
    REPORT: {
        schema: "error",
        name: "Report",
        key: "REPORT",
        _id: 0
    },
    KICK_OFF: {
        schema: "kick_off",
        key: "KICK_OFF",
        name: "Kick off",
        _id: 1
    },
    FINISH: {
        schema: "finish",
        key: "FINISH",
        name: "Finish",
        _id: 2
    }
}

export const TYPES = {
    // ALL: {
    //     name: "ALL",
    //     iconName: "fal fa-globe"
    // },
    ROUTES: {
        name: "Routes",
        iconName: "fas fa-route",
        key: "ROUTES"
    },
    OPERATIONS: {
        name: "Operations",
        iconName: "fas fa-sticky-note",
        key: "OPERATIONS"
    }
}
