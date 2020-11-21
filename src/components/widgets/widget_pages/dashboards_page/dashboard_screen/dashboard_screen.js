import React, { Component, useState, useEffect } from 'react';

import { useHistory, useParams } from 'react-router-dom'

// import external functions
import { connect, useDispatch, useSelector } from 'react-redux';

// Import components
import DashboardButtonList from "./dashboard_button_list/dashboard_button_list";
import TaskAddedAlert from "./task_added_alert/task_added_alert";
import DashboardTaskQueue from './dashboard_task_queue/dashboard_task_queue'

// Import Utils
import { ADD_TASK_ALERT_TYPE, PAGES } from "../../../../../constants/dashboard_contants";

// Import API
import { postStatus } from '../../../../../api/status_api'

// Import Actions
import { postTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import { dashboardOpen } from '../../../../../redux/actions/dashboards_actions'

// Import styles
import * as pageStyle from '../dashboards_header/dashboards_header.style'
import * as style from './dashboard_screen.style'

import DashboardsHeader from "../dashboards_header/dashboards_header";

// import logging
import log from "../../../../../logger";

const logger = log.getLogger("DashboardsPage");

const DashboardScreen = (props) => {

    const {
        dashboardId,
        setShowSidebar,
        showSidebar,
        setEditingDashboard,
    } = props

    // redux state
    const status = useSelector(state => { return state.statusReducer.status })
    const currentDashboard = useSelector(state => { return state.dashboardsReducer.dashboards[dashboardId] })
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const devices = useSelector(state => state.devicesReducer.devices)
    const positions = useSelector(state => state.locationsReducer.positions)
    const tasks = useSelector(state => state.tasksReducer.tasks)

    // self contained state
    const [addTaskAlert, setAddTaskAlert] = useState(null);

    // actions
    const dispatch = useDispatch()
    const onDashboardOpen = (bol) => dispatch(dashboardOpen(bol))

    const history = useHistory()
    const params = useParams()

    const stationID = params.stationID
    const dashboardID = params.dashboardID

    /**
     * When a dashboard screen is loaded, tell redux that its open
     * On unmount tell redux that its not loaded
     * 
     * Used in app.js and widget pages to make dashboard screen full size in mobile mode
     */
    useEffect(() => {
        onDashboardOpen(true)
        return () => {
            onDashboardOpen(false)
        }
    }, [])

    // If current dashboard is undefined, it probably has been deleted. So go back to locations just incase the station has been deleted too
    if (currentDashboard === undefined) {
        history.push(`/locations`)
        return (
            <>
            </>
        )
    }

    /**
     * Handles buttons associated with selected dashboard
     * 
     * If it's a AMR device dashboard, add a extra buttons
     * The extra buttons are: 
     * 'Send to charge location'
     * 'Send to Idle Location'
     * 
     * If there's a human task in the human task Q (see human_task_queue_actions for more details)
     * and if the the tasks unload location is the dashboards station, then show a unload button
     */
    const handleDashboardButtons = () => {
        let { buttons } = currentDashboard	// extract buttons from dashboard

        if (!!devices[stationID] && devices[stationID].device_model === 'MiR100') {
            const device = devices[stationID]

            // If the device has an idle location, add a button for it
            if (!!device.idle_location) {
                buttons = [
                    ...buttons,
                    {
                        'name': 'Send to Idle Location',
                        'color': '#FF4B4B',
                        'task_id': 'custom_task',
                        'custom_task': {
                            'type': 'position_move',
                            'position': device.idle_location,
                            'device_type': 'MiR_100',
                        },
                        'id': 'custom_task_idle'
                    }
                ]
            }

            // Map through positions and add a button if it's a charge position
            Object.values(positions).map((position, ind) => {
                if (position.type === 'charger_position') {
                    buttons = [
                        ...buttons,
                        {
                            'name': position.name,
                            'color': '#FFFF4B',
                            'task_id': 'custom_task',
                            'custom_task': {
                                'type': 'position_move',
                                'position': position._id,
                                'device_type': 'MiR_100',
                            },
                            'id': `custom_task_charge_${ind}`
                        }
                    ]
                }
            })

        } 
        else if (taskQueue)

        return buttons
    }

    // handles event of task click
    // creates an alert on the screen, and dispatches an action to update the task queue
    const handleTaskClick = async (Id, name, custom) => {

        // If a custom task then add custom task key to task q
        if (Id === 'custom_task') {

            await dispatch(postTaskQueue(
                {
                    "task_id": Id,
                    'custom_task': custom
                })
            )

            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                label: "Task Added to Queue",
                message: name
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)

        }

        let inQueue = false

        Object.values(taskQueue).map((item) => {
            if (item.task_id === Id) inQueue = true
        })

        // add alert to notify task has been added
        if (!inQueue) {

            // If the task is a human task, its handled a little differently compared to a normal task
            // Set hil_response to false because the backend does not dictate the load hil message
            // Since the task is put into the q but automatically assigned to the person that clicks the button upon up a hill message quick
            if (tasks[Id].device_type === 'human') {

                console.log('QQQQ Human task')
                // dispatch action to add task to queue
                await dispatch(postTaskQueue(
                    {
                        "task_id": Id,
                        dashboard: dashboardID,
                        hil_response: false,
                    })
                )

            } else {



                // dispatch action to add task to queue
                await dispatch(postTaskQueue(
                    {
                        "task_id": Id,
                    })
                )
            }

            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                label: "Task Added to Queue",
                message: name
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }

        else {
            // display alert notifying user that task is already in queue
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                label: "Alert! Task Already in Queue",
                message: `'${name}' not added`,
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }

    }

    return (
        <style.Container
        // clear alert
        // convenient to be able to clear the alert instead of having to wait for the timeout to clear it automatically
        // onClick={() => setAddTaskAlert(null)}
        >
            <DashboardsHeader
                showTitle={false}
                showBackButton={false}
                showEditButton={true}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                page={PAGES.DASHBOARD}
                setEditingDashboard={() => setEditingDashboard(dashboardId)}

                onBack={() => { setEditingDashboard(false) }}
            >
                <pageStyle.Title>{currentDashboard.name}</pageStyle.Title>
            </DashboardsHeader>

            <DashboardButtonList
                buttons={handleDashboardButtons()}
                addedTaskAlert={addTaskAlert}
                onTaskClick={handleTaskClick}
            />

            <TaskAddedAlert
                {...addTaskAlert}
                visible={!!addTaskAlert}
            />

            <DashboardTaskQueue />

        </style.Container>
    )
}

export default DashboardScreen;
