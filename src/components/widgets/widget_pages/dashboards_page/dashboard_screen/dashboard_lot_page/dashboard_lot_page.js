import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import styles
import * as styled from './dashboard_lot_page.style'

// Import Basic Components

// Import Components
import DashboardLotFields from './dashboard_lot_fields/dashboard_lot_fields'
import DashboardLotButtons from './dashboard_lot_buttons/dashboard_lot_buttons'
import QuantityModal from '../../../../../basic/modals/quantity_modal/quantity_modal'

// constants
import { ADD_TASK_ALERT_TYPE, PAGES } from "../../../../../../constants/dashboard_constants";
import { DEVICE_CONSTANTS } from "../../../../../../constants/device_constants";
import { FIELD_DATA_TYPES, FLAG_OPTIONS } from "../../../../../../constants/lot_contants"

// Import Utils
import { getBinQuantity, getCurrentRouteForLot, getLotTemplateData } from '../../../../../../methods/utils/lot_utils'
import { isDeviceConnected } from "../../../../../../methods/utils/device_utils";
import { isRouteInQueue } from "../../../../../../methods/utils/task_queue_utils";
import { getProcessStations } from '../../../../../../methods/utils/processes_utils'
import { quantityOneSchema } from "../../../../../../methods/utils/form_schemas";

// Import Actions
import { handlePostTaskQueue } from '../../../../../../redux/actions/task_queue_actions'
import { isObject } from "../../../../../../methods/utils/object_utils";
import { putCard } from '../../../../../../redux/actions/card_actions'

const DashboardLotPage = (props) => {

    const {
        handleTaskAlert,
    } = props

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const cards = useSelector(state => state.cardsReducer.cards)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const routes = useSelector(state => state.tasksReducer.tasks)
    const processes = useSelector(state => state.processesReducer.processes)

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
    const [isFinish, setIsFinish] = useState(false)
    const [showFinish, setShowFinish] = useState(false)

    const onPutCard = async (currentLot, ID) => await dispatch(putCard(currentLot, ID))
    const dispatchPostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))

    useEffect(() => {
        if (lotID) {
            const lot = cards[lotID]
            setCurrentLot(lot)
            const processStations = Object.keys(getProcessStations(processes[currentLot.process_id], routes))

            // If its the last station in the process, then the only option is to finish the lot
            if (processStations[processStations.length - 1] === stationID) {
                setIsFinish(true)
            }
            else {
                const returnedRoute = getCurrentRouteForLot(currentLot, stationID)
                setCurrentTask(returnedRoute)
            }

            // go back if lot has no items at this station (ex. just moved them all. Doesn't make sense to stay on this screen
            if (isObject(lot) && isObject(lot?.bins)) {
                const quantity = getBinQuantity(lot, stationID)
                if (!quantity || (quantity <= 0)) {
                    onBack()
                }
            }
        }

        return () => {

        }
    }, [lotID, cards])



    const onBack = () => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}`)

    }

    const onMove = (deviceType) => {
        // onTaskClick(TYPES.ROUTES.key, associatedTaskIdArg, name, currentButton.custom_task, !!deviceType ? deviceType : currentButton.deviceType)


        const {
            name,
            custom,
        } = currentTask || {}

        const Id = currentTask._id

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
            dispatchPostTaskQueue({ dashboardID, tasks, deviceType, taskQueue, lotID, Id, name, custom })

            if (deviceType !== DEVICE_CONSTANTS.HUMAN) {
                handleTaskAlert(
                    ADD_TASK_ALERT_TYPE.TASK_ADDED,
                    "Task Added to Queue",
                    name
                )
            }
        }

    }

    const renderFinishQuantity = () => {
        const lotCount = currentLot?.bins[stationID]?.count

        return (
            <QuantityModal
                validationSchema={quantityOneSchema}
                maxValue={lotCount}
                minValue={1}
                infoText={`${lotCount} items available.`}
                isOpen={true}
                title={"Select Quantity"}
                onRequestClose={() => setShowFinish(false)}
                onCloseButtonClick={() => setShowFinish(false)}
                handleOnClick2={(quantity) => {
                    setShowFinish(false)
                    onFinish(quantity)
                }}
                handleOnClick1={() => {
                    setShowFinish(false)
                }}
                button_2_text={"Confirm"}
                button_1_text={"Cancel"}
            />
        )
    }

    const onFinish = async (quantity) => {

        let requestSuccessStatus = false
        let message

        // extract lot attributes
        const {
            bins,
            name: cardName,
            process_id,
            _id: cardId,
        } = currentLot

        if (quantity && quantity > 0) {
            // extract first station's bin and queue bin from bins
            const {
                [stationID]: currentStationBin,
                ["FINISH"]: finishBin,
                ...unalteredBins
            } = bins || {}

            const queueBinCount = finishBin?.count ? finishBin.count : 0
            const currentStationBinCount = currentStationBin?.count ? currentStationBin.count : 0

            // udpated currentLot will maintain all of the cards previous attributes with the station_id and route_id updated
            let updatedCard = {
                ...currentLot,                                // spread unaltered attributes
                bins: {
                    ...unalteredBins,                   // spread unaltered bins
                    ["FINISH"]: {
                        ...finishBin,              // spread unaltered attributes of station bin if it exists
                        count: parseInt(queueBinCount) + parseInt(quantity)    // increment first station's count by the count of the queue
                    }
                },
            }

            if (quantity < currentStationBinCount) {
                updatedCard = {
                    ...updatedCard,
                    bins: {
                        ...updatedCard.bins,
                        [stationID]: {
                            ...currentStationBin,
                            count: parseInt(currentStationBinCount) - parseInt(quantity)
                        }
                    }
                }
            }

            // send update action
            const result = await onPutCard(updatedCard, cardId)

            // check if request was successful
            if (!(result instanceof Error)) {
                requestSuccessStatus = true
                message = cardName ? `Finished ${quantity} ${quantity > 1 ? "items" : "item"} from '${cardName}'` : `Finished ${quantity} ${quantity > 1 ? "items" : "item"}`
            }
        }

        else {
            message = "Quantity must be greater than 0"
        }

        if (requestSuccessStatus) {
            handleTaskAlert(
                ADD_TASK_ALERT_TYPE.FINISH_SUCCESS,
                "Lot has been finished",
                message,
            )
        } else {
            handleTaskAlert(
                ADD_TASK_ALERT_TYPE.FINISH_FAILURE,
                "Finish failure",
                message,
            )
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
                <styled.LotTitle>{currentLot?.name}</styled.LotTitle>
                <styled.LotTitle>{getBinQuantity(currentLot, stationID)}</styled.LotTitle>
            </styled.LotHeader>
            <DashboardLotFields currentLot={currentLot} />
            {/* <Button label={'Move'} style={{ marginTop: 'auto' }} onClick={() => onMove('human')} /> */}
            <DashboardLotButtons
                handleMove={(type) => onMove(type)}
                handleCancel={() => onBack()}
                isDeviceRoute={currentTask?.device_types?.length > 1}
                isFinish={isFinish}
                handleFinish={() => setShowFinish(true)}
                route={currentTask}
            />

            {showFinish &&
                renderFinishQuantity()
            }
        </styled.LotContainer>
    )

}

export default DashboardLotPage