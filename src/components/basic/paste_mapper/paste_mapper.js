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
		table
	} = props

	const [fieldLabels, setFieldLabels] = useState([])
	const [fieldDirection, setFieldDirection] = useState(0)

	// theme
	const themeContext = useContext(ThemeContext);


	const renderTable = () => {
		return (
			<styled.Table>
				{
				<styled.Column>
					{isArray(table[0]) && table[0].map((junk, currIndex) => {

						if(fieldDirection === 1) {
							return(
								<styled.ItemContainer>
									<Textbox
										placeholder={"Field name..."}
										style={{
											background: themeContext.bg.tertiary,
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
									<styled.ItemContainer>
									<div>Use Field Names</div>
									</styled.ItemContainer>
								)
							}
							else {
								return(
									<styled.ItemContainer>
										->
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
							{currRow.map((currItem, currItemIndex) => {
								return(
									<>
										{(currItemIndex === 0 && fieldDirection === 0) &&
										<styled.ItemContainer>
											<Textbox
												placeholder={"Field name..."}
												style={{
													background: themeContext.bg.tertiary,
													maxHeight: "2rem"
												}}
												textboxContainerStyle={{
													maxHeight: "2rem"
												}}

											/>
										</styled.ItemContainer>
										}
									<styled.ItemContainer>
										{currItem}
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
	table: []
};


export default PasteMapper
