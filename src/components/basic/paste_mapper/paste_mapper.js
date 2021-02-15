import React, {useContext, useEffect, useRef, useState} from 'react'
import PropTypes from "prop-types";
import * as styled from './paste_mapper.style'
import Button from "../button/button";
import ButtonGroup from "../button_group/button_group";
import {isArray} from "../../../methods/utils/array_utils";
import Textbox from "../textbox/textbox";
import {ThemeContext} from "styled-components";

const PasteMapper = (props) => {

	const {
		table,
		schema,
		onCancel
	} = props

	const [fieldLabelsIndex, setFieldLabelsIndex] = useState()
	const [fieldDirection, setFieldDirection] = useState(0)
	const [fieldNames, setFieldNames] = useState([])

	const isRow = fieldDirection === 0

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

		setFieldNames(tempFieldLabels)

		console.log("tempFieldLabels",tempFieldLabels)
	}, [fieldLabelsIndex, fieldDirection])

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
														setFieldLabelsIndex(currIndex)
													}}
													className={isSelected ? "" : "fas fa-arrow-circle-right"}
												/>
											</styled.ItemContainer>
										</>
									)
								}
								else {
									return(
										<styled.ItemContainer style={{background: "transparent", border: "none", alignSelf: "flex-end"}}>
											<styled.SelectButton
												className="fas fa-arrow-circle-right"
												type={"button"}
												onClick={(e) => {
													e.preventDefault()
													setFieldLabelsIndex(currIndex)
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
												<Textbox
													value={
														isRow ? fieldNames[currRowIndex] : ""
													}
													placeholder={"Field name..."}
													style={{
														background: themeContext.bg.tertiary,
														maxHeight: "2rem",
													}}
													textboxContainerStyle={{
														maxHeight: "2rem"
													}}

												/>

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


			{renderTable()}
			<styled.Footer>
				<Button
					type={"button"}
					schema={schema}
					label={"Create Lots"}
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
