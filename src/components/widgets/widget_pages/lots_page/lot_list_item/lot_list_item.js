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
		description,
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
				<styled.ColumnContainer>
					<styled.ListContent style = {{fontWeight: 'bold'}}>{displayName}</styled.ListContent>
					{!!name &&
						<styled.TextContent style = {{paddingLeft: '1rem'}}>{formattedLotNumber}</styled.TextContent>
					}
				</styled.ColumnContainer>
				<styled.ListItemIcon
					className={'fas fa-edit'}
					onClick = {onClick}
				/>
			</styled.RowContainer>

			<styled.ContentRowContainer style = {{backgroundColor: 'white'}}>
					<styled.TextContent style = {{fontWeight: 'bold'}}>Quantity</styled.TextContent>
					<styled.TextContent>{quantity}</styled.TextContent>
			</styled.ContentRowContainer>

			<styled.ContentRowContainer style = {{backgroundColor: 'white'}}>
					<styled.TextContent style = {{fontWeight: 'bold'}}>Description</styled.TextContent>
					<styled.TextContent>{description}</styled.TextContent>
			</styled.ContentRowContainer>

			<styled.ContentRowContainer style = {{backgroundColor: 'white', borderBottomColor: 'transparent'}}>
					<styled.TextContent style = {{fontWeight: 'bold'}}>End Date</styled.TextContent>
					{!!endDateText &&
					<styled.TextContent>{endDateText}</styled.TextContent>
					}
					</styled.ContentRowContainer>

		</styled.ListItemRect>
	)
}

LotListItem.propTypes = {
	name: PropTypes.string,
	lotNumber: PropTypes.number,
	quantity: PropTypes.number,
	description: PropTypes.string,

	dates: PropTypes.array,
	onClick: PropTypes.func
}

LotListItem.defaultProps = {
	name: "",
	lotNumber: 0,
	quantity: 0,
	description: "",
	dates: [...BASIC_FIELD_DEFAULTS.CALENDAR_FIELD_RANGE],
	onClick: () => {}
}

export default LotListItem
