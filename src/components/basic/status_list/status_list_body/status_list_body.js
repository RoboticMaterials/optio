import React from 'react';
import PropTypes from 'prop-types';

import * as styled from "./status_list_body.style"
import StatusListItem from "../status_list_item/status_list_item";

const StatusListBody = (props) => {

	const {
		data,
		onItemClick,
		onCreateClick,
	} = props

	const renderData = () => {
		return data.map((currDatem, currIndex) => {

			const {
				title,
				errors,
				validationStatus,
				resourceStatus,
				created
			} = currDatem || {}

			const {
				message: validationMessage,
				code: validationCode
			} = validationStatus || {}

			const {
				message: resourceMessage,
				code: resourceCode
			} = resourceStatus || {}



			return(
				<StatusListItem
					onCreateClick={onCreateClick}
					created={created}
					key={currIndex}
					index={currIndex}
					item={currDatem}
					onEditClick={onItemClick}
					title={title}
					errors={errors}
					validationMessage={validationMessage}
					validationCode={validationCode}
					resourceMessage={resourceMessage}
					resourceCode={resourceCode}
				/>
			)
		})
	}
	return (
		<styled.Container>
			<styled.RowTitles>
				{/*<styled.IndexTitle></styled.IndexTitle>*/}
				<styled.NameTitle>Lot Name</styled.NameTitle>
				<styled.StatusMessageTitle>Validation Status</styled.StatusMessageTitle>
				<styled.Filler/>
				<styled.StatusMessageTitle>Creation Status</styled.StatusMessageTitle>


			</styled.RowTitles>

			{renderData()}
		</styled.Container>
	);
};

StatusListBody.propTypes = {

};

export default StatusListBody;
