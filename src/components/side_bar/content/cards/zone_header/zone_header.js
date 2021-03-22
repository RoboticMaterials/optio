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
import {
	columnCss, columnCss3,
	containerCss,
	descriptionCss,
	dropdownCss,
	reactDropdownSelectCss,
	valueCss
} from "../lot_bars.style";

const ZoneHeader = (props) => {

	const {
		selectedProcesses,
		setSelectedProcesses,
		sortDirection,
		setSortDirection,
		zone,
		setLotFilterValue,
		setSortMode,
		sortMode,
		selectedFilterOption,
		setSelectedFilterOption
	} = props

	const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates}) || {}

	const [lotFilterOptions, setLotFilterOptions] = useState([...Object.values(LOT_FILTER_OPTIONS)])
	const [lotSortOptions, setLotSortOptions] = useState([...Object.values(LOT_SORT_OPTIONS)])

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

	useEffect(() => {
		const templateFields = getAllTemplateFields()

		let tempLotFilterOptions = [...Object.values(LOT_FILTER_OPTIONS)]
		let tempLotSortOptions = [...Object.values(LOT_SORT_OPTIONS)]

		templateFields.map((currTemplateField) => {
			tempLotFilterOptions.push(currTemplateField)

			const {
				dataType,
				label
			} = currTemplateField

			if(dataType === FIELD_DATA_TYPES.DATE_RANGE) {
				tempLotSortOptions.push({
					...currTemplateField,
					label: `${label} (start)`,
					index: 0,
					fieldName: label
				})
				tempLotSortOptions.push({
					...currTemplateField,
					label: `${label} (end)`,
					index: 1,
					fieldName: label
				})
			}
			else {
				tempLotSortOptions.push({
					...currTemplateField,
					fieldName: label
				})
			}



		})

		setLotFilterOptions(tempLotFilterOptions)
		setLotSortOptions(tempLotSortOptions)
	}, [lotTemplates])

	const selectedSortOption =  SORT_OPTIONS.find((currOption) => currOption.sortMode === sortMode)

	const themeContext = useContext(ThemeContext)

	const processes = useSelector(state => { return Object.values(state.processesReducer.processes) })

	return (
		<styled.Container>

			{zone === "summary" &&
			<styled.ColumnContainer
				css={columnCss3}
			>
				<styled.Description>Processes:</styled.Description>
				<div
					ref={sizeRef}
					style={{
						flex: 1,
						overflow: "hidden"
					}}
				>
				<DropDownSearch
					maxDropdownWidth={`${size.width}px` }
					portal={document.getElementById("root")}
					containerCss={containerCss}
					dropdownCss={dropdownCss}
					valueCss={valueCss}
					schema={"lots"}
					placeholder='Select processes...'
					style={{
						background: themeContext.bg.secondary,
						flex: 1,
						overflow: "hidden"
					}}
					onClearAll={()=>{
						setSelectedProcesses([])
					}}
					multi
					values={selectedProcesses}
					options={processes}
					onChange={values => {
						setSelectedProcesses(values)
					}}
					pattern={null}
					labelField={'name'}
					valueField={"_id"}
					onDropdownOpen={() => {
					}}
					onRemoveItem={(values)=> {
						setSelectedProcesses(values)

					}}
				/>
				</div>
			</styled.ColumnContainer>
			}

			<LotSortBar
				sortMode={sortMode}
				setSortMode={setSortMode}
				sortDirection={sortDirection}
				setSortDirection={setSortDirection}
				columnCss={columnCss3}
				containerCss={containerCss}
				dropdownCss={dropdownCss}
				valueCss={valueCss}
			/>

			<LotFilterBar
				setLotFilterValue={setLotFilterValue}
				selectedFilterOption={selectedFilterOption}
				setSelectedFilterOption={setSelectedFilterOption}
				columnCss={columnCss3}
				containerCss={containerCss}
				// descriptionCss={descriptionCss}
				dropdownCss={dropdownCss}
				valueCss={valueCss}
				reactDropdownSelectCss={reactDropdownSelectCss}
			/>
		</styled.Container>
	)
}

export default ZoneHeader
