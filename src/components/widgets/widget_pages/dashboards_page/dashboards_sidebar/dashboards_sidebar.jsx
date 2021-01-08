import React, { useContext, useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { DraggableCore } from "react-draggable";
import { Container } from 'react-smooth-dnd'

import * as style from "./dashboards_sidebar.style"
import { ThemeContext } from "styled-components";

// components
import DashboardSidebarButton from "./dashboard_sidebar_button/dashboard_sidebar_button";
import TaskAddedAlert from "../dashboard_screen/task_added_alert/task_added_alert";

// Helpers
import { handleAvailableTasks } from "../../../../../methods/utils/dashboards_utils";

// Import Utils
import { ADD_TASK_ALERT_TYPE } from "../../../../../constants/dashboard_contants";
import uuid from 'uuid'

// Import Actions
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'

import log from '../../../../../logger'
import WidgetButton from "../../../../basic/widget_button/widget_button";

const logger = log.getLogger("Dashboards")

const tempColors = ['#FF4B4B', '#56d5f5', '#50de76', '#f2ae41', '#c7a0fa']

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
        showSideBar,
        stationID,
        clickable,
        dashboardId
    } = props


    /*
    * Tests sidebar width to  determine if styling should be for small or large width
    * Returns true if width is less than breakpoint, and false otherwise
    * */
    const testSize = (width) => {
        return width < 500
    }

    /*
    * ref for scrollable list containing buttons
    * */
    const listRef = useRef(null);

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
    const stations = useSelector(state => state.locationsReducer.stations)
    const code409 = useSelector(state => { return state.taskQueueReducer.error })

    const kickOffEnabledInfo = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards[dashboardId] })
    const kickOffEnabled = kickOffEnabledInfo && Array.isArray(kickOffEnabledInfo) && kickOffEnabledInfo.length > 0

    const finishEnabledProcesses = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardId] })
    const finsihedEnabled = finishEnabledProcesses && Array.isArray(finishEnabledProcesses) && finishEnabledProcesses.length > 0

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
        const postPromise = dispatch(postTaskQueue({ _id: uuid.v4(),"task_id": Id }))
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

    const station = stations[stationID]

    var availableTasks = []
    try {
        availableTasks = handleAvailableTasks(tasks, station)
    }
    catch (e) {
        logger.log("availableTasks availableTasks", availableTasks)
        logger.log("availableTasks e", e)
    }

    const getRouteButtons = () => {
        return availableTasks.map((task, index) => {
            return {
                name: task.name,
                color: tempColors[index % tempColors.length],
                type: TYPES.ROUTES.key,
                task_id: task._id,
                id: task._id,
            }
        })
    }

    const getReportButtons = () => {
        return Object.entries(OPERATION_TYPES).filter((currEntry, ind) => {
            const currKey = currEntry[0]

            if(currKey === null) return true // allows old routes that were created without a type to still be rendered

            if(currKey === null) return true // allows old routes that were created without a type to still be rendered

            if(currKey === OPERATION_TYPES.REPORT.key) return true

            if((currKey === OPERATION_TYPES.KICK_OFF.key) && kickOffEnabled) return true

            if((currKey === OPERATION_TYPES.FINISH.key) && finsihedEnabled) return true

        }).map((currEntry, ind) => {

            const currValue = currEntry[1]
            const currKey = currEntry[0]

            return {
                name: currValue.name,
                color: themeContext.schema[currValue.schema].solid,
                id: currValue._id,
                type: currKey,
            }
        })
    }

    var availableButtons = []
    var availableReportButtons = []

    switch(type) {
        case TYPES.ROUTES.key:
            availableButtons = getRouteButtons()
            break
        case TYPES.OPERATIONS.key:
            availableReportButtons = getReportButtons()
            break

        // case TYPES.ALL.name:
        //     availableButtons = getRouteButtons()
        //     availableReportButtons = getReportButtons()
        //     break

        default:
            break
    }

    function handleDrag(e, ui) {
        setWidth(Math.max(minWidth, width + ui.deltaX))
        setSmall(testSize(Math.max(minWidth, width + ui.deltaX)))  // check if width is less than styling breakpoint and update isSmall
    }

    const renderTypeButtons = () => {
        return(
            Object.entries(TYPES).map((currEntry, index) => {
                const currKey = currEntry[0]
                const currValue = currEntry[1]
                return (
                    <WidgetButton
                        containerStyle={{marginRight: "1rem"}}
                        label={currValue.name}
                        color={themeContext.schema[currKey.toLocaleLowerCase()].solid}
                        iconClassName={currValue.iconName}
                        selected={type === currKey}
                        onClick={()=>setType(currKey)}
                        labelSize={"0.5rem"}

                    />
                )
            })
        )
    }

    return (
        <style.SidebarWrapper onClick={() => setAddTaskAlert(null)}>
            <style.SidebarContent
                key="sidebar-content"
                style={{ width: width }}
            >
                <style.Container>
                    <style.ListContainer>
                        <Container
                            groupName="dashboard-buttons"
                            getChildPayload={index =>
                                availableButtons[index]
                            }
                        >
                            {availableButtons.map((button, index) => {

                                // If the button has an associated task and the device is humn, then do not render button
                                // This means there's an associated device task, and that task should be the only one displayed
                                if(!!tasks[button.task_id].associated_task && tasks[button.task_id].device_type === 'human') return null

                                return (
                                    <DashboardSidebarButton
                                        key={`dashboard-sidebar-button-${button.id}`}
                                        name={button.name}
                                        color={button.color}
                                        task_id={button.task_id}
                                        id={button.id}
                                        clickable={clickable}
                                        onTaskClick={handleTaskClick}
                                        disabled={!!addTaskAlert}
                                    />
                                )
                            })}
                        </Container>
                        <Container
                            groupName="dashboard-buttons"
                            getChildPayload={index =>
                                availableReportButtons[index]
                            }
                        >
                            {availableReportButtons.map((button, index) => {
                                return (
                                    <DashboardSidebarButton
                                        key={`dashboard-sidebar-button-${button.id}`}
                                        name={button.name}
                                        color={button.color}
                                        id={button.id}
                                        clickable={clickable}
                                        onTaskClick={handleReportClick}
                                        disabled={!!addTaskAlert}
                                    />
                                )
                            })}
                        </Container>
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

export default DashboardsSidebar
