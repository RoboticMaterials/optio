import React, {useCallback} from 'react'

// components external
import {Draggable} from "react-smooth-dnd"

// components internal
import ReportButtonContainer from "../report_button/report_button_container"

// constants
import {DRAGGING_GHOST_HIDDEN} from "../../../../../../../constants/class_name_constants"

// functions external
import PropTypes from 'prop-types'
import ReportButton from "../report_button/report_button";

const ReportModalButtons = ((props) => {
	const {
		buttonsIds,
		dragging,
		onClick,
		reportButtons,
		editing
	} = props

	const renderButtons = useCallback(
		() => {
			console.log("renderButtons reportButtons",reportButtons)
			return reportButtons.map((button, index) => {
				const {
					_id: buttonId,
					description = "",
					label = "",
					iconClassName = "",
					color = "",
				} = button || {}


				const isDragging = dragging === button

				if(editing) {
					return (
						<Draggable key={buttonId} className={isDragging ? DRAGGING_GHOST_HIDDEN : null} index={index}>
							<ReportButton
								editing={true}
								id={buttonId}
								label={label}
								iconClassName={iconClassName}
								color={color}
								description={description}
								onClick={() => onClick(button)}
							/>
						</Draggable>
					)
				}

				else {
					return (
						<ReportButton
							id={buttonId}
							label={label}
							iconClassName={iconClassName}
							color={color}
							description={description}
							onClick={() => onClick(button)}
						/>
					)
				}
			})
		},
		[reportButtons, dragging, onClick],
	);

	return renderButtons()

})

ReportModalButtons.propTypes = {
	buttonsIds: PropTypes.array,
	dragging: PropTypes.string,
	onClick: PropTypes.func,
	report_buttons: PropTypes.array,
	editing: PropTypes.bool,
}

ReportModalButtons.defaultProps = {
	buttonsIds: [],
	dragging: "",
	onClick: () => {},
	report_buttons: [],
	editing: false
}

export default React.memo(ReportModalButtons)
