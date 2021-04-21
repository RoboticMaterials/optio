import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import styles
import * as styled from './dashboard_lot_page.style'

// Import Basic Components
import Button from '../../../../../basic/button/button'
import BackButton from '../../../../../basic/back_button/back_button'

const DashboardLotPage = () => {

    const cards = useSelector(state => state.cardsReducer.cards)

    const params = useParams()
    const history = useHistory()

    const {
        stationID,
        dashboardID,
        subPage,
        lotID
    } = params || {}

    const [currentLot, setCurrentLot] = useState(cards[lotID])

    useEffect(() => {
        console.log('QQQQ current lot', currentLot)
        setCurrentLot(cards[lotID])
        return () => {

        }
    }, [])

    const handleBack = () => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}`)

    }


    // const handleRouteClick = async (Id, name, custom, deviceType) => {

    //     // If a custom task then add custom task key to task q
    //     if (Id === 'custom_task') {
    //         setAddTaskAlert({
    //             type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
    //             label: "Task Added to Queue",
    //             message: name
    //         })

    //         // clear alert after timeout
    //         return setTimeout(() => setAddTaskAlert(null), 1800)
    //     }

    //     // Else if its a hil success, execute the HIL success function
    //     else if (Id === 'hil_success') {
    //         return handleHilSuccess(custom)
    //     }

    //     const connectedDeviceExists = isDeviceConnected()

    //     if (!connectedDeviceExists && deviceType !== DEVICE_CONSTANTS.HUMAN) {
    //         // display alert notifying user that task is already in queue
    //         setAddTaskAlert({
    //             type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
    //             label: "Alert! No device is currently connected to run this route",
    //             message: `'${name}' not added`,
    //         })

    //         // clear alert after timeout
    //         return setTimeout(() => setAddTaskAlert(null), 1800)
    //     }

    //     let inQueue = isRouteInQueue(Id, deviceType)

    //     // add alert to notify task has been added
    //     if (inQueue) {
    //         // display alert notifying user that task is already in queue
    //         setAddTaskAlert({
    //             type: ADD_TASK_ALERT_TYPE.TASK_EXISTS,
    //             label: "Alert! Task Already in Queue",
    //             message: `'${name}' not added`,
    //         })

    //         // clear alert after timeout
    //         return setTimeout(() => setAddTaskAlert(null), 1800)
    //     }
    //     else {
    //         if (deviceType !== 'human') {
    //             setAddTaskAlert({
    //                 type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
    //                 label: "Task Added to Queue",
    //                 message: name
    //             })

    //             // clear alert after timeout
    //             return setTimeout(() => setAddTaskAlert(null), 1800)
    //         }
    //     }
    // }

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
                <BackButton onClick={handleBack} />
                <styled.LotTitle>{currentLot.name}</styled.LotTitle>
            </styled.LotHeader>
            <Button label={'Move'} style={{ marginTop: 'auto' }} />
        </styled.LotContainer>
    )

}

export default DashboardLotPage