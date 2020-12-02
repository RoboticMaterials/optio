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
import { deepCopy } from '../../../../../methods/utils/utils'

// Import API
import { postStatus } from '../../../../../api/status_api'

// Import Actions
import { postTaskQueue, putTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import { dashboardOpen } from '../../../../../redux/actions/dashboards_actions'

// Import styles
import * as pageStyle from '../dashboards_header/dashboards_header.style'
import * as style from './dashboard_screen.style'

import DashboardsHeader from "../dashboards_header/dashboards_header";

// import logging
import log from "../../../../../logger";
import {REPORT_TYPES, TYPES} from "../dashboards_sidebar/dashboards_sidebar";

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
    const hilResponse = useSelector(state => state.taskQueueReducer.hilResponse)


    // self contained state
    const [addTaskAlert, setAddTaskAlert] = useState(null);
    const [reportModal, setReportModal] = useState(null);

    // actions
    const dispatch = useDispatch()
    const onDashboardOpen = (bol) => dispatch(dashboardOpen(bol))
    const onHILResponse = (response) => dispatch({ type: 'HIL_RESPONSE', payload: response })
    const onPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))

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

        // If this dashboard belongs to a device and the device is a cart, add some unique buttons
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
        // Else if the task q contains a human task that is unloading, show an unload button
        else if (Object.values(taskQueue).length > 0) {

            // Map through each item and see if it's showing a station, station Id is matching the current station and a human task
            Object.values(taskQueue).map((item, ind) => {

                // If it is matching, add a button the the dashboard for unloading 
                if (!!item.hil_station_id && item.hil_station_id === stationID && hilResponse !== item._id.$oid && tasks[item.task_id].device_type === 'human') {
                    buttons = [
                        ...buttons,
                        {
                            'name': item.hil_message,
                            'color': '#90eaa8',
                            'task_id': 'hil_success',
                            'custom_task': {
                                ...item
                            },
                            'id': `custom_task_charge_${ind}`
                        }
                    ]
                }
            })
        }

        return buttons
    }

    /**
     * Handles event of task click
     * 
     * Currently there are 3 types of tasks that can be clicked on a dashboard
     * 
     * 1) Custom task
     * This task is used to send the cart to a position that does not belong to a station (You cant make a route to a non-station position)
     * It takes in the custom value, which is the position info, and sends the cart to that position from it's current location
     * 
     * 2) HIL Success
     * This is a button that shows up on dashboard when a human tasks unload location is the current dashboard
     * Instead of showing a HIL modal, it shows an unload button
     * The reason why is that humans locations are not known so a HIL modal would have to be on the screen the whole time instead of when a autonomous cart arives
     * 
     * 3) Basic Routes
     * This is the standard button for a dashboard that just executes the route
     * If the task is already in the q, then show a warning label and dont add it
     * 
     * 
     * @param {*} Id 
     * @param {*} name 
     * @param {*} custom 
     */
    const handleTaskClick = async (type, Id, name, custom) => {
        console.log("handleTaskClick type",type)
        switch(type) {
            case TYPES.ROUTES.name.toUpperCase():
                handleRouteClick(Id, name, custom)
                break
            case TYPES.USER_REPORTS.name.toUpperCase():
                handleOperationClick()
                break
            case REPORT_TYPES.REPORT.name.toUpperCase():
                console.log("handleTaskClick REPORT_TYPES")
                set
                break
            default:
                break
        }


    }

    const handleOperationClick = () => {
        // setReportModal()
    }

    const handleReportClick = () => {
    }

    const handleRouteClick = async (Id, name, custom) => {
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

        // Else if its a hil success, execute the HIL success function
        else if (Id === 'hil_success') {

            return handleHilSuccess(custom)

        }

        let inQueue = false

        Object.values(taskQueue).map((item) => {
            if (item.task_id === Id) inQueue = true
        })

        // add alert to notify task has been added
        if (!inQueue) {

            // If the task is a human task, its handled a little differently compared to a normal task
            // Set hil_response to null because the backend does not dictate the load hil message
            // Since the task is put into the q but automatically assigned to the person that clicks the button
            if (tasks[Id].device_type === 'human') {

                // dispatch action to add task to queue
                await dispatch(postTaskQueue(
                    {
                        "task_id": Id,
                        dashboard: dashboardID,
                        hil_response: null,
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

    // Posts HIL Success to API 
    const handleHilSuccess = async (item) => {

        let newItem = {
            ...item,
            hil_response: true,
            // quantity: quantity,
        }

        // return console.log('QQQQ New Item', newItem)

        const ID = deepCopy(item._id.$oid)

        delete newItem._id
        delete newItem.dashboard

        // This is used to make the tap of the HIL button respond quickly
        // TODO: This may not be necessary here 
        onHILResponse(ID)
        setTimeout(() => onHILResponse(''), 2000)

        console.log('QQQQ task success', newItem)
        await onPutTaskQueue(newItem, ID)

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
