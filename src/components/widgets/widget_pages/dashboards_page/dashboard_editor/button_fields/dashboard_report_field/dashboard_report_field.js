import React, {useContext, useState} from 'react';
import { useSelector } from 'react-redux'

// import external functions
import { Container, Draggable } from 'react-smooth-dnd';

// Import  Components
import Textbox from "../../../../../../basic/textbox/textbox";
import TextField from "../../../../../../basic/form/text_field/text_field";
import DeleteFieldButton from "../../../../../../basic/form/delete_field_button/delete_field_button";
import DashboardButton from "../../../dashboard_button/dashboard_button";
import ColorField from "../../../../../../basic/form/color_field/color_field";

// Import Styles
import * as styled from './dashboard_report_field.style';

// import logging
import log from '../../../../../../../logger'
import {ThemeContext} from "styled-components";
import BounceButton from "../../../../../../basic/bounce_button/bounce_button";
import {REPORT_TYPES} from "../../../dashboards_sidebar/dashboards_sidebar";
import {theme} from "../../../../../../../theme";
import * as buttonFieldStyles from "../button_fields.style";
const logger = log.getLogger("Dashboards", "EditDashboard");


const DashboardReportField = props => {

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
	console.log("DashboardReportField button", button)
	const taskName = REPORT_TYPES[button.type].name

	const schema = theme.main.schema.user_reports
	const iconClassName = schema.iconName

		// tasks[button.task_id]?.name || "TASK NOT FOUND"

	return(
		// set zindex to make sure the dropdown from buttons above display on top of the buttons below it
		<buttonFieldStyles.Container>
		<buttonFieldStyles.DashboardEditButton color={button.color} style={{position: 'relative', zIndex: `${100-ind}`}}>

			<ColorField
				name={`buttons[${ind}].color`}
				Container={buttonFieldStyles.ColorDropdownInnerContainer}
				type={"button"}
			/>

			<buttonFieldStyles.CenterContainer>
				<TextField
					name={`buttons[${ind}].name`}
					InputComponent={buttonFieldStyles.TransparentTextBox}
					styled={{textAlign: 'center'}}
					type='text'
					label={null}
				/>
				<buttonFieldStyles.TaskName>{taskName}</buttonFieldStyles.TaskName>
			</buttonFieldStyles.CenterContainer>


		</buttonFieldStyles.DashboardEditButton>

			<buttonFieldStyles.RightContentContainer>
				<buttonFieldStyles.SchemaIcon className={iconClassName} color={schema.solid}></buttonFieldStyles.SchemaIcon>

				<DeleteFieldButton
					name={`buttons`}
					index={ind}
					type={"button"}
					ButtonComponent={buttonFieldStyles.DeleteButton}
					ViewComponent={buttonFieldStyles.DeleteButtonIcon}
					fontSize={"large"}
				/>
			</buttonFieldStyles.RightContentContainer>
		</buttonFieldStyles.Container>

	)

}

export default (DashboardReportField)
