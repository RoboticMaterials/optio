import React, {useContext, useEffect, useRef, useState} from 'react';

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
import {ADD_TASK_ALERT_TYPE } from "../../../../../constants/dashboard_contants";

// Import Actions
import {postTaskQueue} from '../../../../../redux/actions/task_queue_actions'

import log from '../../../../../logger'
// import { Container } from '@material-ui/core';

const logger = log.getLogger("Dashboards")

// const tempColors = ["#798FD9", "#FFB62E", "#79D99B ", "#F24236", "#BA274A", "#592E83"]
// const tempColors = ["#b17de3", "#91a2db", "#92d6aa", "#ffc65c", "#92d6aa", "#fa6e64", "#cf5f7a"]
// const tempColors = ['#99A9D7', '#8ED2CD', '#C1ED98', '#FED875', '#F59B7C']
const tempColors = ['#FF4B4B', '#56d5f5', '#50de76', '#f2ae41', '#c7a0fa']
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

    // redux state
    const dispatch = useDispatch()
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const stations = useSelector(state => state.locationsReducer.stations)
    const code409 = useSelector(state => {return state.taskQueueReducer.error})

    // self contained state
	const [addTaskAlert, setAddTaskAlert] = useState(null)

    const handleTaskClick = (Id, name) => {

		// add alert to notify task has been added
		setAddTaskAlert({
			type: ADD_TASK_ALERT_TYPE.ADDING,
			message: "Adding to Queue..."
		})

		// dispatch action to add task to queue
        const postPromise = dispatch(postTaskQueue({"task_id": Id}))
        postPromise.then(() => {
            try{
                // code409 is returned if task is already in the queue
                if(code409.response.data.status === 409){
                    // display alert notifying user that task is already in queue
                    setAddTaskAlert({
                        type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                        label: "Alert! Task Already in Queue",
                        message: "'" + name + "' not added"
                    })
                }

            }catch {
                // display alert notifying user that task was successfully added
                setAddTaskAlert({
                    type:ADD_TASK_ALERT_TYPE.TASK_ADDED,
                    label: "Task Added to Queue",
                    message: name
                })
            }

            // clear alert after timeout
            setTimeout(() => setAddTaskAlert(null), 1800)
        })


    }

    const station = stations[stationID]

    var availableTasks = []
    try {
        availableTasks = handleAvailableTasks(tasks, station)
    }
    catch(e) {
        logger.log("availableTasks availableTasks", availableTasks)
        logger.log("availableTasks e", e)
    }

    var availableButtons = availableTasks.map((task,index) => {
        return {
            name: task.name,
            color: tempColors[index % tempColors.length],
            task_id: task._id.$oid,
            id: task._id.$oid,
        }
    })

    function handleDrag(e, ui) {
        setWidth(Math.max(minWidth, width + ui.deltaX))
        setSmall(testSize(Math.max(minWidth, width + ui.deltaX)))  // check if width is less than styling breakpoint and update isSmall
    }

    return(

        <style.SidebarWrapper onClick={()=>setAddTaskAlert(null)}>

            <style.SidebarContent
                key="sidebar-content"
                style={{width: width}}
            >
                <style.Container>
                    <style.ListContainer>
                        <Container
                            groupName="dashboard-buttons"
                            getChildPayload={index =>
                                availableButtons[index]
                            }
                        >
                            {availableButtons.map((button, index) =>
                                <DashboardSidebarButton
                                    key={`dashboard-sidebar-button-${index}`}
                                    name={button.name}
                                    color={button.color}
                                    task_id={button.task_id}
                                    id={button.id}
                                    clickable={clickable}
                                    onTaskClick={handleTaskClick}
                                    disabled = {!!addTaskAlert}
                                />
                            )}
                        </Container>
                    </style.ListContainer>
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
