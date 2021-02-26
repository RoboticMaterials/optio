import React, {useContext, useEffect, useRef, useState} from 'react'
import PropTypes from "prop-types";
import * as styled from './paste_mapper.style'
import Button from "../button/button";
import ButtonGroup from "../button_group/button_group";
import {immutableDelete, isArray} from "../../../methods/utils/array_utils";
import Textbox from "../textbox/textbox";
import {ThemeContext} from "styled-components";
import {
	CARD_SCHEMA_MODES,
	getCardSchema,
	getTemplateMapperSchema,
	templateMapperSchema
} from "../../../methods/utils/form_schemas";
import {
	CONTENT,
	COUNT_FIELD,
	FIELD_COMPONENT_NAMES,
	FIELD_DATA_TYPES,
	FORM_BUTTON_TYPES
} from "../../../constants/lot_contants";
import {Formik} from "formik";
import TextField from "../form/text_field/text_field";
import {Container, Draggable} from "react-smooth-dnd";
import ContainerWrapper from "../container_wrapper/container_wrapper";
import LotEditor from "../../side_bar/content/cards/card_editor/lot_editor";
import {isObject} from "../../../methods/utils/object_utils";
import {isEqualCI} from "../../../methods/utils/string_utils";
import {BASIC_FIELD_DEFAULTS} from "../../../constants/form_constants";

const PasteMapper = (props) => {

	const {
		schema,
		onCancel,
		availableFieldNames,
		values,
		errors,
		touched,
		setFieldValue,
		setSelectedFieldNames,
		onPreviewClick,
		onCreateClick,
		reset,
		resetForm,
		hidden
	} = props

	const {
		table
	} = values || {}

	const {
		selectedFieldNames
	} = values || {}

	useEffect(() => {
		setSelectedFieldNames(selectedFieldNames)
	}, [selectedFieldNames])

	useEffect(() => {
		if(reset) resetForm()
	}, [reset])



	const [fieldLabelsIndex, setFieldLabelsIndex] = useState()
	const [fieldDirection, setFieldDirection] = useState(0)
	// const [selectedFieldNames, setSelectedFieldNames] = useState([])
	const [usedAvailableFieldNames, setUsedAvailableFieldNames] = useState(availableFieldNames.map((junk) => false))
	const [isRow, setIsRow] = useState(fieldDirection === 0)

	useEffect(() => {
		setIsRow(fieldDirection === 0)
	}, [fieldDirection])

	useEffect(() => {
		let tempFieldLabels = []

		// rows
		if(isRow) {
			table.forEach((currCol, currColIndex) => {
				const currFieldName = currCol[fieldLabelsIndex]

				let payload = {
					fieldName: "",
					dataType: FIELD_DATA_TYPES.STRING
				}

				if(currFieldName) {

					payload = {
						fieldName: currFieldName,
						dataType: FIELD_DATA_TYPES.STRING,
						displayName: currFieldName,
					}

					for(const availableField of availableFieldNames) {
						const {
							fieldName: availableFieldName = "",
							displayName: availableDisplayName = "",
						} = availableField

						if(isEqualCI(currFieldName, availableDisplayName)) {
							payload = {...availableField}
							break	// quit looping
						}
					}
				}

				tempFieldLabels.push(payload)
			})
		}

		// columns
		else {

		}

		setFieldValue("selectedFieldNames", tempFieldLabels)

		// setSelectedFieldNames(tempFieldLabels)
	}, [fieldLabelsIndex, fieldDirection])

	useEffect(() => {
		let tempUsedFieldNames = [...usedAvailableFieldNames]
		availableFieldNames.forEach((currField, currIndex) => {
			const {
				fieldName: currAvailableFieldName = "",
				dataType: currAvailableDataType = FIELD_DATA_TYPES.STRING,
				index: currAvailableIndex,
				displayName: currAvailableDisplayName,
			} = currField || {}

			tempUsedFieldNames[currIndex] = false
			for(const selectedField of selectedFieldNames) {
				const {
					fieldName: currSelectedFieldName = "",
					dataType: currSelectedDataType = FIELD_DATA_TYPES.STRING,
					index: currSelectedIndex,
					displayName: currSelectedDisplayName,
				} = selectedField || {}

				if(currAvailableDataType === FIELD_DATA_TYPES.DATE_RANGE) {
					if(currAvailableIndex === currSelectedIndex && currSelectedDisplayName === currAvailableDisplayName) {
						tempUsedFieldNames[currIndex] = true
						break // no need to keep looping
					}

				}
				else {
					if(currSelectedDisplayName === currAvailableDisplayName) {
						tempUsedFieldNames[currIndex] = true
						break // no need to keep looping
					}
				}
			}
		})

		setUsedAvailableFieldNames(tempUsedFieldNames)
	}, [availableFieldNames, selectedFieldNames])

	const createPayload = () => {
		let data = []

		table.forEach((currCol, currColIndex) => {
			currCol
				// if a row is being used for field names, filter out this row when creating payload
				.filter((currItem, currItemIndex) => {
					if((fieldLabelsIndex !== null) && (currItemIndex === fieldLabelsIndex)) return false
					return true
				})
				.forEach((currItem, currItemIndex) => {
					const label = selectedFieldNames[currColIndex]

					let finalValue = currItem

					const {
						dataType = FIELD_DATA_TYPES.STRING,
						index,
						fieldPath,
					} = label || {}
					let fieldName = label?.fieldName
					if(!fieldName) fieldName = `undefined field ${currColIndex}`

					const existingData = data[currItemIndex]
					const {
						[fieldName]: currentFieldData
					} = existingData || {}


					/*
					* parse data
					* */
					if(dataType === FIELD_DATA_TYPES.DATE_RANGE) {
						let parsedDate = new Date(currItem)
						if(isArray(currentFieldData)) {
							finalValue = [...currentFieldData]
							finalValue.splice(index, 0, parsedDate)
						}
						else {
							finalValue = [parsedDate]
						}
					}
					else if(dataType === FIELD_DATA_TYPES.INTEGER) {
						finalValue = parseInt(finalValue)
						if(!Number.isInteger(finalValue)) finalValue = BASIC_FIELD_DEFAULTS.NUMBER_FIELD
					}

					let constructedPath = {}
					if(isArray(fieldPath) && fieldPath.length > 0) {

						finalValue = {
							[fieldPath[fieldPath.length - 1]]: {
								[fieldName]: finalValue
							}
						}

						fieldPath.forEach((currentPath, currPathIndex) => {
							if(currPathIndex === fieldPath.length - 1) return // skip last since it was done

							finalValue = {[currentPath]: finalValue}
						})
					}
					else{
						finalValue = {[fieldName]: finalValue}
					}


					if(existingData) {
						data[currItemIndex] =  {
							...existingData,
							...finalValue
						}
					}
					else {
						data.push({...finalValue})
					}
				})
		})

		return data
	}

	// theme
	const themeContext = useContext(ThemeContext);

	const onMinusClick = (removeIndex) => {
		let updatedTable = []
		table.forEach((currCol, currColIndex) => {
			if(isArray(currCol) && currCol.length > removeIndex) {
				const trimmedCol = immutableDelete(currCol, removeIndex)
				updatedTable.push(trimmedCol)
			}
			else {
				updatedTable.push(currCol)
			}
		})

		setFieldValue("table", updatedTable)
	}

	const renderTable = () => {
		return (
			<styled.Table>
				{
					<styled.Column style={{flex: 0, minWidth: "fit-content"}}>
						{isArray(table[0]) && table[0].map((junk, currIndex) => {

							const isSelected = isRow ? (currIndex === fieldLabelsIndex) : false

							if(fieldDirection === 1) {
								return(
									<styled.ItemContainer>
										<Textbox
											placeholder={"Field name..."}
											style={{
												background: themeContext.bg.quaternary,
												maxHeight: "2rem"
											}}
											textboxContainerStyle={{
												maxHeight: "2rem"
											}}

										/>
									</styled.ItemContainer>
								)
							}
							else {
								if(currIndex === 0) {
									return(
										<>
											<styled.ItemContainer style={{background: "transparent", border: "none",maxHeight: "4rem", height: "4rem"}}>
												{/*<div>Field Names</div>*/}
											</styled.ItemContainer>
											<styled.ItemContainer style={{background: "transparent", border: "none", alignSelf: "flex-end"}}>
												<styled.SelectButton
													className={"fas fa-minus-circle"}
													type={"button"}
													color={themeContext.schema.error.solid}
													onClick={(e) => {
														e.preventDefault()
														onMinusClick(currIndex)
													}}
												/>
												<styled.SelectButton
													type={"button"}
													onClick={(e) => {
														e.preventDefault()
														isSelected ? setFieldLabelsIndex(null) : setFieldLabelsIndex(currIndex)
													}}
													color={isSelected ? themeContext.schema.error.solid : themeContext.schema.ok.solid}
													selected={isSelected}
													className={isSelected ? "fas fa-times-circle" : "fas fa-arrow-circle-right"}
												/>
											</styled.ItemContainer>
										</>
									)
								}
								else {
									return(
										<styled.ItemContainer style={{background: "transparent", border: "none", alignSelf: "flex-end"}}>
											<styled.SelectButton
												className={"fas fa-minus-circle"}
												color={themeContext.schema.error.solid}
												type={"button"}
												onClick={(e) => {
													e.preventDefault()
													onMinusClick(currIndex)
												}}
											/>
											<styled.SelectButton
												className={isSelected ? "fas fa-times-circle" : "fas fa-arrow-circle-right"}
												type={"button"}
												selected={isSelected}
												color={isSelected ? themeContext.schema.error.solid : themeContext.schema.ok.solid}
												onClick={(e) => {
													e.preventDefault()
													isSelected ? setFieldLabelsIndex(null) : setFieldLabelsIndex(currIndex)
												}}
											/>
										</styled.ItemContainer>
									)
								}


							}

						})}
					</styled.Column>

				}
				{table.map((currRow, currRowIndex) => {

					return(
						<styled.Column>
							{currRow
								// .filter((currItem, currItemIndex) => {
								// 	const isSelected = isRow ? (currItemIndex === fieldLabelsIndex) : false
								//
								// 	if(!isSelected) return true
								// 	return false
								// })
								.map((currItem, currItemIndex) => {
									const isSelected = isRow ? (currItemIndex === fieldLabelsIndex) : false
									return(
										<>
											{/**/}
											{(currItemIndex === 0 && fieldDirection === 0) &&
											<ContainerWrapper
												showHighlight={false}
												shiftable={false}
												groupName="field_names"
												onDragStart={(dragStartParams, b, c)=>{
													const {
														isSource,
														payload,
														willAcceptDrop
													} = dragStartParams

													if(isSource) {
													}
												}}
												onDragEnd={(dragEndParams)=>{
													const {
														isSource,
														payload,
														willAcceptDrop
													} = dragEndParams

													if(isSource) {
													}
												}}
												onDrop={(dropResult) => {
													const {
														removedIndex,
														addedIndex,
														payload
													} = dropResult

													if(removedIndex !== null) {
														setFieldValue(`selectedFieldNames[${currRowIndex}]`,  {
															fieldName: "",
															dataType: FIELD_DATA_TYPES.STRING,
															displayName: ""
														})
													}

													if(addedIndex !== null) {
														const {

														} = payload || {}

														setFieldValue(`selectedFieldNames[${currRowIndex}]`, payload)
													}
												}}
												getChildPayload={index => {
													// const selectedField = availableFieldNames[index]
													// return selectedField
													return values.selectedFieldNames[currRowIndex] || {}
												}}
												behaviour={"drop-zone"}
												getGhostParent={()=>{
													return document.body
												}}
												style={{minHeight: "4rem"}}
											>
												<Draggable>
													<styled.FieldNameTab>
														<styled.Trapezoid/>
														<TextField
															inputComponent={"input"}
															containerStyle={{
																alignSelf: "center",
																padding: "0 1rem",
																flex: .9
															}}
															name={`selectedFieldNames[${currRowIndex}]`}
															mapInput={(inputVal) => {
																return isObject(inputVal) ? (inputVal.displayName) : ""
															}}
															mapOutput={(outputVal) => {
																let mappedOutputVal = {
																	dataType: FIELD_DATA_TYPES.STRING,
																	...values.selectedFieldNames[currRowIndex],
																	fieldName: outputVal,
																	displayName: outputVal,
																}

																for(const availableField of availableFieldNames) {
																	const {
																		displayName: availableDisplayName = "",
																	} = availableField

																	if(isEqualCI(outputVal, availableDisplayName)) {
																		mappedOutputVal = {...availableField}
																		break	// quit looping
																	}
																}

																return mappedOutputVal
															}}
															placeholder={"Field name..."}
															style={{
																background: themeContext.bg.tertiary,
																maxHeight: "2rem",
																color: "white",
															}}
															textboxContainerStyle={{
																maxHeight: "2rem",
															}}

														/>
													</styled.FieldNameTab>
												</Draggable>
											</ContainerWrapper>
											}
											<styled.ItemContainer schema={schema} selected={isSelected}>
												<TextField
													name={`table[${currRowIndex}][${currItemIndex}]`}
													placeholder={"Enter data..."}
													style={{
														borderRadius: ".5rem",
														flex: 1,
														alignSelf: "stretch",
														textAlign: "center",
														padding: "0 .5rem",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														background: "transparent",
														color: "white"
													}}

												/>
												{/*<styled.Cell cell={true}>*/}
												{/*	{currItem}*/}
												{/*</styled.Cell>*/}
											</styled.ItemContainer>
										</>
									)
								})}
						</styled.Column>
					)
				})}
			</styled.Table>
		)
	}

	if(!hidden) {
		return (

			<styled.Container>
				<styled.Header>
					<styled.Title>Map Data</styled.Title>
					{/*<ButtonGroup*/}
					{/*	buttonViewCss={styled.buttonViewCss}*/}
					{/*	buttons={["Row", "Column"]}*/}
					{/*	selectedIndex={fieldDirection}*/}
					{/*	onPress={(index)=>{*/}
					{/*		setFieldDirection(index)*/}
					{/*	}}*/}
					{/*	containerCss={styled.buttonGroupContainerCss}*/}
					{/*	buttonViewSelectedCss={styled.buttonViewSelectedCss}*/}
					{/*	buttonCss={styled.buttonCss}*/}
					{/*/>*/}
				</styled.Header>

				<styled.Body>
					<styled.FieldNamesContainer>
						<styled.SectionTitle>Available Fields</styled.SectionTitle>

						<Container
							groupName="field_names"
							onDragStart={(dragStartParams, b, c)=>{
								const {
									isSource,
									payload,
									willAcceptDrop
								} = dragStartParams

								if(isSource) {
								}
							}}
							onDragEnd={(dragEndParams)=>{
								const {
									isSource,
									payload,
									willAcceptDrop
								} = dragEndParams

								if(isSource) {
								}
							}}
							onDrop={(dropResult) => {
								const {
									removedIndex,
									addedIndex,
									payload
								} = dropResult

							}}
							getChildPayload={index => {
								const selectedField = availableFieldNames[index]
								const {
									fieldName = ""
								} = selectedField || {}

								return selectedField
							}}
							getGhostParent={()=>{
								return document.body
							}}
							behaviour={"drop-zone"}
							style={{display: "flex"}}
						>
							{availableFieldNames.map((currField, currIndex) => {

								const {
									fieldName: currFieldName = "",
									type: currType = "",
									displayName: currDisplayName = ""
								} = currField || {}

								const isUsed = usedAvailableFieldNames[currIndex]
								return(
									isUsed ?
										<styled.FieldName disabled={isUsed}>{currDisplayName ? currDisplayName : currFieldName}</styled.FieldName>
										:
										<Draggable
											disabled={isUsed}
											key={currIndex}
										>
											<styled.FieldName disabled={isUsed}>{currDisplayName ? currDisplayName : currFieldName}</styled.FieldName>
										</Draggable>
								)
							})}
						</Container>

						<styled.SectionDescription>Drag one of the available fields onto a tab to map the values in that column to the field name.</styled.SectionDescription>
					</styled.FieldNamesContainer>

					<styled.SectionBreak/>
					<styled.TableContainer>
						{renderTable()}
					</styled.TableContainer>
					<styled.SectionBreak/>
				</styled.Body>



				<styled.Footer>
					<Button
						type={"button"}
						schema={schema}
						label={"Create Lots"}
						onClick={()=>{
							const payload = createPayload()
							onCreateClick(payload)
						}}
					/>
					<Button
						type={"button"}
						schema={schema}
						label={"Preview Lots"}
						onClick={() => {
							const payload = createPayload()
							onPreviewClick(payload)
						}}
					/>
					<Button
						schema={schema}
						type={"button"}
						label={"Cancel"}
						onClick={onCancel}
					/>
				</styled.Footer>
			</styled.Container>

		)
	}
	else {
		return null
	}


}

export const PasteForm = (props) => {

	const {
		onPreviewClick,
		hidden
	} = props

	const [selectedFieldNames, setSelectedFieldNames] = useState([])


	const handlePreviewClick = (payload) => {
		onPreviewClick && onPreviewClick(payload)
	}


	return(
		<Formik
			initialValues={{
				selectedFieldNames: [],
				table: props.table
			}}

			validationSchema={templateMapperSchema}
			validateOnChange={true}
			validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
			validateOnBlur={true}
			enableReinitialize={false}

			onSubmit={async (values, { setSubmitting, setTouched, resetForm }) => {
				// set submitting to true, handle submit, then set submitting to false
				// the submitting property is useful for eg. displaying a loading indicator
				const {
					buttonType
				} = values

				setSubmitting(true)
				// await handleSubmit(values, formMode)
				setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
				setSubmitting(false)
			}}
		>
			{formikProps =>
				<PasteMapper
					onPreviewClick={handlePreviewClick}
					{...formikProps}
					{...props}
					setSelectedFieldNames={setSelectedFieldNames}
				/>
			}
		</Formik>
	)
}

// Specifies propTypes
PasteMapper.propTypes = {
	table: PropTypes.arrayOf(	// array of array of strings
		PropTypes.arrayOf(
			PropTypes.string
		)
	)
};

// Specifies the default values for props:
PasteMapper.defaultProps = {
	table: [],
	schema: "lots",
	onCancel: () => {}
};


export default PasteMapper
