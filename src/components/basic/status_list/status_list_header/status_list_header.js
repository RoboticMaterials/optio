import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_header.style"

const StatusListHeader = props => {
	return (
		<styled.Container>
			<styled.Title>Lot Creation Status</styled.Title>
			<styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={props.onCanceleClick}/>
		</styled.Container>
	);
};

StatusListHeader.propTypes = {
	
};

export default StatusListHeader;
