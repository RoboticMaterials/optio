import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_footer.style"
import Button from "../../button/button";

const StatusListFooter = (props) => {

	const {
		onCloseClick,
		onShowMapperClick
	} = props

	return (
		<styled.Container>
			<Button
				label={"Show Mapper"}
				type={"button"}
				onClick={onShowMapperClick}
			/>

			<Button
				type={"button"}
				label={"close"}
				onClick={onCloseClick}
			/>
		</styled.Container>
	);
};

StatusListFooter.propTypes = {
	
};

export default StatusListFooter;
