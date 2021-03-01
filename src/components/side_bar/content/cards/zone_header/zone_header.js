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

	console.log("lotFilterOptions",lotFilterOptions)
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



			<styled.ColumnContainer>
				<styled.Description>Filter lots:</styled.Description>

				<styled.ItemContainer>
					<DropDownSearch
						options={lotFilterOptions}
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
							minWidth: "10rem",
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
														style={{
															margin: "0 .5rem",
														}}
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

								const isSelected = methods.isSelected(item)

								return(
									<styled.FlagButton
										style={{
											paddingTop: ".5rem",
											paddingBottom: ".5rem",
										}}
										selected={isSelected}
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
