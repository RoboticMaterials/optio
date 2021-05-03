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

// Import Actions
import { handlePostTaskQueue } from '../../../../../redux/actions/task_queue_actions'

const DashboardOperationsMenu = (props) => {

    const {
        handleCloseMenu,
        handleOperationSelected,
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
    const onCustomTask = (type) => {
        let position
        console.log('QQQQ device', devices[stationID])
        return

        const device = devices[stationID]
        if (type === CUSTOM_CHARGE_TASK_ID) {
            // NOT CORRECT
            position = device?.idle_location
        }

        else if (type === CUSTOM_IDLE_TASK_ID) {
            position = device?.idle_location
        }

        const deviceType = 'MiR_100'
        const lotID = ''
        const Id = 'custom_task'
        const name = ''
        const custom = {
            type: 'position_move',
            position: '',
            deviceType: 'MiR_100'
        }

        dispatchPostTaskQueue({ dashboardID, tasks, deviceType, taskQueue, lotID, Id, name, custom })

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


    const renderSendToIdleButton = () => {
        const schema = theme.main.schema.finish
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Send to Idle'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => onCustomTask(CUSTOM_IDLE_TASK_ID)}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
    }

    const renderSendToChargerButton = () => {
        const schema = theme.main.schema.finish
        const iconClassName = schema?.iconName
        const iconColor = schema?.solid
        return (
            <DashboardButton
                title={'Send to Charger'}
                iconColor={"black"}
                iconClassName={iconClassName}
                onClick={() => onCustomTask(CUSTOM_CHARGE_TASK_ID)}
                containerStyle={{}}
                hoverable={true}
                color={iconColor}
                svgColor={theme.main.bg.secondary}
            />
        )
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
                        {renderSendToIdleButton()}
                        {renderSendToChargerButton()}
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

