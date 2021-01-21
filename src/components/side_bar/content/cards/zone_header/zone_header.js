import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import React, {useContext} from "react";
import {useSelector} from "react-redux";

import * as styled from './zone_header.style'
import Textbox from "../../../../basic/textbox/textbox";
import {ThemeContext} from "styled-components";
import {SORT_MODES, SORT_OPTIONS} from "../../../../../constants/common_contants";

const ZoneHeader = (props) => {

	const {
		selectedProcesses,
		setSelectedProcesses,
		zone,
		setLotFilterValue,
		setSortMode,
		sortMode
	} = props

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

			<styled.ColumnContainer>
				<styled.Description>Sort By:</styled.Description>
				<DropDownSearch
					schema={"lots"}
					style={{background: themeContext.bg.tertiary, width: "18rem"}}
					options={SORT_OPTIONS}
					onChange={(values) => {
						const selectedOption = values[0]
						setSortMode(selectedOption.sortMode)
					}}
					values={selectedSortOption ? [selectedSortOption] : []}

					labelField={"description"}
					valueField={"sortMode"}
				/>
			</styled.ColumnContainer>

			<styled.ColumnContainer>
				<styled.Description>Filter lots:</styled.Description>
				<Textbox
					placeholder='Filter lots...'
					onChange={(e) => {
						setLotFilterValue(e.target.value)
					}}
					style={{ background: themeContext.bg.tertiary, height: "100%", width: "15rem" }}
					textboxContainerStyle={{flex: 1, height: "100%" }}
					schema={"lots"}
				/>
			</styled.ColumnContainer>
		</styled.Container>
	)
}

export default ZoneHeader
