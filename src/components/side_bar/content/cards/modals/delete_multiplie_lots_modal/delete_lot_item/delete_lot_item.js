import React, {useEffect, useState} from 'react'

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from "./delete_lot_item.style"

// utils
import {formatLotNumber} from "../../../../../../../methods/utils/lot_utils"

const DeleteLotItem = props => {
	const {
		name,
		binName,
		processName,
		lotNumber
	} = props

	const [formattedLotNumber, setFormattedLotNumber] = useState(formatLotNumber(lotNumber))

	useEffect(() => {
		setFormattedLotNumber(formatLotNumber(lotNumber))
	}, [lotNumber])

	return (
		<styled.Container>
			<styled.Value>
				{name}
			</styled.Value>
			<styled.Value>
				{formattedLotNumber}
			</styled.Value>
			<styled.Value>
				{binName}
			</styled.Value>
			<styled.Value>
				{processName}
			</styled.Value>
		</styled.Container>
	)
}

DeleteLotItem.propTypes = {
	name: PropTypes.string,
	binName: PropTypes.string,
	processName: PropTypes.string,
	lotNumber: PropTypes.number,
}

DeleteLotItem.defaultProps = {
	name: "",
	binName: "",
	processName: "",
	lotNumber: 0,
}

export default DeleteLotItem
