import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import styles
import * as styled from './dashboard_lot_page.style'

// Import Basic Components
import Button from '../../../../../basic/button/button'
import BackButton from '../../../../../basic/back_button/back_button'

// Import Components
import DashboardLotFields from './dashboard_lot_fields/dashboard_lot_fields'
import DashboardLotButtons from './dashboard_lot_buttons/dashboard_lot_buttons'

// constants
import { ADD_TASK_ALERT_TYPE, PAGES } from "../../../../../../constants/dashboard_contants";
import { OPERATION_TYPES, TYPES } from "../../dashboards_sidebar/dashboards_sidebar";
import { DEVICE_CONSTANTS } from "../../../../../../constants/device_constants";
import { FIELD_DATA_TYPES, FLAG_OPTIONS } from "../../../../../../constants/lot_contants"

// Import Utils
import { getCurrentRouteForLot, getLotTemplateData } from '../../../../../../methods/utils/lot_utils'
import { isDeviceConnected } from "../../../../../../methods/utils/device_utils";
import { isRouteInQueue } from "../../../../../../methods/utils/task_queue_utils";

// Import Actions
import { handlePostTaskQueue } from '../../../../../../redux/actions/task_queue_actions'

const DashboardLotPage = () => {

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const cards = useSelector(state => state.cardsReducer.cards)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)

    const params = useParams()
    const history = useHistory()
    const dispatch = useDispatch()

    const {
        stationID,
        dashboardID,
        subPage,
        lotID
    } = params || {}

    // Have to use Sate for current lot because when the history is pushed, the current lot goes to undefined
    // but dashboard lot page is still mounted
    const [currentLot, setCurrentLot] = useState(cards[lotID])
    const [currentTask, setCurrentTask] = useState(null)
    const [addTaskAlert, setAddTaskAlert] = useState(null)

    const dispatchPostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))

    useEffect(() => {
        console.log('QQQQ current lot', currentLot)
        setCurrentLot(cards[lotID])
        setCurrentTask(getCurrentRouteForLot(currentLot, stationID))
        console.log('QQQQ current task', getCurrentRouteForLot(currentLot, stationID))
        return () => {

        }
    }, [])

    const onBack = () => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}`)

    }

    const onMove = (deviceType) => {
        // onTaskClick(TYPES.ROUTES.key, associatedTaskIdArg, name, currentButton.custom_task, !!deviceType ? deviceType : currentButton.deviceType)


        const {
            name,
            custom,
        } = currentTask

        const Id = currentTask._id

        // If a custom task then add custom task key to task q
        if (Id === 'custom_task') {
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                label: "Task Added to Queue",
                message: name
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }

        const connectedDeviceExists = isDeviceConnected()

        if (!connectedDeviceExists && deviceType !== DEVICE_CONSTANTS.HUMAN) {
            // display alert notifying user that task is already in queue
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                label: "Alert! No device is currently connected to run this route",
                message: `'${name}' not added`,
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }

        let inQueue = isRouteInQueue(Id, deviceType)

        // add alert to notify task has been added
        if (inQueue) {
            // display alert notifying user that task is already in queue
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
                label: "Alert! Task Already in Queue",
                message: `'${name}' not added`,
            })

            // clear alert after timeout
            return setTimeout(() => setAddTaskAlert(null), 1800)
        }
        else {
            dispatchPostTaskQueue({ dashboardID, tasks, deviceType, taskQueue, Id, name, custom })

            if (deviceType !== 'human') {
                setAddTaskAlert({
                    type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                    label: "Task Added to Queue",
                    message: name
                })

                // clear alert after timeout
                return setTimeout(() => setAddTaskAlert(null), 1800)
            }
        }

    }

    // /**
    //  * Handles event of task click
    //  *
    //  * Currently there are 3 types of tasks that can be clicked on a dashboard
    //  *
    //  * 1) Custom task
    //  * This task is used to send the cart to a position that does not belong to a station (You cant make a route to a non-station position)
    //  * It takes in the custom value, which is the position info, and sends the cart to that position from it's current location
    //  *
    //  * 2) HIL Success
    //  * This is a button that shows up on dashboard when a human tasks unload location is the current dashboard
    //  * Instead of showing a HIL modal, it shows an unload button
    //  * The reason why is that humans locations are not known so a HIL modal would have to be on the screen the whole time instead of when a autonomous cart arives
    //  *
    //  * 3) Basic Routes
    //  * This is the standard button for a dashboard that just executes the route
    //  * If the task is already in the q, then show a warning label and dont add it
    //  *
    //  *
    //  * @param {*} Id
    //  * @param {*} name
    //  * @param {*} custom
    //  */
    // const handleTaskClick = async (type, Id, name, custom, deviceType) => {
    //     switch (type.toUpperCase()) {
    //         case TYPES.ROUTES.key:
    //             if (!(Id === 'hil_success')) {
    //                 onHandlePostTaskQueue({ dashboardID, tasks, deviceType, taskQueue, Id, name, custom })
    //             }
    //             handleRouteClick(Id, name, custom, deviceType)
    //             break
    //         case TYPES.OPERATIONS.key:
    //             break
    //         case OPERATION_TYPES.REPORT.key:
    //             setReportModal({
    //                 type: OPERATION_TYPES.REPORT.key,
    //                 id: Id
    //             })
    //             break
    //         case OPERATION_TYPES.KICK_OFF.key:
    //             setReportModal({ type: OPERATION_TYPES.KICK_OFF.key, id: null })
    //             break
    //         case OPERATION_TYPES.FINISH.key:
    //             setReportModal({ type: OPERATION_TYPES.FINISH.key, id: null })
    //             break
    //         default:
    //             break
    //     }


    // }


    return (
        <styled.LotContainer>
            <styled.LotHeader>
                <styled.LotTitle>{currentLot.name}</styled.LotTitle>
            </styled.LotHeader>
            <DashboardLotFields currentLot={currentLot} />
            {/* <Button label={'Move'} style={{ marginTop: 'auto' }} onClick={() => onMove('human')} /> */}
            <DashboardLotButtons
                handleMove={(type) => onMove(type)}
                handleCancel={() => onBack()}
                isDeviceRoute={currentTask?.device_types?.length > 1}
            />
        </styled.LotContainer>
    )

}

export default DashboardLotPage