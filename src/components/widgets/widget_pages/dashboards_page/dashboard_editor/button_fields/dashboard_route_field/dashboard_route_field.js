import React, {useContext, useEffect, useState} from 'react';
import { useSelector } from 'react-redux'

// Import  Components
import TextField from "../../../../../../basic/form/text_field/text_field";
import DeleteFieldButton from "../../../../../../basic/form/delete_field_button/delete_field_button";
import ColorField from "../../../../../../basic/form/color_field/color_field";

// Import Styles
import * as styled from './dashboard_route_field.style';
import * as buttonFieldStyles from "../button_fields.style";
import { ThemeContext } from "styled-components";

// import logging
import log from '../../../../../../../logger'
import { DASHBOARD_BUTTON_COLORS } from "../../../../../../../constants/dashboard_contants";
import {
    CUSTOM_CHARGE_TASK_ID,
    CUSTOM_IDLE_TASK_ID,
    CUSTOM_IDLE_TASK_NAME,
    CUSTOM_TASK_ID
} from "../../../../../../../constants/route_constants";
import {getPositionAttributes} from "../../../../../../../methods/utils/stations_utils";
const logger = log.getLogger("Dashboards", "EditDashboard");

const DEFAULT_DISPLAY_NAME = "TASK NOT FOUND"

const DashboardRouteField = props => {

    // extract props
    const {
        ind,
        taskId,
        color,
        deletable,
        buttonId,
        customTask
    } = props

    // destructure props
    const {
        position: positionId = ""
    } = customTask || {}

    // theme
    const themeContext = useContext(ThemeContext);

    // redux state
    const tasks = useSelector(state => state.tasksReducer.tasks)

    // component state
    const [displayName, setDisplayName] = useState(DEFAULT_DISPLAY_NAME)

    useEffect(() => {
        if(taskId === CUSTOM_TASK_ID) {
            if(buttonId === CUSTOM_IDLE_TASK_ID) {
                setDisplayName(CUSTOM_IDLE_TASK_NAME || DEFAULT_DISPLAY_NAME)
            }
            else if(buttonId === CUSTOM_CHARGE_TASK_ID) {
                const {
                    name: positionName = ""
                } = getPositionAttributes(positionId, ["name"]) || {}
                setDisplayName(positionName || DEFAULT_DISPLAY_NAME)
            }
        }
        else {
            const task = tasks[taskId]
            const {
                name
            } = task || {}

            setDisplayName(name || DEFAULT_DISPLAY_NAME)
        }

        return () => {
        }

    }, [taskId, tasks, positionId, buttonId]);

    const schema = themeContext.schema.routes
    const iconClassName = schema.iconName

    return (
        // set zindex to make sure the dropdown from buttons above display on top of the buttons below it
        <buttonFieldStyles.Container style={{ position: 'relative', zIndex: `${100 - ind}` }}>
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
                        placeholder='Enter New Button Name'
                        InputComponent={buttonFieldStyles.TransparentTextBox}
                        styled={{ textAlign: 'center' }}
                        type='text'
                        label={null}
                    />
                    <buttonFieldStyles.TaskName>{displayName}</buttonFieldStyles.TaskName>
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
