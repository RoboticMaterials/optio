import React, {useContext, useEffect, useRef, useState} from "react";

// components internal
import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import Textbox from "../../../../basic/textbox/textbox";

// constants
import {SORT_MODES, SORT_OPTIONS} from "../../../../../constants/common_contants";
import {
	FIELD_DATA_TYPES,
	FLAG_OPTIONS,
	LOT_FILTER_OPTIONS,
	LOT_SORT_OPTIONS,
	SORT_DIRECTIONS
} from "../../../../../constants/lot_contants";

// functions external
import {ThemeContext} from "styled-components";
import {useSelector} from "react-redux";

// utils
import {isArray} from "../../../../../methods/utils/array_utils";
import {getAllTemplateFields} from "../../../../../methods/utils/lot_utils";

// styles
import * as styled from './zone_header.style'
import LotSortBar from "../lot_sort_bar/lot_sort_bar";
import LotFilterBar from "../lot_filter_bar/lot_filter_bar";
import LotFilterBarBasic from '../lot_filter_bar/lot_filter_bar_basic'

import {
	columnCss, columnCss3,
	containerCss,
	descriptionCss,
	dropdownCss,
	reactDropdownSelectCss,
	valueCss
} from "../lot_bars.style";
import MultiSelectOptions from "../multi_select_options/multi_select_options";

const ZoneHeader = (props) => {

	const {
		sortDirection,
		setSortDirection,
		setSortMode,
		sortMode,
		setSortChanged,
		lotFilterValue,
		setLotFilterValue,
		selectedFilterOption,
		setSelectedFilterOption,
		shouldFocusLotFilter,

		filters,
		onAddFilter,
		onRemoveFilter,

		selectedLots,
		onDeleteClick,
		onMoveClick,
		onClearClick,


	} = props
	const [size, setSize] = useState({
		width: undefined,
		height: undefined,
		offsetLeft: undefined,
		offsetTop: undefined,
	})

	const sizeRef = useRef(null)

	useEffect(() => {

		// if sizeRef is assigned
		if (sizeRef.current) {

			// extract dimensions of sizeRef
			let height = sizeRef.current.offsetHeight;
			let width = sizeRef.current.offsetWidth;
			let offsetTop = sizeRef.current.offsetTop;
			let offsetLeft = sizeRef.current.offsetLeft;

			// set zoneSize
			setSize({
				width: width,
				height: height,
				offsetTop: offsetTop,
				offsetLeft: offsetLeft,
			});
		}

	}, [sizeRef, window.innerWidth])

	const selectedSortOption =  SORT_OPTIONS.find((currOption) => currOption.sortMode === sortMode)

	const themeContext = useContext(ThemeContext)

	const processes = useSelector(state => { return Object.values(state.processesReducer.processes) }) || []
	const multipleFilters = useSelector(state => state.settingsReducer.settings.enableMultipleLotFilters)

	const [lotFilterOptions, setLotFilterOptions] = useState([...Object.values(LOT_FILTER_OPTIONS)])
	const [lotSortOptions, setLotSortOptions] = useState([...Object.values(LOT_SORT_OPTIONS)])

	return (
		<styled.Container>
			<styled.SortFilterContainer>
			<styled.OptionContainer>
				<LotSortBar
					sortMode={sortMode}
					setSortMode={setSortMode}
					sortDirection={sortDirection}
					setSortDirection={setSortDirection}
					setSortChanged = {setSortChanged}
					columnCss={columnCss3}
					containerCss={containerCss}
					dropdownCss={dropdownCss}
					valueCss={valueCss}
				/>
			</styled.OptionContainer>

			<styled.OptionContainer>
			{!!multipleFilters ?
				<LotFilterBar
					filters={filters}
					onAddFilter={onAddFilter}
					onRemoveFilter={onRemoveFilter}

					columnCss={columnCss3}
					containerCss={containerCss}
					dropdownCss={dropdownCss}
					valueCss={valueCss}
				/>
				:
				<LotFilterBarBasic
					lotFilterValue={lotFilterValue}
					columnCss={columnCss}
					containerCss={containerCss}
					descriptionCss={descriptionCss}
					dropdownCss={dropdownCss}
					valueCss={valueCss}
					reactDropdownSelectCss={reactDropdownSelectCss}
					setLotFilterValue={setLotFilterValue}
					selectedFilterOption={selectedFilterOption}
					setSelectedFilterOption={setSelectedFilterOption}
					filters={filters}
					onAddFilter={onAddFilter}
					onRemoveFilter={onRemoveFilter}
				/>
			}


			</styled.OptionContainer>
			</styled.SortFilterContainer>

			{selectedLots.length > 0 &&
			<MultiSelectOptions
				selectedLots={selectedLots}
				onDeleteClick={onDeleteClick}
				onMoveClick={onMoveClick}
				onClearClick={onClearClick}
			/>
			}
		</styled.Container>
	)
}

export default ZoneHeader
