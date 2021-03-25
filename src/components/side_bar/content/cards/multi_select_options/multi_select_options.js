import React, {useEffect, useState} from 'react'

// components internal
import Button from "../../../../basic/button/button"

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from "./multi_select_options.style"

const MultiSelectOptions = (props) => {

	const {
		selectedLots,
		onDeleteClick,
		onMoveClick,
		onClearClick
	} = props

	const [selectedLotsCount, setSelectedLotsCount] = useState(selectedLots.length)

	useEffect(() => {
		setSelectedLotsCount(selectedLots.length)
	}, [selectedLots])

	return (
		<styled.Container>
			<Button
				style={{margin: "0 1rem 0 0"}}
				type={"button"}
				schema={"delete"}
				tertiary
				onClick={onDeleteClick}
				label={`Delete (${selectedLotsCount})`}
			/>
			<Button
				style={{margin: "0 1rem 0 0"}}
				type={"button"}
				schema={"lots"}
				onClick={onMoveClick}
				label={`Move (${selectedLotsCount})`}
			/>
			<Button
				style={{margin: 0}}
				type={"button"}
				secondary
				schema={"lots"}
				onClick={onClearClick}
				label={`Clear Selected`}
			/>

		</styled.Container>
	)
}

MultiSelectOptions.propTypes = {
	selectedLots: PropTypes.array,
	onDeleteClick: PropTypes.func,
	onClearClick: PropTypes.func,
	onMoveClick: PropTypes.func,
}

MultiSelectOptions.defaultProps = {
	selectedLots: [],
	onDeleteClick: () => {},
	onClearClick: () => {},
	onMoveClick: () => {},
}

export default MultiSelectOptions
