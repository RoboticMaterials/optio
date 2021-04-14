import React, {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {isObject} from "../../../../../../../methods/utils/object_utils"
import ReportButton from "./report_button"

// wraps ReportButton component for automatically getting props from id
const ReportButtonContainer = (props) => {
	const {
		reportButtons,
		id,
		onClick
	} = props

	const [reportButton, setReportButton] = useState(null)
	const {
		description = "",
		label = "",
		iconClassName = "",
		color = "",
		_id = ""
	} = reportButton || {}

	useEffect(() => {
		setReportButton(reportButtons.find((currItem) => currItem._id === id) || {})
	}, [id])

	const onClickWrapped = useCallback(
		() => {
			onClick(reportButton)
		},
		[reportButton],
	)


	return (
		<ReportButton
			id={_id}
			label={label}
			iconClassName={iconClassName}
			color={color}
			description={description}
			onClick={onClickWrapped}
		/>
	)
}

ReportButtonContainer.propTypes = {
	reportButtons: PropTypes.array,
	id: PropTypes.string,
	onClick: PropTypes.func
}

ReportButtonContainer.defaultTypes = {
	reportButtons: [],
	id: "",
	onClick: () => {}
}

export default React.memo(ReportButtonContainer)
