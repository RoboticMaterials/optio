import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from "./lot_simple_row.style";
import { capitalizeFirstLetter, newlines } from '../../../../../../methods/utils/string_utils'
import uuid from "uuid";

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
			key = {uuid.v4()}
		>
			<styled.Label style={labelStyle} key = {uuid.v4()} >{capitalizeFirstLetter(label)}</styled.Label>
			<styled.Count style={countStyle} key = {uuid.v4()} >{!!value ? newlines(value) : ''}</styled.Count>
		</styled.Row>
	);
};

LotSimpleRow.propTypes = {

};

export default LotSimpleRow;
