import React, {useCallback} from 'react'

// components external
import {Draggable} from "react-smooth-dnd"

// components internal
import ReportButtonContainer from "../report_button/report_button_container"

// constants
import {DRAGGING_GHOST_HIDDEN} from "../../../../../../../constants/class_name_constants"

// functions external
import PropTypes from 'prop-types'

const ReportModalEditButtons = ((props) => {
	const {
		buttonsIds,
		dragging,
		onClick,
		report_buttons,
		editing
	} = props

	const renderButtons = useCallback(
		() => {
			return buttonsIds.map((button, index) => {
				const isDragging = dragging === button

				if(editing) {
					return (
						<Draggable key={button} className={isDragging ? DRAGGING_GHOST_HIDDEN : null} index={index}>
							<ReportButtonContainer
								id={button}
								reportButtons={report_buttons}
								className={isDragging ? DRAGGING_GHOST_HIDDEN : null}
								onClick={onClick}
							/>
						</Draggable>
					)
				}

				else {
					return (
						<ReportButtonContainer
							id={button}
							reportButtons={report_buttons}
							className={isDragging ? DRAGGING_GHOST_HIDDEN : null}
							onClick={onClick}
						/>
					)
				}



			})
		},
		[buttonsIds, dragging, onClick, report_buttons],
	);

	return renderButtons()

})

ReportModalEditButtons.propTypes = {
	buttonsIds: PropTypes.array,
	dragging: PropTypes.string,
	onClick: PropTypes.func,
	report_buttons: PropTypes.array,
	editing: PropTypes.bool,
}

ReportModalEditButtons.defaultProps = {
	buttonsIds: [],
	dragging: "",
	onClick: () => {},
	report_buttons: [],
	editing: false
}

export default React.memo(ReportModalEditButtons)
