import React, { useContext, useEffect, useRef, useState } from 'react';

// external functions
import { useDispatch, useSelector } from 'react-redux';
import { DraggableCore } from "react-draggable";
import { Container } from 'react-smooth-dnd'
import uuid from 'uuid'

// components
import DashboardSidebarButton from "./dashboard_sidebar_button/dashboard_sidebar_button";
import TaskAddedAlert from "../dashboard_screen/task_added_alert/task_added_alert";
import WidgetButton from "../../../../basic/widget_button/widget_button";

// constants
import { ADD_TASK_ALERT_TYPE, DASHBOARD_BUTTON_COLORS } from "../../../../../constants/dashboard_contants";

// utils
import {
    getDashboardContainsOperationButton,
    getDashboardContainsRouteButton,
    getIsFinishEnabled,
    getIsKickoffEnabled,
    handleAvailableTasks
} from "../../../../../methods/utils/dashboards_utils";

// Import Actions
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'

// styles
import * as style from "./dashboards_sidebar.style"
import { ThemeContext } from "styled-components";

// logging
import log from '../../../../../logger'
import PropTypes from "prop-types";
import CardEditor from "../../../../side_bar/content/cards/card_editor/card_editor";
const logger = log.getLogger("Dashboards")

export const OPERATION_TYPES = {
    REPORT: {
        schema: "error",
        name: "Report",
        key: "REPORT",
        _id: 0
    },
    KICK_OFF: {
        schema: "kick_off",
        key: "KICK_OFF",
        name: "Kick off",
        _id: 1
    },
    FINISH: {
        schema: "finish",
        key: "FINISH",
        name: "Finish",
        _id: 2
    }
}

export const TYPES = {
    // ALL: {
    //     name: "ALL",
    //     iconName: "fal fa-globe"
    // },
    ROUTES: {
        name: "Routes",
        iconName: "fas fa-route",
        key: "ROUTES"
    },
    OPERATIONS: {
        name: "Operations",
        iconName: "fas fa-sticky-note",
        key: "OPERATIONS"
    }
}

const DashboardsSidebar = (props) => {

    const {
        width,
        setWidth,
        minWidth,
        stationID,
        clickable,
        dashboardId,
        existingButtons
    } = props

    /*
    * Tests sidebar width to  determine if styling should be for small or large width
    * Returns true if width is less than breakpoint, and false otherwise
    * */
    const testSize = (width) => {
        return width < 500
    }

    // theme
    const themeContext = useContext(ThemeContext);

    /*
    * boolean value for storing width state
    * isSmall is true if width is less than breakpoint and false otherwise
    * */
    const [isSmall, setSmall] = useState(testSize(width)); // used for tracking sidebar dimensions

    const [type, setType] = useState(TYPES.ROUTES.key); // used for tracking sidebar dimensions

    // redux state
    const dispatch = useDispatch()
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.stationsReducer.stations)
    const code409 = useSelector(state => { return state.taskQueueReducer.error })
    const devices = useSelector(state => state.devicesReducer.devices)
    const dashboard = useSelector(state => { return state.dashboardsReducer.dashboards[dashboardId] }) || {}

    const availableKickOffProcesses = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards[dashboardId] })
    const availableFinishProcesses = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardId] })

    const [finishEnabled, setFinishEnabled] = useState(getIsFinishEnabled(availableFinishProcesses))
    const [kickOffEnabled, setKickOffEnabled] = useState(getIsKickoffEnabled(availableKickOffProcesses))

    const [availableTasks, setAvailableTasks] = useState([])
    const [availableButtons, setAvailableButtons] = useState([])
    const [availableReportButtons, setAvailableReportButtons] = useState([])

    useEffect(() => {
        setFinishEnabled(getIsFinishEnabled(availableFinishProcesses))
    }, [availableFinishProcesses])

    useEffect(() => {
        setKickOffEnabled(getIsKickoffEnabled(availableKickOffProcesses))
    }, [availableKickOffProcesses])

    // self contained state
    const [addTaskAlert, setAddTaskAlert] = useState(null)

    const handleTaskClick = (Id) => {
        const clickedTask = tasks[Id]
        const name = clickedTask?.name

        // add alert to notify task has been added
        setAddTaskAlert({
            type: ADD_TASK_ALERT_TYPE.ADDING,
            message: "Adding to Queue..."
        })

        // dispatch action to add task to queue
        const postPromise = dispatch(postTaskQueue({ _id: uuid.v4(), "task_id": Id }))
        postPromise.then(() => {
            try {
                // code409 is returned if task is already in the queue
                if (code409.response.data.status === 409) {
                    // display alert notifying user that task is already in queue
                    setAddTaskAlert({
                        type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                        label: "Alert! Task Already in Queue",
                        message: "'" + name + "' not added"
                    })
                }

            } catch {
                // display alert notifying user that task was successfully added
                setAddTaskAlert({
                    type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                    label: "Task Added to Queue",
                    message: name
                })
            }

            // clear alert after timeout
            setTimeout(() => setAddTaskAlert(null), 1800)
        })
    }

    const handleReportClick = (Id) => {

    }

    useEffect(() => {
        const station = !!stations[stationID] ? stations[stationID] : devices[stationID]

        var availableTasks = []
        try {
            availableTasks = handleAvailableTasks(tasks, station)
        }
        catch (e) {
            logger.error("availableTasks availableTasks", availableTasks)
            logger.error("availableTasks e", e)
        }
        setAvailableTasks(availableTasks)

    }, [stationID, stations, devices, tasks])

    const getRouteButtons = () => {
        return availableTasks
            .map((task, index) => {
                // If custom task, it has some different fields that need to be passed along
                if (!!task.custom_task) {
                    return {
                        name: task.name,
                        color: task.color,
                        type: TYPES.ROUTES.key,
                        task_id: task.task_id,
                        id: task.id,
                        custom_task: task.custom_task,
                        deviceType: task.deviceType,

                    }
                }
                else {
                    return {
                        name: task.name,
                        color: DASHBOARD_BUTTON_COLORS[index % DASHBOARD_BUTTON_COLORS.length].hex,
                        type: TYPES.ROUTES.key,
                        task_id: task._id,
                        id: task._id,
                    }
                }

            })
    }

    const getReportButtons = () => {
        return Object.entries(OPERATION_TYPES).filter((currEntry, ind) => {
            const currKey = currEntry[0]

            if (currKey === null) return true // allows old routes that were created without a type to still be rendered

            if (currKey === OPERATION_TYPES.REPORT.key) return true

            if ((currKey === OPERATION_TYPES.KICK_OFF.key) && kickOffEnabled) return true

            if ((currKey === OPERATION_TYPES.FINISH.key) && finishEnabled) return true

        }).map((currEntry, ind) => {

            const currValue = currEntry[1]
            const currKey = currEntry[0]

            return {
                name: currValue.name,
                color: DASHBOARD_BUTTON_COLORS[ind % DASHBOARD_BUTTON_COLORS.length].hex,
                // themeContext.schema[currValue.schema].solid,
                id: currValue._id,
                type: currKey,
            }
        })
    }

    useEffect(() => {
        setAvailableButtons(getRouteButtons())
    }, [availableTasks])

    useEffect(() => {
        setAvailableReportButtons(getReportButtons())
    }, [OPERATION_TYPES])


    function handleDrag(e, ui) {
        setWidth(Math.max(minWidth, width + ui.deltaX))
        setSmall(testSize(Math.max(minWidth, width + ui.deltaX)))  // check if width is less than styling breakpoint and update isSmall
    }

    const renderTypeButtons = () => {
        return (
            Object.entries(TYPES).map((currEntry, index) => {
                const currKey = currEntry[0]
                const currValue = currEntry[1]
                return (
                    <WidgetButton
                        containerStyle={{ marginRight: "1rem" }}
                        label={currValue.name}
                        color={themeContext.schema[currKey.toLocaleLowerCase()].solid}
                        iconClassName={currValue.iconName}
                        selected={type === currKey}
                        onClick={() => setType(currKey)}
                        labelSize={"0.5rem"}

                    />
                )
            })
        )
    }

    return (
        <style.SidebarWrapper
            onClick={() => setAddTaskAlert(null)}
        >
            <style.SidebarContent
                key="sidebar-content"
                style={{ width: width }}
            >
                <style.Container>
                    <style.ListContainer>
                        {(type === TYPES.ROUTES.key) &&

                        <Container
                            groupName="dashboard-buttons"
                            getChildPayload={index =>
                                availableButtons[index]
                            }
                        >
                            {availableButtons.map((currButton, index) => {

                                const {
                                    name: currButtonName,
                                    color: currButtonColor,
                                    task_id: currButtonTaskId,
                                    id: currButtonId,
                                    type: currButtonType
                                } = currButton || {}

                                const dashboardContainsTask = getDashboardContainsRouteButton({buttons: existingButtons}, {task_id: currButtonTaskId})
                                return (
                                    <DashboardSidebarButton
                                        key={`dashboard-sidebar-button-${currButtonId}`}
                                        name={currButtonName}
                                        color={currButtonColor}
                                        task_id={currButtonTaskId}
                                        id={currButtonId}
                                        clickable={clickable}
                                        onTaskClick={handleTaskClick}
                                        disabled={(!!addTaskAlert) || dashboardContainsTask}
                                        dragDisabled={dashboardContainsTask}
                                    />
                                )
                            })}
                        </Container>
                        }

                        {(type === TYPES.OPERATIONS.key) &&
                        <Container
                            groupName="dashboard-buttons"
                            getChildPayload={index =>
                                availableReportButtons[index]
                            }
                        >
                            {availableReportButtons.map((button, index) => {
                                const {
                                    name: currButtonName,
                                    color: currButtonColor,
                                    id: currButtonId,
                                    type: currButtonType
                                } = button || {}

                                const dashboardContainsButton = getDashboardContainsOperationButton({buttons: existingButtons}, {type: currButtonType})

                                return (
                                    <DashboardSidebarButton
                                        key={`dashboard-sidebar-button-${currButtonId}`}
                                        name={currButtonName}
                                        color={currButtonColor}
                                        id={currButtonId}
                                        clickable={clickable}
                                        onTaskClick={handleReportClick}
                                        disabled={!!addTaskAlert || dashboardContainsButton}
                                        dragDisabled={dashboardContainsButton}
                                    />
                                )
                            })}
                        </Container>
                        }
                    </style.ListContainer>

                    <style.FooterContainer>
                        {renderTypeButtons()}
                    </style.FooterContainer>
                </style.Container>

                <DraggableCore key="handle" onDrag={handleDrag} >
                    <style.ResizeBar>
                        <style.ResizeHandle></style.ResizeHandle>
                    </style.ResizeBar>
                </DraggableCore>
            </style.SidebarContent>

            <TaskAddedAlert
                {...addTaskAlert}
                visible={!!addTaskAlert}
            />
        </style.SidebarWrapper>
    )
}

// Specifies propTypes
DashboardsSidebar.propTypes = {
    existingButtons: PropTypes.arrayOf(
        PropTypes.object
    )
}

// Specifies the default values for props:
DashboardsSidebar.defaultProps = {
    existingButtons: []
}

export default DashboardsSidebar
