import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_footer.style"
import Button from "../../button/button";

const StatusListFooter = (props) => {

	const {
		onCloseClick,
		onShowMapperClick,
		onCanceleClick,
		onCreateAllClick,
		onCreateAllWithoutWarningClick,
	} = props

	return (
		<styled.Container>
			<Button
				type={"button"}
				schema={"lots"}
				label={"Create New Lots"}
				secondary
				onClick={onCreateAllWithoutWarningClick}
				style={{height: '3rem', padding: '0 2rem'}}
			/>

			<Button
				type={"button"}
				label={"Create All Lots"}
				schema={"lots"}
				onClick={onCreateAllClick}
				style={{height: '3rem', padding: '0 2rem'}}
			/>
		</styled.Container>
	);
};

StatusListFooter.propTypes = {
	
};

export default StatusListFooter;
