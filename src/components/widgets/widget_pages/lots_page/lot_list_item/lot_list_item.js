import React, {useEffect, useState} from 'react'

// constants
import {BASIC_FIELD_DEFAULTS} from "../../../../../constants/form_constants"

// functions external
import PropTypes from 'prop-types'

// utils
import {dateRangeToStrings} from "../../../../../methods/utils/card_utils"
import {formatLotNumber} from "../../../../../methods/utils/lot_utils"

// styles
import * as styled from "./lot_list_item.style"

const LotListItem = props => {
	const {
		name,
		lotNumber,
		quantity,
		dates,
		onClick
	} = props

	/*
	* returns display name
	*
	* if name is provided, returns name, otherwise returns formattedLotNumber
	* */
	const getDisplayName = () => {
		return name ? name : formattedLotNumber
	}

	const getDisplayNameLabel = () => {
		return name ? "Lot Name" : "Lot Number"
	}

	const [formattedLotNumber, setFormattedLotNumber] = useState(formatLotNumber(lotNumber))	// lot number formatted for display
	const [displayName, setDisplayName] = useState(getDisplayName())							// display name
	const [displayNameLabel, setDisplayNameLabel] = useState(getDisplayNameLabel())							// display name

	/*
	* formatted lot number calculated here in order to not require calculating every render
	* */
	useEffect(() => {
		setFormattedLotNumber(formatLotNumber(lotNumber))
	}, [lotNumber])

	useEffect(() => {
		setDisplayName(getDisplayName())
		setDisplayNameLabel(getDisplayNameLabel())
	}, [formattedLotNumber, name])

	const [startDateText, setStartDateText] = useState("Start")
	const [endDateText, setEndDateText] = useState("End")

	useEffect(() => {
		const [tempStartDateText, tempEndDateText] = dateRangeToStrings(dates)
		setStartDateText(tempStartDateText)
		setEndDateText(tempEndDateText)
	}, [dates])

	return (
		<styled.ListItemRect>
			<styled.RowContainer>
				<styled.ColumnContainer1>
					<styled.ListSubtitle>{displayNameLabel}:</styled.ListSubtitle>
					<styled.ListContent>{displayName}</styled.ListContent>
				</styled.ColumnContainer1>

				<styled.ColumnContainer2>
					<styled.ListSubtitle>Quantity:</styled.ListSubtitle>
					<styled.ListContent>{quantity}</styled.ListContent>
				</styled.ColumnContainer2>

				<styled.ColumnContainer2>
					<styled.ListSubtitle>End Date:</styled.ListSubtitle>
					{!!endDateText &&
					<styled.ListContent>{endDateText}</styled.ListContent>
					}
				</styled.ColumnContainer2>

				<styled.ListItemIcon
					className={'fas fa-edit'}
					onClick = {onClick}
				/>
			</styled.RowContainer>
		</styled.ListItemRect>
	)
}

LotListItem.propTypes = {
	name: PropTypes.string,
	lotNumber: PropTypes.number,
	quantity: PropTypes.number,
	dates: PropTypes.array,
	onClick: PropTypes.func
}

LotListItem.defaultProps = {
	name: "",
	lotNumber: 0,
	quantity: 0,
	dates: [...BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE],
	onClick: () => {}
}

export default LotListItem
