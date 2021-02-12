import React, {useEffect, useRef, useState} from 'react'
import PropTypes from "prop-types";
import * as styled from './paste_mapper.style'

const PasteMapper = (props) => {

	const {
		table
	} = props

	console.log("PasteMapper table",table)
	const [fieldLabels, setFieldLabels] = useState([])

	const renderTable = () => {
		return (
			<styled.Table>
				{table.map((currRow, currRowIndex) => {
					return(
						<styled.Row>
							{currRow.map((currItem, currItemIndex) => {
								return(
									<styled.ItemContainer>
										{currItem}
									</styled.ItemContainer>
								)
							})}
						</styled.Row>
					)
				})}
			</styled.Table>
		)
	}

	return (
		<styled.Container>
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
