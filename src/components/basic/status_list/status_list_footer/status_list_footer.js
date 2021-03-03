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
			{/*<Button*/}
			{/*	label={"Show Mapper"}*/}
			{/*	type={"button"}*/}
			{/*	onClick={onShowMapperClick}*/}
			{/*/>*/}
			<Button
				type={"button"}
				label={"Create All"}
				onClick={onCreateAllClick}
				// onClick={onCloseClick}
			/>

			<Button
				type={"button"}
				label={"Cancel"}
				onClick={onCanceleClick}
			/>
			{/*<Button*/}
			{/*	type={"button"}*/}
			{/*	label={"Close"}*/}
			{/*	onClick={onCloseClick}*/}
			{/*/>*/}
		</styled.Container>
	);
};

StatusListFooter.propTypes = {
	
};

export default StatusListFooter;
