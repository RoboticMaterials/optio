export const SORT_MODES = {
	START_ASCENDING: "START_ASCENDING",
	START_DESCENDING: "START_DESCENDING",
	END_ASCENDING: "END_ASCENDING",
	END_DESCENDING: "END_DESCENDING",
	NAME: "NAME",
	QUANTITY: "QUANTITY"
}

export const SORT_OPTIONS = [{description: "Name", sortMode: SORT_MODES.NAME},
	{description: "Quantity", sortMode: SORT_MODES.QUANTITY},
	{description: "Start (Old to New)", sortMode: SORT_MODES.START_ASCENDING},
	{description: "Start (New to Old)", sortMode: SORT_MODES.START_DESCENDING},
	{description: "End (New to Old)", sortMode: SORT_MODES.END_DESCENDING},
	{description: "End (Old to New)", sortMode: SORT_MODES.END_ASCENDING}]