import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import * as styled from "./lot_simple_row.style";
import { capitalizeFirstLetter, newlines } from '../../../../../../methods/utils/string_utils'
import {v4 as uuid} from "uuid"

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
			key = {uuid()}
		>
			<styled.Label style={labelStyle} key = {uuid()} >{capitalizeFirstLetter(label)}</styled.Label>
			<styled.Count style={countStyle} key = {uuid()} >{!!value ? newlines(value) : ''}</styled.Count>
		</styled.Row>
	);
};

LotSimpleRow.propTypes = {

};

export default LotSimpleRow;
