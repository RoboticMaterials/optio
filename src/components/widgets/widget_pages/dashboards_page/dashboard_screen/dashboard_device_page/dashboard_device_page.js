import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './dashboard_device_page.style'
import { theme } from '../../../../../../theme'

// Import Components
import DashboardButton from '../../dashboard_buttons/dashboard_button/dashboard_button'

// Import Actions
import { handlePostTaskQueue } from '../../../../../../redux/actions/task_queue_actions'

// Import Utils
import { handleDeviceDashboardRoutes } from '../../../../../../methods/utils/dashboards_utils'


const DashboardDevicePage = (props) => {

    const {
        handleTaskAlert,
    } = props

    const params = useParams()
    const dispatch = useDispatch()

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const devices = useSelector(state => state.devicesReducer.devices)

    const {
        stationID,
        dashboardID,
        editing,
        lotID
    } = params || {}


    const dispatchPostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))

    // Custom task for Send to idle and charging operators
    const onCustomTask = async (props) => {

        const {
            deviceType,
        } = props

        const lotID = ''
        const Id = props.taskId
        const name = ''
        const custom = props.custom_task

        await dispatchPostTaskQueue({ dashboardID, tasks, deviceType, taskQueue, lotID, Id, name, custom })
        handleTaskAlert()
    }


    const renderDeviceButtons = () => {
        const routes = handleDeviceDashboardRoutes(devices[stationID])

        return routes.map((route, ind) => {
            const iconClassName = 'fas fa-route'
            const name = route.name
            const color = route.color

            return (
                <DashboardButton
                    title={name}
                    iconColor={"black"}
                    iconClassName={iconClassName}
                    onClick={() => onCustomTask(route)}
                    containerStyle={{}}
                    hoverable={true}
                    color={color}
                    svgColor={theme.main.bg.primary}
                    clickable={true}
                />
            )
        })


    }

    return (
        <styled.ButtonContainer>
            {renderDeviceButtons()}
        </styled.ButtonContainer>
    )

}


export default DashboardDevicePage