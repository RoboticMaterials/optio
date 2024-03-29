const READ = 1
const CREATE = 2
const UPDATE = 4
const DELETE = 8

export const PERMISSION_LEVELS_ARR = [READ, CREATE, UPDATE, DELETE]


export const PERMISSION_LEVELS = {
    READ,
    CREATE,
    UPDATE,
    DELETE
}

const ALL = "ALL"
const ALL_EXCEPT = "ALL_EXCEPT"
const ONLY = "ONLY"
const NONE = "NONE"


export const PERMISSION_EXPRESSIONS = {
    ALL,
    ALL_EXCEPT,
    ONLY,
    NONE
}

export const RESOURCE_IDS = {
    EDIT_REPORT_MODAL_BUTTONS: "EDIT_REPORT_MODAL_BUTTONS"
}

export const EDIT_REPORT_BUTTONS_REQUEST = {
    items: [RESOURCE_IDS.EDIT_REPORT_MODAL_BUTTONS],
    level: PERMISSION_LEVELS.UPDATE,
}

export const CREATE_REPORT_BUTTONS_REQUEST = {
    items: [RESOURCE_IDS.EDIT_REPORT_MODAL_BUTTONS],
    level: PERMISSION_LEVELS.CREATE,
}
