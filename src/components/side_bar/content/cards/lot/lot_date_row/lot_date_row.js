import React, {useEffect, useState} from 'react';

import PropTypes from 'prop-types';

import * as styled from "./lot_date_row.style";
import {isArray} from "../../../../../../methods/utils/array_utils";
import {dateRangeToStrings} from "../../../../../../methods/utils/card_utils";

const LotDateRangeRow = (props) => {

	const {
		dateRange,
		label,
		isLast
	} = props

	const [startDateText, setStartDateText] = useState()
	const [endDateText, setEndDateText] = useState()

	useEffect(() => {
		const [tempStartDateText, tempEndDateText] = dateRangeToStrings(dateRange)
		setStartDateText(tempStartDateText)
		setEndDateText(tempEndDateText)
	}, [dateRange])

	return (
		<styled.Row isLast={isLast}>
			<styled.Label>{label}</styled.Label>
			<styled.DatesContainer>
				<styled.DateItem>
					<styled.DateText>{startDateText}</styled.DateText>
				</styled.DateItem>

				<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

				<styled.DateItem>
					<styled.DateText>{endDateText}</styled.DateText>
				</styled.DateItem>
			</styled.DatesContainer>
		</styled.Row>
	);
};

LotDateRangeRow.propTypes = {

};

export default LotDateRangeRow;
