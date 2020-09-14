import React, { Component, useState, useEffect } from 'react';

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
    const taskQueueApi = useSelector(state => { return state.apiReducer.taskQueueApi })
    const code409 = useSelector(state => { return state.taskQueueReducer.error })

    const { buttons } = currentDashboard	// extract buttons from dashboard

    // self contained state
    const [addTaskAlert, setAddTaskAlert] = useState(null);

    // actions
    const dispatch = useDispatch()
    const onDashboardOpen = (bol) => dispatch(dashboardOpen(bol))

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

    // handles event of task click
    // creates an alert on the screen, and dispatches an action to update the task queue
    const handleTaskClick = async (Id, name) => {

        // add alert to notify task has been added
        setAddTaskAlert({
            type: ADD_TASK_ALERT_TYPE.ADDING,
            message: "Adding to Queue..."
        })

        // dispatch action to add task to queue
        await dispatch(postTaskQueue({ "task_id": Id }))

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
    }

    return (
        <style.Container
            // clear alert
            // convenient to be able to clear the alert instead of having to wait for the timeout to clear it automatically
            onClick={() => setAddTaskAlert(null)}
        >
            <DashboardsHeader
                showTitle={false}
                showBackButton={true}
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
                buttons={buttons}
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
