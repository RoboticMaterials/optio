import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_footer.style"
import Button from "../../button/button";

const StatusListFooter = (props) => {

	const {
		onCloseClick,
		onShowMapperClick,
		onCanceleClick,
		onCreateAllClick
	} = props

	return (
		<styled.Container>
			<Button
				type={"button"}
				label={"Create All"}
				schema={"lots"}
				onClick={onCreateAllClick}
			/>

			<Button
				type={"button"}
				schema={"lots"}
				label={"Close"}
				onClick={onCanceleClick}
			/>
		</styled.Container>
	);
};

StatusListFooter.propTypes = {
	
};

export default StatusListFooter;
