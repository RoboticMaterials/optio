import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_item.style"

const StatusListItem = (props) => {

	const {
		title
	} = props

	return (
		<styled.Container>
			{title}
		</styled.Container>
	);
};

StatusListItem.propTypes = {

};

export default StatusListItem;
