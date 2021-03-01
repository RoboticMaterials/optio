import React, {useEffect, useState} from 'react';

import PropTypes from 'prop-types';

import * as styled from "./lot_simple_row.style";

const LotSimpleRow = (props) => {

	const {
		label,
		value,
		containerStyle,
		isLast
	} = props


	return (
		<styled.Row
			isLast={isLast}
			style={containerStyle}
		>
			<styled.Label>{label}</styled.Label>
			<styled.Count>{value}</styled.Count>
		</styled.Row>
	);
};

LotSimpleRow.propTypes = {

};

export default LotSimpleRow;
