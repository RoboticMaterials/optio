import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import styles
import * as styled from './dashboard_lot_page.style'

// Import Basic Components

// Import Components
import DashboardLotFields from './dashboard_lot_fields/dashboard_lot_fields'
import DashboardLotButtons from './dashboard_lot_buttons/dashboard_lot_buttons'
import QuantityModal from '../../../../../basic/modals/quantity_modal/quantity_modal'
import LotFlags from '../../../../../side_bar/content/cards/lot/lot_flags/lot_flags'
import DashboardLotInputBox from './dashboard_lot_input_box/dashboard_lot_input_box'
import Button from '../../../../../../components/basic/button/button'
import TransferLotModal from '../transfer_lot_modal/transfer_lot_modal'
// constants
import { ADD_TASK_ALERT_TYPE, PAGES } from "../../../../../../constants/dashboard_constants";
import { DEVICE_CONSTANTS } from "../../../../../../constants/device_constants";
import { FIELD_COMPONENT_NAMES } from "../../../../../../constants/lot_contants"
import { CUSTOM_TASK_ID } from "../../../../../../constants/route_constants";

// Import Utils
import { getBinQuantity, getCurrentRouteForLot, getPreviousRouteForLot } from '../../../../../../methods/utils/lot_utils'
import { isDeviceConnected } from "../../../../../../methods/utils/device_utils";
import { isRouteInQueue } from "../../../../../../methods/utils/task_queue_utils";
import { getProcessStations } from '../../../../../../methods/utils/processes_utils'
import { quantityOneSchema } from "../../../../../../methods/utils/form_schemas";
import { deepCopy } from '../../../../../../methods/utils/utils'

// Import Actions
import { handlePostTaskQueue, putTaskQueue } from '../../../../../../redux/actions/task_queue_actions'
import { isObject } from "../../../../../../methods/utils/object_utils";
import { putCard, getCards } from '../../../../../../redux/actions/card_actions'

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
        lotID,
        warehouse,
    } = params || {}

    // Have to use Sate for current lot because when the history is pushed, the current lot goes to undefined
    // but dashboard lot page is still mounted
    const [currentLot, setCurrentLot] = useState(cards[lotID])
    const [currentTask, setCurrentTask] = useState(null)
    const [isFinish, setIsFinish] = useState(false)
    const [showFinish, setShowFinish] = useState(false)
    const [lotContainsInput, setLotContainsInput] = useState(false)
    const [showTransferButton, setShowTransferButton] = useState(false)
    const [showTransferLotModal, setShowTransferLotModal] = useState(false)
    const [processTransferOptions, setProcessTransferOptions] = useState([])
    const onPutCard = async (currentLot, ID) => await dispatch(putCard(currentLot, ID))
    const dispatchPostTaskQueue = (props) => dispatch(handlePostTaskQueue(props))
    const disptachPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))
    const dispatchGetCards = () => dispatch(getCards())
    // Used to show dashboard input
    useEffect(() => {
        let containsInput = false
        currentLot.fields.forEach((field) => {
            field.forEach((subField) => {
                if (subField?.component === FIELD_COMPONENT_NAMES.INPUT_BOX) {
                    containsInput = true
                }
            })
        })

        setLotContainsInput(containsInput)
    }, [currentLot])

    useEffect(() => {
      setIsFinish(false)
    }, [cards])

    useEffect(() => {
        if (lotID) {
            const lot = cards[lotID]
            setCurrentLot(lot)
            const processStations = Object.keys(getProcessStations(processes[currentLot.process_id], routes))

            // If its the last station in the process, then the only option is to finish the lot
            if (processStations[processStations.length - 1] === stationID && !warehouse) {
                setIsFinish(true)
            }
            // If the URL has warehouse, then the task is the previous route (the route that goes from warehouse to current station)
            else if (!!warehouse) {
                const returnedRoute = getPreviousRouteForLot(currentLot, stationID)
                setCurrentTask(returnedRoute)
            }
            else {
                const returnedRoute = getCurrentRouteForLot(currentLot, stationID)
                setCurrentTask(returnedRoute)
            }



            // go back if lot has no items at this station (ex. just moved them all).
            // Dont go back though if the prevStation was a warehouse
            // Doesn't make sense to stay on this screen
            if (isObject(lot) && isObject(lot?.bins)) {
                const quantity = getBinQuantity(lot, stationID)
                if ((!quantity || (quantity <= 0)) && !warehouse) {
                    onBack()
                }
            }
        }

        return () => {

        }
    }, [lotID, cards])

    useEffect(() => {
      transferLotShouldRender()
    },[processes])



    const transferLotShouldRender = () => {
      const proc = []
        Object.values(processes).forEach((process) => {
          if(process._id!==processes[currentLot.process_id]._id){
            const processStations = Object.keys(getProcessStations(process,routes))
            for(const ind in processStations){
              if(processStations[ind] === stationID){
                proc.push([process])
                setShowTransferButton(true)
              }
            }
          }
        })
        setProcessTransferOptions(proc)
      }

    const onBack = () => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}`)
    }

    // Handles moving lot to next station
    const onMove = (deviceType) => {
        const {
            name,
            custom,
        } = currentTask || {}

        const Id = currentTask?._id

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

    const renderTransferLotModal = () => {

      return (
        <TransferLotModal
          isOpen = {true}
          close = {()=>setShowTransferLotModal(false)}
          options = {processTransferOptions}
          lot = {currentLot}
        />
      )
    }

    const onFinish = async (quantity) => {

        let requestSuccessStatus = false
        let message

        // extract lot attributes
        const {
            name: cardName,
            _id: lotId,
        } = currentLot

        if (quantity && quantity > 0) {

            // moving lot is handled through custom task
            const custom = {
                load: {
                    station: stationID,
                    instructions: "",
                    position: null,
                    sound: null,
                },
                unload: {
                    station: "FINISH",
                    instructions: "",
                    position: null,
                    sound: null,
                },
                handoff: true,
                hil_response: null,
                quantity: 1
            }

            // first, post task queue
            const result = await dispatchPostTaskQueue({ hil_response: null, tasks, deviceType: DEVICE_CONSTANTS.HUMAN, taskQueue, Id: CUSTOM_TASK_ID, custom })

            // check if request was successful
            if (!(result instanceof Error)) {

                const {
                    _id,
                    dashboardID,
                    dashboard,
                    ...rest
                } = result || {}

                // now must update task queue item to move the lot
                setTimeout(async () => {

                    await disptachPutTaskQueue(
                        {
                            ...rest,
                            hil_response: true,
                            lot_id: lotId,
                            quantity
                        }
                        , result._id)
                    await dispatchGetCards()
                }, 1000)

                requestSuccessStatus = true
                message = cardName ? `Finished ${quantity} ${quantity > 1 ? "items" : "item"} from '${cardName}'` : `Finished ${quantity} ${quantity > 1 ? "items" : "item"}`
                handleTaskAlert(
                    ADD_TASK_ALERT_TYPE.FINISH_SUCCESS,
                    "Lot Finished",
                    message
                )
            }
        }

        else {
            message = "Quantity must be greater than 0"
            handleTaskAlert(
                ADD_TASK_ALERT_TYPE.FINISH_FAILURE,
                "Lot Failed",
                message
            )
        }
    }

    return (
        <styled.LotContainer>
            <styled.LotBodyContainer>
                <styled.LotHeader>
                  {!!showTransferButton &&
                    <Button
                      style = {{marginRight: '3rem', marginTop: '1.5rem', position: 'absolute', left: '1rem', height: '3rem', minWidth: '10rem'}}
              				schema={"processes"}
                      onClick = {()=>setShowTransferLotModal(true)}
              			>
                    Transfer Lot
              			</Button>
                  }
                  <styled.LotTitle>{currentLot?.name}</styled.LotTitle>
                </styled.LotHeader>
                <LotFlags flags={currentLot?.flags} containerStyle={{ alignSelf: 'center' }} />

                <DashboardLotFields
                    currentLot={currentLot}
                    stationID={stationID}
                    warehouse={!!warehouse}
                />
                {!!lotContainsInput &&
                    <DashboardLotInputBox
                        currentLot={currentLot}
                    />
                }
            </styled.LotBodyContainer>
            <styled.LotButtonContainer>
                <DashboardLotButtons
                    handleMove={(type) => onMove(type)}
                    handleCancel={() => onBack()}
                    isDeviceRoute={currentTask?.device_types?.length > 1}
                    isFinish={isFinish}
                    handleFinish={() => setShowFinish(true)}
                    route={currentTask}
                />
            </styled.LotButtonContainer>
            {showFinish &&
                renderFinishQuantity()
            }
            {showTransferLotModal &&
              renderTransferLotModal()
            }
        </styled.LotContainer>
    )

}

export default DashboardLotPage
