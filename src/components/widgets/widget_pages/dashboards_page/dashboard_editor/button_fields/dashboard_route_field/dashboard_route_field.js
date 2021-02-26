import React, {useContext, useState} from 'react';
import { useSelector } from 'react-redux'

// Import  Components
import TextField from "../../../../../../basic/form/text_field/text_field";
import DeleteFieldButton from "../../../../../../basic/form/delete_field_button/delete_field_button";
import ColorField from "../../../../../../basic/form/color_field/color_field";

// Import Styles
import * as styled from './dashboard_route_field.style';
import * as buttonFieldStyles from "../button_fields.style";
import {ThemeContext} from "styled-components";

// import logging
import log from '../../../../../../../logger'
import {DASHBOARD_BUTTON_COLORS} from "../../../../../../../constants/dashboard_contants";
const logger = log.getLogger("Dashboards", "EditDashboard");


const DashboardRouteField = props => {

	// extract props
	const {
		ind,
		taskId,
		color,
		deletable
	} = props

	const themeContext = useContext(ThemeContext);

	const tasks = useSelector(state => state.tasksReducer.tasks)
	const taskName = tasks[taskId]?.name || "TASK NOT FOUND"

	const schema = themeContext.schema.routes
	const iconClassName = schema.iconName


	return(
		// set zindex to make sure the dropdown from buttons above display on top of the buttons below it
		<buttonFieldStyles.Container style={{position: 'relative', zIndex: `${100-ind}`}}>
			<buttonFieldStyles.DashboardEditButton color={color} >

				<ColorField
					name={`buttons[${ind}].color`}
					Container={buttonFieldStyles.ColorDropdownInnerContainer}
					type={"button"}
					colors={DASHBOARD_BUTTON_COLORS}
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

				{deletable &&
				<DeleteFieldButton
					name={`buttons`}
					index={ind}
					type={"button"}
					ButtonComponent={buttonFieldStyles.DeleteButton}
					ViewComponent={buttonFieldStyles.DeleteButtonIcon}
					fontSize={"large"}
				/>
				}
			</buttonFieldStyles.RightContentContainer>
		</buttonFieldStyles.Container>

	)

}

export default (DashboardRouteField)
