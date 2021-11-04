import React from 'react'
import PropTypes from 'prop-types'

import StatusListBody from "./status_list_body/status_list_body"
import StatusListHeader from "./status_list_header/status_list_header"
import StatusListFooter from "./status_list_footer/status_list_footer"

import * as styled from "./status_list.style"

const StatusList = (props) => {

	const {
		data,
		onItemClick,
		onCloseClick,
		onCanceleClick,
		onShowMapperClick,
		onCreateClick,
		onMergeClick,
		onCreateAllClick,
		onCreateAllWithoutWarningClick,
		onBack,
		displayNames,
		mergeDisabled,
	} = props

	return (
		<styled.Container>
			<StatusListHeader
				onBack={onBack}
				onCanceleClick={onCanceleClick}
			/>

			<StatusListBody
				displayNames={displayNames}
				onItemClick={onItemClick}
				data={data}
				onCreateClick={onCreateClick}
				onMergeClick = {onMergeClick}
				mergeDisabled = {mergeDisabled}

			/>

			<StatusListFooter
				onCanceleClick={onCanceleClick}
				onCloseClick={onCloseClick}
				onShowMapperClick={onShowMapperClick}
				onCreateAllClick={onCreateAllClick}
				onCreateAllWithoutWarningClick={onCreateAllWithoutWarningClick}
			/>
		</styled.Container>
	)
}

StatusList.propTypes = {

}

export default StatusList
