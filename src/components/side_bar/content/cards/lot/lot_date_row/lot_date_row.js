import React, {useEffect, useState} from 'react'

// functions external
import PropTypes from 'prop-types'

// styles
import * as styled from "./lot_date_row.style"

// utils
import {jsDateToString} from "../../../../../../methods/utils/card_utils"
import { capitalizeFirstLetter } from '../../../../../../methods/utils/string_utils'

const LotDateRow = (props) => {

	const {
		date,
		label,
		isLast,
		defaultDateText,
	} = props

	const [dateText, setDateText] = useState("Date")

	useEffect(() => {
		setDateText(jsDateToString(date))
	}, [date])

	return (
		<styled.Row isLast={isLast}>
			<styled.Label>{capitalizeFirstLetter(label)}</styled.Label>

				<styled.DateItem>
					<styled.DateText>{dateText ? dateText : defaultDateText}</styled.DateText>
				</styled.DateItem>
		</styled.Row>
	)
}

LotDateRow.propTypes = {
	defaultDateText: PropTypes.string
}

LotDateRow.defaultProps = {
	defaultDateText: "Date",
}

export default LotDateRow
