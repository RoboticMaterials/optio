import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list.style"
import StatusListBody from "./status_list_body/status_list_body";
import StatusListHeader from "./status_list_header/status_list_header";
import StatusListItem from "./status_list_item/status_list_item";
import StatusListFooter from "./status_list_footer/status_list_footer";
const StatusList = (props) => {

	const {
		data
	} = props

	return (
		<styled.Container>
			<StatusListHeader

			/>

			<StatusListBody
				data={data}
			/>

			<StatusListFooter

			/>
		</styled.Container>
	);
};

StatusList.propTypes = {

};

export default StatusList;
