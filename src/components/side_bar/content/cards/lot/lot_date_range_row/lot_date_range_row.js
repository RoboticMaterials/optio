import React, {useEffect, useState} from 'react';

import PropTypes from 'prop-types';

import * as styled from "./lot_date_range_row.style";
import {isArray} from "../../../../../../methods/utils/array_utils";
import {dateRangeToStrings} from "../../../../../../methods/utils/card_utils";
import { capitalizeFirstLetter } from '../../../../../../methods/utils/string_utils'

const LotDateRangeRow = (props) => {

	const {
		dateRange,
		label,
		isLast,
		defaultStartText,
		defaultEndText,
	} = props

	const [startDateText, setStartDateText] = useState("Start")
	const [endDateText, setEndDateText] = useState("End")

	useEffect(() => {
		const [tempStartDateText, tempEndDateText] = dateRangeToStrings(dateRange)
		setStartDateText(tempStartDateText)
		setEndDateText(tempEndDateText)
	}, [dateRange])

	return (
		<styled.Row isLast={isLast}>
			<styled.Label>{capitalizeFirstLetter(label)}</styled.Label>
			<styled.DatesContainer>
				<styled.DateItem>
					<styled.DateText>{startDateText ? startDateText : defaultStartText}</styled.DateText>
				</styled.DateItem>

				<styled.DateArrow className="fas fa-arrow-right"></styled.DateArrow>

				<styled.DateItem>
					<styled.DateText>{endDateText ? endDateText : defaultEndText}</styled.DateText>
				</styled.DateItem>
			</styled.DatesContainer>
		</styled.Row>
	);
};

LotDateRangeRow.propTypes = {

};

LotDateRangeRow.defaultProps = {
	defaultStartText: "Start",
	defaultEndText: "End",
};



export default LotDateRangeRow;
