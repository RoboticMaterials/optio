import DropDownSearch from "../../../../basic/drop_down_search_v2/drop_down_search";
import React, {useContext, useState} from "react";
import {useSelector} from "react-redux";

import * as styled from './zone_header.style'
import Textbox from "../../../../basic/textbox/textbox";
import {ThemeContext} from "styled-components";
import {SORT_MODES, SORT_OPTIONS} from "../../../../../constants/common_contants";
import {FLAG_OPTIONS, LOT_FILTER_OPTIONS} from "../../../../../constants/lot_contants";
import {getByPath} from "../../../../basic/drop_down_search_v2/util";
import {LIB_NAME} from "../../../../basic/drop_down_search_v2/constants";
import {isArray} from "../../../../../methods/utils/array_utils";





const ZoneHeader = (props) => {

	const {
		selectedProcesses,
		setSelectedProcesses,
		zone,
		setLotFilterValue,
		setSortMode,
		sortMode,
		selectedFilterOption,
		setSelectedFilterOption
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

				<styled.ItemContainer>
					<DropDownSearch
						options={Object.values(LOT_FILTER_OPTIONS)}
						onChange={(values) => {
							setSelectedFilterOption(values[0])
							setLotFilterValue(null)
						}}
						values={[selectedFilterOption]}
						labelField={"label"}
						valueField={"label"}
						schema={"lots"}
						style={{
							background: themeContext.bg.tertiary,
							borderTopRightRadius: 0,
							borderBottomRightRadius: 0,
							borderTopLeftRadius: "1rem",
							borderBottomLeftRadius: "1rem",
							borderBottom: `1px solid ${themeContext.bg.quinary}`,
						}}
					/>
					{selectedFilterOption.label === LOT_FILTER_OPTIONS.flags.label ?
						<DropDownSearch
							clearable={true}
							multi={true}
							options={Object.values(FLAG_OPTIONS)}
							onChange={(values) => {
								setLotFilterValue(values)
							}}
							onRemoveItem={(values) => {
								setLotFilterValue(values)
							}}
							onClearAll={() => {
								setLotFilterValue([])
							}}
							labelField={"id"}
							valueField={"id"}
							schema={"lots"}
							contentRenderer={({ props, state, methods }) => {

								const {
									values = []
								} = state || {}
								const value = state.values[0]

								if(isArray(values) && values.length > 0) {
									return (
										<styled.FlagsContainer>
											{values.map((currVal) => {
												const {
													color: currColor,
													id: currColorId
												} = currVal || {}

												return (
													<styled.FlagButton
														key={currColorId}
														type={"button"}
														color={currColor}
														onClick={(event) => {
															event.stopPropagation();
															methods.dropDown('open');
														}}
														schema={props.schema}
														className="fas fa-flag"
													/>
												)
											})}
										</styled.FlagsContainer>
									)
								}

								return(
									null
								)
							}}
							itemRenderer={({ item, itemIndex, props, state, methods }) => {
								const {
									color: currColor,
									id: currColorId
								} = item

								return(
									<styled.FlagButton
										key={currColorId}
										type={"button"}
										color={currColor}
										role="option"
										tabIndex="-1"
										onClick={item.disabled ? undefined : () => methods.addItem(item)}
										onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
										schema={props.schema}
										className="fas fa-flag"
									/>
								)
							}}

							style={{
								background: themeContext.bg.tertiary,
								width: "15rem",
								borderTopLeftRadius: 0,
								borderBottomLeftRadius: 0,
								borderTopRightRadius: "1rem",
								borderBottomRightRadius: "1rem",
								borderLeft: `1px solid ${themeContext.bg.quaternary}`,
								borderBottom: `1px solid ${themeContext.bg.quinary}`,
							}}
						/>
						:
						<Textbox
							placeholder='Filter lots...'
							onChange={(e) => {
								setLotFilterValue(e.target.value)
							}}
							style={{
								background: themeContext.bg.tertiary,
								height: "100%", width: "15rem",
								borderTopLeftRadius: 0,
								borderBottomLeftRadius: 0,
								borderTopRightRadius: "1rem",
								borderBottomRightRadius: "1rem",
								borderLeft: `1px solid ${themeContext.bg.quaternary}`
							}}
							textboxContainerStyle={{flex: 1, height: "100%" }}
							schema={"lots"}
						/>
					}

				</styled.ItemContainer>
			</styled.ColumnContainer>
		</styled.Container>
	)
}

export default ZoneHeader
