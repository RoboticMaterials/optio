import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_body.style"
import StatusListItem from "../status_list_item/status_list_item";

const StatusListBody = (props) => {

	const {
		data
	} = props

	const renderData = () => {
		return data.map((currDatem, currIndex) => {
			return(
				<StatusListItem
					title={currIndex}
				/>
			)
		})
	}
	return (
		<styled.Container>
			{renderData()}
		</styled.Container>
	);
};

StatusListBody.propTypes = {

};

export default StatusListBody;
