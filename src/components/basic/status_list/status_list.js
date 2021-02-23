import React from 'react'
import PropTypes from 'prop-types'

import StatusListBody from "./status_list_body/status_list_body"
import StatusListHeader from "./status_list_header/status_list_header"
import StatusListFooter from "./status_list_footer/status_list_footer"

import * as styled from "./status_list.style"

const StatusList = (props) => {

	const {
		data,
		onItemClick
	} = props

	return (
		<styled.Container>
			<StatusListHeader

			/>

			<StatusListBody
				onItemClick={onItemClick}
				data={data}
			/>

			<StatusListFooter

			/>
		</styled.Container>
	)
}

StatusList.propTypes = {

}

export default StatusList
