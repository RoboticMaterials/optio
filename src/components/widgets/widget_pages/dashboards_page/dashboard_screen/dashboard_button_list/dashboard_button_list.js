import React, { useRef, useEffect, useState } from 'react';

// import external components
import ReactList from 'react-list';

// import internal components
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// style
import * as style from "./dashboard_button_list.style"

// redux
import { useSelector, useDispatch } from "react-redux";
import { getTasks } from '../../../../../../redux/actions/tasks_actions'

// logging
import log from "../../../../../../logger"
import { deepCopy } from "../../../../../../methods/utils/utils";
import { OPERATION_TYPES, TYPES } from "../../dashboards_sidebar/dashboards_sidebar";
import { theme } from "../../../../../../theme";
import DashboardSplitButton from "../../dashboard_buttons/dashboard_split_button/dashboard_split_button";
import {getCanDeleteDashboardButton} from "../../../../../../methods/utils/dashboards_utils";
const logger = log.getLogger("Dashboards")


/*
*  Renders list of buttons for a Dashboard
* */
const DashboardButtonList = ((props) => {

    const dispatch = useDispatch()

    const dispatchGetTasks = () => dispatch(getTasks())

    const { buttons, addedTaskAlert, onTaskClick } = props

    // ref for list of buttons
    const listRef = useRef(null);

    // redux state
    const tasks = useSelector(state => state.tasksReducer.tasks)

    useEffect(() => {
        dispatchGetTasks()
    }, [])

    // renders individuals buttons for list
    const itemRenderer = (index, key) => {

        const currentButton = buttons[index]

        let broken = false

        const type = currentButton?.type
        const taskID = currentButton.task_id
        const task = tasks[taskID]
        const {
            name: taskName = ""
        } = task || {}

        const name = currentButton.name

        const displayName = name ? name :
            (type === TYPES.ROUTES.key) ? taskName
                :
                (Object.keys(OPERATION_TYPES).includes(type)) ? OPERATION_TYPES[type].name
                    :
                    "Unnamed"

        console.log("type", type)
        // const associatedTaskId = task?.associated_task
        const deviceTypes = task?.device_types || []

        // If the task is in tasks or it's a custom task or hil success, then it exists
        const taskExists = !!tasks[taskID] ? true : taskID === 'custom_task' ? true : taskID === 'hil_success' ? true : false

        var disabled
        var error
        var onClick

        const handleRouteClick = () => {
            disabled = addedTaskAlert || currentButton.deleted || broken || !taskExists
            error = !taskExists ? "This buttons task has been deleted." : null
            onClick = (associatedTaskIdArg, deviceType) => {
                if (taskID === 'custom_task' || taskID === 'hil_success') {
                    onTaskClick(TYPES.ROUTES.key, associatedTaskIdArg, name, currentButton.custom_task, !!deviceType ? deviceType : currentButton.deviceType)
                } else {
                    onTaskClick(TYPES.ROUTES.key, associatedTaskIdArg, name, null, deviceType)
                }
            }
        }
        switch (type) {
            case TYPES.ROUTES.key:
                handleRouteClick()
                break

            case OPERATION_TYPES.REPORT.key:
                disabled = addedTaskAlert || currentButton.deleted || broken
                error = null
                onClick = () => {
                    onTaskClick(OPERATION_TYPES.REPORT.key, currentButton.key)
                }
                break

            case OPERATION_TYPES.FINISH.key:
                disabled = addedTaskAlert || currentButton.deleted || broken
                error = null
                onClick = () => {
                    onTaskClick(OPERATION_TYPES.FINISH.key, currentButton.key)
                }
                break

            case OPERATION_TYPES.KICK_OFF.key:
                error = null
                onClick = () => {
                    onTaskClick(type)
                }
                break

            default:
                handleRouteClick()
                break
        }

        var schema
        var iconClassName = ""
        var iconColor

        if (type && (typeof type === 'string' || type instanceof String)) {
            schema = theme.main.schema[type.toLowerCase()]
            iconClassName = schema?.iconName
            iconColor = schema?.solid
        }

        if (deviceTypes.length > 1) return (
            <DashboardSplitButton
                title={displayName}
                iconColor={"black"}
                iconClassName={iconClassName}
                key={index}
                type={type}
                onClick={onClick}
                containerStyle={{ }}
                hoverable={false}
                taskID={taskID}
                color={currentButton.color}
                disabled={disabled}
                containerCss={style.ButtonContainerCss}
                error={error}
            >
            </DashboardSplitButton>
        )

        return (
            <DashboardButton
                deviceType={deviceTypes[0]}
                title={displayName}
                iconColor={iconColor}
                iconClassName={iconClassName}
                key={index}
                type={type}
                onClick={onClick}
                containerStyle={{  }}
                hoverable={false}
                taskID={taskID}
                color={currentButton.color}
                disabled={disabled}
                containerCss={style.ButtonContainerCss}
                error={error}
            />
        )
    }

    return (
        <style.Container>
            <ReactList
                ref={listRef}
                itemRenderer={itemRenderer}
                length={buttons.length}
                type='uniform'
                itemsRenderer={(items, ref) => {
                    return (
                        <style.ListContainer ref={ref}>
                            {items}
                        </style.ListContainer>

                    )
                }}
            />
        </style.Container>
    )
})

export default DashboardButtonList
