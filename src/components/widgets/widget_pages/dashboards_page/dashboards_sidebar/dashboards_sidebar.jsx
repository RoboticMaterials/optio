import React, { useContext, useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { DraggableCore } from "react-draggable";
import { Container, Draggable } from 'react-smooth-dnd'

// external component imports
import ReactList from 'react-list';

import * as style from "./dashboards_sidebar.style"
import { ThemeContext } from "styled-components";

// components
import DashboardSidebarButton from "./dashboard_sidebar_button/dashboard_sidebar_button";
import TaskAddedAlert from "../dashboard_screen/task_added_alert/task_added_alert";

// Helpers
import { randomHash } from "../../../../../methods/utils/utils";
import { handleAvailableTasks } from "../../../../../methods/utils/dashboards_utils";

// Import Utils
import { ADD_TASK_ALERT_TYPE } from "../../../../../constants/dashboard_contants";

// Import Actions
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'

import log from '../../../../../logger'
import * as styled from "../../../widget_button/widget_button.style";
// import { Container } from '@material-ui/core';

const logger = log.getLogger("Dashboards")

const tempColors = ['#FF4B4B', '#56d5f5', '#50de76', '#f2ae41', '#c7a0fa']

export const REPORT_TYPES = {
    REPORT: {
        schema: "error",
        name: "Report",
        _id: 0
    },
    KICK_OFF: {
        schema: "scheduler",
        name: "Kick off",
        _id: 1
    }
}

export const TYPES = {
    // ALL: {
    //     name: "ALL",
    //     iconName: "fal fa-globe"
    // },
    ROUTES: {
        name: "ROUTES",
        iconName: "fas fa-route"
    },
    USER_REPORTS: {
        name: "USER_REPORTS",
        iconName: "fas fa-sticky-note"
    }
}

const DashboardsSidebar = (props) => {

    const {
        width,
        setWidth,
        minWidth,
        showSideBar,
        stationID,
        clickable
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

    const [type, setType] = useState(TYPES.ROUTES.name); // used for tracking sidebar dimensions

    // redux state
    const dispatch = useDispatch()
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.locationsReducer.stations)
    const code409 = useSelector(state => { return state.taskQueueReducer.error })

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
        const postPromise = dispatch(postTaskQueue({ "task_id": Id }))
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
                type: TYPES.ROUTES.name,
                task_id: task._id,
                id: task._id,
            }
        })
    }

    const getReportButtons = () => {
        return Object.values(REPORT_TYPES).map((currType, ind) => {
            return {
                name: currType.name,
                color: themeContext.schema[currType.schema].solid,
                id: currType._id,
                type: currType.name.toUpperCase(),
            }
        })
    }

    var availableButtons = []
    var availableReportButtons = []
    switch(type) {
        case TYPES.ROUTES.name:
            availableButtons = getRouteButtons()
            break
        case TYPES.USER_REPORTS.name:
            availableReportButtons = getReportButtons()
            break

        case TYPES.ALL.name:
            availableButtons = getRouteButtons()
            availableReportButtons = getReportButtons()
            break

        default:
            break
    }

    function handleDrag(e, ui) {
        setWidth(Math.max(minWidth, width + ui.deltaX))
        setSmall(testSize(Math.max(minWidth, width + ui.deltaX)))  // check if width is less than styling breakpoint and update isSmall
    }

    const renderTypeButtons = () => {
        return(
                Object.values(TYPES).map((currType, index) => {
                    return (
                        <style.WidgetButtonButton
                            selected={type === currType.name}
                            onClick={()=>setType(currType.name)}
                            schema={currType.name}
                        >
                            <style.WidgetButtonIcon schema={currType.name.toLocaleLowerCase()} className={currType.iconName}/>
                        </style.WidgetButtonButton>
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
