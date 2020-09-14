import React, {useContext, useState} from 'react';
import { useSelector } from 'react-redux'

// import external functions
import { Container, Draggable } from 'react-smooth-dnd';

// Import  Components
import Textbox from "../../../../../basic/textbox/textbox";
import TextField from "../../../../../basic/form/text_field/text_field";
import DeleteFieldButton from "../../../../../basic/form/delete_field_button/delete_field_button";
import DashboardButton from "../../dashboard_button/dashboard_button";
import ColorField from "../../../../../basic/form/color_field/color_field";

// Import Styles
import * as styled from './dashboard_edit_tasks_field.style';

// import logging
import log from '../../../../../../logger'
import {ThemeContext} from "styled-components";
import BounceButton from "../../../../../basic/bounce_button/bounce_button";
const logger = log.getLogger("Dashboards", "EditDashboard");


const DashboardEditTasksField = props => {

	// extract props
	const {
		button,
		ind,
	} = props

	console.log(button)

	// theme
	// const themeContext = useContext(ThemeContext);

	const [showColorPicker, setShowColorPicker] = useState(false);
	const tasks = useSelector(state => state.tasksReducer.tasks)

	return(
		// set zindex to make sure the dropdown from buttons above display on top of the buttons below it
		<styled.DashboardEditButton color={button.color} style={{position: 'relative', zIndex: `${100-ind}`}}> 

			<ColorField
				name={`buttons[${ind}].color`}
				Container={styled.ColorDropdownInnerContainer}
				type={"button"}
			/>

			<styled.CenterContainer>
				<TextField
					name={`buttons[${ind}].name`}
					InputComponent={styled.TransparentTextBox}
					styled={{textAlign: 'center'}}
					type='text'
					label={null}
				/>
				<styled.TaskName>{tasks[button.task_id].name}</styled.TaskName>
			</styled.CenterContainer>

			<DeleteFieldButton
				name={`buttons`}
				index={ind}
				type={"button"}
				ButtonComponent={styled.DeleteButton}
				ViewComponent={styled.DeleteButtonIcon}
				fontSize={"large"}
			/>

		</styled.DashboardEditButton>

	)

}

export default (DashboardEditTasksField)
