import React, {useEffect, useState} from 'react';

import PropTypes from 'prop-types';

import * as styled from "./lot_simple_row.style";
import { capitalizeFirstLetter } from '../../../../../../methods/utils/string_utils'

const LotSimpleRow = (props) => {

	const {
		label,
		value,
		containerStyle,
		isLast,
        labelStyle,
        countStyle,
	} = props


	return (
		<styled.Row
			isLast={isLast}
			style={containerStyle}
		>
			<styled.Label style={labelStyle} >{capitalizeFirstLetter(label)}</styled.Label>
			<styled.Count style={countStyle} >{value}</styled.Count>
		</styled.Row>
	);
};

LotSimpleRow.propTypes = {

};

export default LotSimpleRow;
