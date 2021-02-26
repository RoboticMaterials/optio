import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_header.style"

const StatusListHeader = props => {
	return (
		<styled.Container>
			<styled.Title>Lot Creation Status</styled.Title>
		</styled.Container>
	);
};

StatusListHeader.propTypes = {
	
};

export default StatusListHeader;
