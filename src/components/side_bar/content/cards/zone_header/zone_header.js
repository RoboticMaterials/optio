import React, {useContext, useEffect, useState} from "react";

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
			<styled.ColumnContainer>
				<styled.Description>Selected Processes:</styled.Description>
				<DropDownSearch
					schema={"lots"}
					placeholder='Select processes...'
					style={{background: themeContext.bg.tertiary, width: "30rem"}}
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
			</styled.ColumnContainer>
			}

			<LotSortBar
				sortMode={sortMode}
				setSortMode={setSortMode}
				sortDirection={sortDirection}
				setSortDirection={setSortDirection}
			/>

			<LotFilterBar
				setLotFilterValue={setLotFilterValue}
				selectedFilterOption={selectedFilterOption}
				setSelectedFilterOption={setSelectedFilterOption}
			/>
		</styled.Container>
	)
}

export default ZoneHeader
