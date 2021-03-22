
export const QUEUE_BIN_ID = "QUEUE"
export const FINISH_BIN_ID = "FINISH"

export const QUEUE_BIN_DISPLAY_NAME = "Queue"
export const FINISH_BIN_DISPLAY_NAME = "Finish"

export const BIN_IDS = {
	QUEUE: QUEUE_BIN_ID,
	FINISH: FINISH_BIN_ID
}

export const QUEUE_THEME = {
	ICON: "fas fa-ellipsis-h",
	COLOR: "#b642f5",
	ID: QUEUE_BIN_ID,
	DISPLAY_NAME: QUEUE_BIN_DISPLAY_NAME

}
export const FINISH_THEME = {
	ICON: "fas fa-box",
	COLOR: "#ff8605",
	ID: FINISH_BIN_ID,
	DISPLAY_NAME: FINISH_BIN_DISPLAY_NAME,
}

export const BIN_THEMES = {
	QUEUE: QUEUE_THEME,
	FINISH: FINISH_THEME
}

export const FIELD_COMPONENT_NAMES = {
	TEXT_BOX: "TEXT_BOX",
	TEXT_BOX_BIG: "TEXT_BOX_BIG",
	NUMBER_INPUT: "NUMBER_INPUT",
	CALENDAR_SINGLE: "CALENDAR_SINGLE",
	CALENDAR_START_END: "CALENDAR_START_END",
}

export const FIELD_DATA_TYPES = {
	STRING: "STRING",
	EMAIL: "EMAIL",
	DATE: "DATE",
	DATE_RANGE: "DATE_RANGE",
	URL: "URL",
	INTEGER: "INTEGER",
}

export const CONTENT = {
	HISTORY: "HISTORY",
	CALENDAR: "CALENDAR",
	MOVE: "MOVE"
}

export const FORM_BUTTON_TYPES = {
	SAVE: "SAVE",
	ADD: "ADD",
	ADD_AND_NEXT: "ADD_AND_NEXT",
	MOVE_OK: "MOVE_OK"
}

export const BASIC_LOT_TEMPLATE_ID = "BASIC_LOT_TEMPLATE"



export const EDITOR_SIDEBAR_TYPES = {
	FIELDS: {
		name: "Fields",
		iconName: "fas fa-route",
	}
}



export const LOT_EDITOR_SIDEBAR_OPTIONS = {
	TEXT_BOX: {
		component: FIELD_COMPONENT_NAMES.TEXT_BOX,
		dataType: FIELD_DATA_TYPES.STRING
	},
	TEXT_BOX_BIG: {
		component: FIELD_COMPONENT_NAMES.TEXT_BOX_BIG,
		dataType: FIELD_DATA_TYPES.STRING
	},
	NUMBER_INPUT: {
		component: FIELD_COMPONENT_NAMES.NUMBER_INPUT,
		dataType: FIELD_DATA_TYPES.INTEGER
	},
	CALENDAR_SINGLE: {
		component: FIELD_COMPONENT_NAMES.CALENDAR_SINGLE,
		dataType: FIELD_DATA_TYPES.DATE
	},
	CALENDAR_START_END: {
		component: FIELD_COMPONENT_NAMES.CALENDAR_START_END,
		dataType: FIELD_DATA_TYPES.DATE_RANGE
	},
}



export const SIDE_BAR_MODES = {
	FIELDS: {
		name: "Fields",
		iconName: "fas fa-edit",
		color: "red"
	},
	TEMPLATES: {
		name: "Templates",
		iconName: "fas fa-file-invoice",
		color: "cyan"
	}
}

export const EMPTY_DEFAULT_FIELDS =  [
	[{_id: 0, ...LOT_EDITOR_SIDEBAR_OPTIONS.TEXT_BOX_BIG, fieldName: "description", key: 0}],
	[{_id: 1, ...LOT_EDITOR_SIDEBAR_OPTIONS.CALENDAR_START_END, fieldName: "dates", key: 1}]
]

export const BASIC_LOT_TEMPLATE = {
	fields: EMPTY_DEFAULT_FIELDS,
	name: BASIC_LOT_TEMPLATE_ID,
	_id: BASIC_LOT_TEMPLATE_ID
}

export const DEFAULT_NAME_DISPLAY_NAME = "Name"
export const DEFAULT_COUNT_DISPLAY_NAME = "Quantity"

export const DEFAULT_DISPLAY_NAMES = {
	name: DEFAULT_NAME_DISPLAY_NAME,
	count: DEFAULT_COUNT_DISPLAY_NAME
}

export const NAME_FIELD = {fieldName: "name", dataType: FIELD_DATA_TYPES.STRING, displayName: DEFAULT_NAME_DISPLAY_NAME, label: "Name"}
export const COUNT_FIELD = {fieldName: "count", fieldPath: ["bins", "QUEUE"], dataType: FIELD_DATA_TYPES.INTEGER, displayName: DEFAULT_COUNT_DISPLAY_NAME, label: "Quantity"}
export const LOT_NUMBER_FIELD = {fieldName: "lotNumber", dataType: FIELD_DATA_TYPES.INTEGER, label: "Lot Number"}


export const REQUIRED_FIELDS = [NAME_FIELD, COUNT_FIELD]

export const FORM_STATUS = {
	VALIDATION_START: 1,
	VALIDATION_SUCCESS: 2,
	VALIDATION_ERROR: 3,
	CREATE_START: 4,
	CREATE_SUCCESS: 5,
	CREATE_ERROR: 6,
	WAITING: 7,
	CANCELLED: 8,
	NOT_STARTED: 9,
}


export const defaultBins = {
	"QUEUE": {
		count: 0
	},
}

export const FLAG_OPTIONS = {
	0: {
		color: "#db2100",
		id: 0
	},
	1:{
		color: "#1a00c2",
		id: 1
	},
	2: {
		color: "#13a600",
		id: 2
	},
	3: {
		color: "#d800db",
		id: 3
	},
	4: {
		color: "#e3a600",
		id: 4
	},
}

export const SORT_DIRECTIONS = {
	ASCENDING: {
		color: "#db2100",
		id: 0,
		iconClassName: "fas fa-arrow-up"
	},
	DESCENDING:{
		color: "#1a00c2",
		id: 1,
		iconClassName: "fas fa-arrow-down"
	}
}



export const LOT_FILTER_OPTIONS = {
	name: {...NAME_FIELD},
	flags: {
		label: "Flags"
	},
	lotNumber: {...LOT_NUMBER_FIELD}
}

export const LOT_SORT_OPTIONS = {
	name: {...NAME_FIELD},
	quantity: {...COUNT_FIELD},
	lotNumber: {...LOT_NUMBER_FIELD}
}
