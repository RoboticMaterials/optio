export const SORT_MODES = {
	START_ASCENDING: "START_ASCENDING",
	START_DESCENDING: "START_DESCENDING",
	END_ASCENDING: "END_ASCENDING",
	END_DESCENDING: "END_DESCENDING",
	NAME_ASCENDING: "NAME_ASCENDING",
	NAME_DESCENDING: "NAME_DESCENDING",
	QUANTITY_ASCENDING: "QUANTITY_ASCENDING",
	QUANTITY_DESCENDING: "QUANTITY_DESCENDING"
}

export const SORT_OPTIONS = [
	{description: "Name (a-z)", sortMode: SORT_MODES.NAME_ASCENDING},
	{description: "Name (z-a)", sortMode: SORT_MODES.NAME_DESCENDING},
	{description: "Quantity (Increasing)", sortMode: SORT_MODES.QUANTITY_ASCENDING},
	{description: "Quantity (Decreasing)", sortMode: SORT_MODES.QUANTITY_DESCENDING},
	{description: "Start (Old to New)", sortMode: SORT_MODES.START_ASCENDING},
	{description: "Start (New to Old)", sortMode: SORT_MODES.START_DESCENDING},
	{description: "End (New to Old)", sortMode: SORT_MODES.END_DESCENDING},
	{description: "End (Old to New)", sortMode: SORT_MODES.END_ASCENDING}
]