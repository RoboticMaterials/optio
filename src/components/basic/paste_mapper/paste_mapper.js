import React, {useContext, useEffect, useRef, useState} from 'react'
import PropTypes from "prop-types";
import * as styled from './paste_mapper.style'
import Button from "../button/button";
import ButtonGroup from "../button_group/button_group";
import {isArray} from "../../../methods/utils/array_utils";
import Textbox from "../textbox/textbox";
import {ThemeContext} from "styled-components";
import {
	CARD_SCHEMA_MODES,
	getCardSchema,
	getTemplateMapperSchema,
	templateMapperSchema
} from "../../../methods/utils/form_schemas";
import {CONTENT, FORM_BUTTON_TYPES} from "../../../constants/lot_contants";
import {Formik} from "formik";
import TextField from "../form/text_field/text_field";
import {Container, Draggable} from "react-smooth-dnd";

const PasteMapper = (props) => {

	const {
		table,
		schema,
		onCancel,
		availableFieldNames,
		values,
		errors,
		touched,
		setFieldValue,
		setSelectedFieldNames
	} = props

	const {
		selectedFieldNames
	} = values || {}
	console.log("PasteMapper props",props)
	console.log("PasteMapper fields",availableFieldNames)
	console.log("PasteMapper values",values)
	console.log("PasteMapper errors",errors)

	useEffect(() => {
		setSelectedFieldNames(selectedFieldNames)
	}, [selectedFieldNames])


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
		// columns
		if(isRow) {
			table.forEach((currCol, currColIndex) => {
				tempFieldLabels.push(currCol[fieldLabelsIndex])
			})
		}

		// rows
		else {

		}

		setFieldValue("selectedFieldNames", tempFieldLabels)

		// setSelectedFieldNames(tempFieldLabels)
	}, [fieldLabelsIndex, fieldDirection])

	useEffect(() => {
		let tempUsedFieldNames = [...usedAvailableFieldNames]
		availableFieldNames.forEach((currField, currIndex) => {
			tempUsedFieldNames[currIndex] = selectedFieldNames.includes(currField)
		})

		setUsedAvailableFieldNames(tempUsedFieldNames)
	}, [availableFieldNames, selectedFieldNames])

	console.log("usedAvailableFieldNames", usedAvailableFieldNames)
	console.log("selectedFieldNames", selectedFieldNames)
	console.log("availableFieldNames", availableFieldNames)

	const createPayload = () => {
		let data = []

		table.forEach((currCol, currColIndex) => {
			currCol.forEach((currItem, currItemIndex) => {
				const label = selectedFieldNames[currColIndex]

				if(data[currItemIndex]) {
					data[currItemIndex] =  {
						...data[currItemIndex],
						[label]: currItem
					}
				}
				else {
					data.push({[label]: currItem})
				}
			})
		})

		return data
	}

	// theme
	const themeContext = useContext(ThemeContext);


	const renderTable = () => {
		return (
			<styled.Table>
				{
					<styled.Column style={{flex: 0}}>
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
											<styled.ItemContainer style={{background: "transparent", border: "none"}}>
												{/*<div>Field Names</div>*/}
											</styled.ItemContainer>
											<styled.ItemContainer style={{background: "transparent", border: "none", alignSelf: "flex-end"}}>
												<styled.SelectButton
													type={"button"}
													onClick={(e) => {
														e.preventDefault()
														isSelected ? setFieldLabelsIndex(null) : setFieldLabelsIndex(currIndex)
													}}
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
												className={isSelected ? "fas fa-times-circle" : "fas fa-arrow-circle-right"}
												type={"button"}
												selected={isSelected}
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
											<styled.Trapezoid>
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

														if(addedIndex !== null) {
															const {
																fieldName
															} = payload || {}
															console.log("dropResult",dropResult)

															setFieldValue(`selectedFieldNames[${currRowIndex}]`, fieldName)
														}
													}}
													getChildPayload={index => {
														// return payload
													}}
													behaviour={"drop-zone"}
													getGhostParent={()=>{
														return document.body
													}}
												>
												<TextField

													name={`selectedFieldNames[${currRowIndex}]`}
													placeholder={"Field name..."}
													style={{
														background: themeContext.bg.tertiary,
														maxHeight: "2rem",
														color: "white"
													}}
													textboxContainerStyle={{
														maxHeight: "2rem"
													}}

												/>
												</Container>

											</styled.Trapezoid>
											}
											<styled.ItemContainer schema={schema} selected={isSelected}>
												<styled.Cell cell={true}>
													{currItem}
												</styled.Cell>
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

	return (

		<styled.Container>
			<styled.Header>
				<ButtonGroup
					buttonViewCss={styled.buttonViewCss}
					buttons={["Row", "Column"]}
					selectedIndex={fieldDirection}
					onPress={(index)=>{
						setFieldDirection(index)
					}}
					containerCss={styled.buttonGroupContainerCss}
					buttonViewSelectedCss={styled.buttonViewSelectedCss}
					buttonCss={styled.buttonCss}
				/>
			</styled.Header>

			<styled.Body>
				<styled.FieldNamesContainer>
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
							return {
								fieldName: availableFieldNames[index]
							}
						}}
						getGhostParent={()=>{
							return document.body
						}}
						behaviour={"drop-zone"}
						style={{display: "flex"}}
					>
					{availableFieldNames.map((currFieldName, currIndex) => {
						const isUsed = usedAvailableFieldNames[currIndex]

						return(
							isUsed ?
								<styled.FieldName disabled={isUsed}>{currFieldName}</styled.FieldName>
								:
							<Draggable
								disabled={isUsed}
								key={currIndex}
							>
								<styled.FieldName disabled={isUsed}>{currFieldName}</styled.FieldName>
							</Draggable>
						)
					})}
					</Container>
				</styled.FieldNamesContainer>

				{renderTable()}
			</styled.Body>



			<styled.Footer>
				<Button
					type={"button"}
					schema={schema}
					label={"Create Lots"}
					onClick={()=>{
						createPayload()
					}}
				/>
				<Button
					type={"button"}
					schema={schema}
					label={"Preview Lots"}
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

export const PasteForm = (props) => {
	const {

	} = props

	const [selectedFieldNames, setSelectedFieldNames] = useState([])

	return(
		<Formik
			initialValues={{
				selectedFieldNames: []
			}}

			validationSchema={templateMapperSchema}
			validateOnChange={true}
			validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
			validateOnBlur={true}

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
