import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './route_modal.style'
import { theme } from "../../../../../../theme";

// Import Utils
import { handleAvailableTasks } from '../../../../../../methods/utils/dashboards_utils'
import { isDeviceConnected } from "../../../../../../methods/utils/device_utils";
import { isRouteInQueue } from "../../../../../../methods/utils/task_queue_utils";

// Import Components
import DashboardButton from '../../dashboard_buttons/dashboard_button/dashboard_button'
import DashboardSplitButton from '../../dashboard_buttons/dashboard_split_button/dashboard_split_button'

// Import Constants
import { DEVICE_CONSTANTS } from '../../../../../../constants/device_constants'
import { ADD_TASK_ALERT_TYPE, PAGES } from "../../../../../../constants/dashboard_constants";

// Import Actions
import { handlePostTaskQueue, putTaskQueue } from '../../../../../../redux/actions/task_queue_actions'



const RouteModal = (props) => {

    const {
        isOpen,
        close,
        handleTaskAlert
    } = props

    const params = useParams()
    const {
        dashboardID,
        subPage,
        stationID,
        lotID,
    } = params || {}

    const dispatch = useDispatch()
    const dispatchPostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))

    const stations = useSelector(state => state.stationsReducer.stations)
    const routes = useSelector(state => { return state.tasksReducer.tasks }) || {}
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)

    const [error, setError] = useState(null)

    // Handles moving lot to next station
    const onMove = (deviceType, route) => {
        close()
        const {
            name,
            custom,
        } = route || {}

        const Id = route._id

        // If a custom task then add custom task key to task q
        if (Id === 'custom_task') {
            handleTaskAlert(
                ADD_TASK_ALERT_TYPE.TASK_ADDED,
                "Task Added to Queue",
                name
            )
        }

        const connectedDeviceExists = isDeviceConnected()

        if (!connectedDeviceExists && deviceType !== DEVICE_CONSTANTS.HUMAN) {
            // display alert notifying user that task is already in queue
            handleTaskAlert(
                ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                "Alert! No device is currently connected to run this route",
                `'${name}' not added`,
            )
        }

        let inQueue = isRouteInQueue(Id, deviceType)

        // add alert to notify task has been added
        if (inQueue) {
            // display alert notifying user that task is already in queue
            handleTaskAlert(
                ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                "Alert! Task Already in Queue",
                `'${name}' not added`,
            )

        }
        else {
            dispatchPostTaskQueue({ dashboardID, routes, deviceType, taskQueue, lotID, Id, name, custom })

            if (deviceType !== DEVICE_CONSTANTS.HUMAN) {
                handleTaskAlert(
                    ADD_TASK_ALERT_TYPE.TASK_ADDED,
                    "Task Added to Queue",
                    name
                )
            }
        }

    }

    const renderRouteButtons = () => {
        const stationRoutes = handleAvailableTasks(routes, stations[stationID])

        return stationRoutes.map((route, ind) => {
            const isDeviceRoute = route?.device_types.length > 1
            const name = route.name
            const taskID = route._id

            const color = '#90eaa8'
            const textColor = '#1c933c'
            const iconColor = theme.main.bg.octonary
            const iconClassName = 'fas fa-play'

            if (isDeviceRoute) {
                return (
                    <DashboardSplitButton
                        color={color}
                        containerStyle={{ background: color }}
                        titleStyle={{ color: textColor }}
                        iconColor={iconColor}

                        title={name}
                        iconClassName={iconClassName}
                        clickable={true}
                        onClick={(props) => {
                            onMove(props, route)
                        }}
                        hoverable={false}
                        taskID={taskID}
                        error={error}
                        key={`routeButton-${ind}`}
                    />
                )
            }
            else {
                return (
                    <DashboardButton
                        color={color}
                        containerStyle={{ background: color }}
                        titleStyle={{ color: textColor }}
                        iconColor={iconColor}

                        title={name}
                        iconColor={"black"}
                        iconClassName={iconClassName}
                        onClick={() => onMove(DEVICE_CONSTANTS.HUMAN, route)}

                        hoverable={false}
                        taskID={taskID}
                        disabled={false}
                        error={error}
                        key={`routeButton-${ind}`}
                    />
                )
            }
        })
    }

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Kick Off Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
            }}
        >
            <styled.BodyContainer>
                <styled.Title schema={'routes'}>Available Routes</styled.Title>
                <styled.CloseButton
                    className={'fas fa-times'}
                    onClick={() => { close() }}
                    style={{ cursor: 'pointer' }}
                />

                <styled.RouteListContainer>
                    {renderRouteButtons()}
                </styled.RouteListContainer>

            </styled.BodyContainer>
        </styled.Container>
    )
}

export default RouteModal