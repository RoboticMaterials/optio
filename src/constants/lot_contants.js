


export const FIELD_COMPONENT_NAMES = {
	TEXT_BOX: "TEXT_BOX",
	TEXT_BOX_BIG: "TEXT_BOX_BIG",
	NUMBER_INPUT: "NUMBER_INPUT",
	CALENDAR_SINGLE: "CALENDAR_SINGLE",
	CALENDAR_START_END: "CALENDAR_START_END",
}

export const CONTENT = {
	HISTORY: "HISTORY",
	CALENDAR_START: "CALENDAR_START",
	CALENDAR_END: "CALENDAR_END",
	CALENDAR_RANGE: "CALENDAR_RANGE",
	MOVE: "MOVE"
}

export const FORM_BUTTON_TYPES = {
	SAVE: "SAVE",
	ADD: "ADD",
	ADD_AND_NEXT: "ADD_AND_NEXT",
	MOVE_OK: "MOVE_OK"
}

export const BASIC_LOT_TEMPLATE_ID = "BASIC_LOT_TEMPLATE"

export const BASIC_LOT_TEMPLATE = {
	fields: [
		[{_id: 0, component: FIELD_COMPONENT_NAMES.TEXT_BOX_BIG, fieldName: "description", key: 0}],
		[{_id: 1, component: FIELD_COMPONENT_NAMES.CALENDAR_START_END, fieldName: "dates", key: 1}]
	],
	name: BASIC_LOT_TEMPLATE_ID,
	_id: BASIC_LOT_TEMPLATE_ID
}

export const EDITOR_SIDEBAR_TYPES = {
	FIELDS: {
		name: "Fields",
		iconName: "fas fa-route",
	}
}



export const LOT_EDITOR_SIDEBAR_OPTIONS = {
	TEXT_BOX: {
		component: FIELD_COMPONENT_NAMES.TEXT_BOX
	},
	TEXT_BOX_BIG: {
		component: FIELD_COMPONENT_NAMES.TEXT_BOX_BIG
	},
	NUMBER_INPUT: {
		component: FIELD_COMPONENT_NAMES.NUMBER_INPUT
	},
	CALENDAR_SINGLE: {
		component: FIELD_COMPONENT_NAMES.CALENDAR_SINGLE
	},
	CALENDAR_START_END: {
		component: FIELD_COMPONENT_NAMES.CALENDAR_START_END
	},
}

export const EMPTY_DEFAULT_FIELDS =  [
	[{_id: 0, component: FIELD_COMPONENT_NAMES.TEXT_BOX_BIG, fieldName: "description", key: 0}],
	[{_id: 1, component: FIELD_COMPONENT_NAMES.CALENDAR_START_END, fieldName: "dates", key: 1}]
]

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

