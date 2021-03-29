import React, {useContext, useState} from 'react';

// Components
import TextField from "../../../../../../basic/form/text_field/text_field";
import DeleteFieldButton from "../../../../../../basic/form/delete_field_button/delete_field_button";
import ColorField from "../../../../../../basic/form/color_field/color_field";

// constants
import {OPERATION_TYPES} from "../../../dashboards_sidebar/dashboards_sidebar";
import {DASHBOARD_BUTTON_COLORS} from "../../../../../../../constants/dashboard_contants";

// styles
import * as buttonFieldStyles from "../button_fields.style";
import {theme} from "../../../../../../../theme";

// logging
import log from '../../../../../../../logger'

const logger = log.getLogger("Dashboards", "EditDashboard");

const DashboardReportField = props => {

	// extract props
	const {
		ind,
		type,
		color,
		deletable
	} = props

	const taskName = OPERATION_TYPES[type].name

	const schema = theme.main.schema[type.toLowerCase()]
	const iconClassName = schema.iconName

	return(
		// set zindex to make sure the dropdown from buttons above display on top of the buttons below it
		<buttonFieldStyles.Container style={{position: 'relative', zIndex: `${100-ind}`}}>
			<buttonFieldStyles.DashboardEditButton color={color}>
				<ColorField
					name={`buttons[${ind}].color`}
					Container={buttonFieldStyles.ColorDropdownInnerContainer}
					type={"button"}
					colors={DASHBOARD_BUTTON_COLORS}
				/>

				<buttonFieldStyles.CenterContainer>
					<TextField
						name={`buttons[${ind}].name`}
                        placeholder='Enter New Button Name'
						InputComponent={buttonFieldStyles.TransparentTextBox}
						styled={{textAlign: 'center'}}
						type='text'
						label={null}
					/>
					<buttonFieldStyles.TaskName>{taskName}</buttonFieldStyles.TaskName>
				</buttonFieldStyles.CenterContainer>
			</buttonFieldStyles.DashboardEditButton>

			<buttonFieldStyles.RightContentContainer>
				<buttonFieldStyles.SchemaIcon className={iconClassName} color={color ? color : schema.color} ></buttonFieldStyles.SchemaIcon>

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

export default DashboardReportField
