import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_header.style"
import BackButton from '../../back_button/back_button';

const StatusListHeader = props => {
	return (
		<styled.Container>
			<BackButton schema='lots' onClick={props.onBack} />
			<styled.Title>Lot Validation Status</styled.Title>
			<styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={props.onCanceleClick}/>
		</styled.Container>
	);
};

StatusListHeader.propTypes = {
	
};

export default StatusListHeader;
