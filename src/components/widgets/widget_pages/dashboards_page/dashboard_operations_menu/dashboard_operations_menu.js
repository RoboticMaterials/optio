import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './dashboard_operations_menu.styled'
import { theme } from '../../../../../theme'

// Import Basic Components
import Button from '../../../../basic/button/button'

// Import Components
import DashboardButton from '../dashboard_buttons/dashboard_button/dashboard_button'

// Import Hooks
import useOnClickOutside from '../../../../../hooks/useOnClickOutside'

// Import Constants
import { OPERATION_TYPES, TYPES } from '../../../../../constants/dashboard_constants'
import { CUSTOM_CHARGE_TASK_ID, CUSTOM_IDLE_TASK_ID } from '../../../../../constants/route_constants'

// Import Utils
import { handleDeviceDashboardRoutes } from '../../../../../methods/utils/dashboards_utils'

// Import Actions
import { handlePostTaskQueue } from '../../../../../redux/actions/task_queue_actions'

const DashboardOperationsMenu = (props) => {

    const {
        handleCloseMenu,
        handleOperationSelected,
        handleTaskAlert,
    } = props

    const history = useHistory()
    const params = useParams()
    const dispatch = useDispatch()

    const {
        stationID,
        dashboardID,
        editing,
        lotID
    } = params || {}

    const availableKickOffProcesses = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards[dashboardID] })
    const availableFinishProcesses = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardID] })
    const devices = useSelector(state => state.devicesReducer.devices)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)

    const dispatchPostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))

    const isDevice = !!devices[stationID]

    const ref = useRef() // ref for useOnClickOutside
    useOnClickOutside(ref, () => { handleCloseMenu() }) // calls onClickOutside when click outside of element

    // Custom task for Send to idle and charging operators
    const onCustomTask = async (props) => {

        const {
            deviceType,
        } = props

        const lotID = ''
        const Id = props.task_id
        const name = ''
        const custom = props.custom_task

        await dispatchPostTaskQueue({ dashboardID, tasks, deviceType, taskQueue, lotID, Id, name, custom })
        handleTaskAlert()
        handleCloseMenu()

    }

    const renderReportButton = () => {

        const schema = theme.main.schema.report
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Reports'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => handleOperationSelected('report')}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
    }

    const renderTaskQueueButton = () => {
        const schema = theme.main.schema.taskQueue
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Task Queue'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => handleOperationSelected('taskQueue')}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
    }

    const renderKickOffButton = () => {
        const schema = theme.main.schema.kick_off
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Kick Off'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => handleOperationSelected('kickOff')}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
    }

    const renderFinishButton = () => {
        const schema = theme.main.schema.finish
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Finish'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => handleOperationSelected('finish')}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
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
                    svgColor={theme.main.bg.secondary}
                    clickable={true}
                />
            )
        })


    }

    const renderButtons = () => {
        return (
            <>
                {renderReportButton()}
                {renderTaskQueueButton()}

                {availableKickOffProcesses.length > 0 &&
                    renderKickOffButton()
                }
                {availableFinishProcesses.length > 0 &&
                    renderFinishButton()
                }

                {isDevice &&
                    <>
                        {renderDeviceButtons()}
                    </>

                }
            </>

        )
    }



    return (
        <styled.MenuContainer ref={ref}>
            {renderButtons()}
        </styled.MenuContainer>
    )

}

export default DashboardOperationsMenu

