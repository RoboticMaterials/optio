import React, {useEffect, useState} from 'react'

// functions external
import PropTypes from 'prop-types'

// utils
import {formatLotNumber} from "../../../../../../methods/utils/lot_utils"

// styles
import * as style from "./simple_lot.style"

const SimpleLot = (props) => {
	const {
		name,
		quantity,
		lotNumber
	} = props

	/*
	* returns display name
	*
	* if name is provided, returns name, otherwise returns formattedLotNumber
	* */
	const getDisplayName = () => {
		return name ? name : formattedLotNumber
	}

	const [formattedLotNumber, setFormattedLotNumber] = useState(formatLotNumber(lotNumber))	// lot number formatted for display
	const [displayName, setDisplayName] = useState(getDisplayName())							// display name

	/*
	* formatted lot number calculated here in order to not require calculating every render
	* */
	useEffect(() => {
		setFormattedLotNumber(formatLotNumber(lotNumber))
	}, [lotNumber])

	useEffect(() => {
		setDisplayName(getDisplayName())
	}, [formattedLotNumber, name])

	return (
		<style.LotItem>{`${displayName} (${quantity})`}</style.LotItem>
	)
}

SimpleLot.propTypes = {
	name: PropTypes.string,
	quantity: PropTypes.number,
	lotNumber: PropTypes.number
}

SimpleLot.defaultProps = {
	name: "",
	quantity: 0,
	lotNumber: 0,
}

export default SimpleLot
