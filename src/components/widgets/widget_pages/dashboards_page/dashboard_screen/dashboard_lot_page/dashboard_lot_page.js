import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import styles
import * as styled from './dashboard_lot_page.style'

// Import Basic Components
import { uuidv4 } from '../../../../../../methods/utils/utils';

// Import Components
import DashboardLotFields from './dashboard_lot_fields/dashboard_lot_fields'
import DashboardLotButtons from './dashboard_lot_buttons/dashboard_lot_buttons'
import QuantityModal from '../../../../../basic/modals/quantity_modal/quantity_modal'
import LotFlags from '../../../../../side_bar/content/cards/lot/lot_flags/lot_flags'
import DashboardLotInputBox from './dashboard_lot_input_box/dashboard_lot_input_box'
import ContentListItem from '../../../../../side_bar/content/content_list/content_list_item/content_list_item';
import Button from '../../../../../../components/basic/button/button'

// constants
import { ADD_TASK_ALERT_TYPE, PAGES } from "../../../../../../constants/dashboard_constants";
import { DEVICE_CONSTANTS } from "../../../../../../constants/device_constants";
import { FIELD_COMPONENT_NAMES } from "../../../../../../constants/lot_contants"
import { CUSTOM_TASK_ID } from "../../../../../../constants/route_constants";

// Import Utils
import { getBinQuantity, getCurrentRouteForLot, getPreviousRouteForLot, handleMoveLotToMergeStation } from '../../../../../../methods/utils/lot_utils'
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

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const cards = useSelector(state => state.cardsReducer.cards)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const routes = useSelector(state => state.tasksReducer.tasks)
    const processes = useSelector(state => state.processesReducer.processes)
    const stations = useSelector(state => state.stationsReducer.stations);

    const availableFinishProcesses = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardID] })



    // Have to use Sate for current lot because when the history is pushed, the current lot goes to undefined
    // but dashboard lot page is still mounted
    const currentLot = useRef(cards[lotID]).current;
    const routeOptions = useRef(processes[currentLot.process_id].routes
                                    .map(routeId => routes[routeId])
                                    .filter(route => route.load === stationID)
                                ).current


    const [showFinish, setShowFinish] = useState(false)
    const [lotContainsInput, setLotContainsInput] = useState(false)
    const [showRouteSelector, setShowRouteSelector] = useState(false)
    const [moveQuantity, setMoveQuantity] = useState(currentLot.bins[stationID]?.count)

    const dispatchPutCard = async (lot, ID) => await dispatch(putCard(lot, ID))
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

    // useEffect(() => {
    //     if (lotID) {
    //         const lot = cards[lotID]
    //         setCurrentLot(lot)
    //         const processStations = Object.keys(getProcessStations(processes[currentLot.process_id], routes))

    //         // If its the last station in the process, then the only option is to finish the lot
    //         if (processStations[processStations.length - 1] === stationID && !warehouse) {
    //             setIsFinish(true)
    //         }
    //         // If the URL has warehouse, then the task is the previous route (the route that goes from warehouse to current station)
    //         else if (!!warehouse) {
    //             const returnedRoute = getPreviousRouteForLot(currentLot, stationID)
    //             setCurrentTask(returnedRoute)
    //         }
    //         else {
    //             const returnedRoute = getCurrentRouteForLot(currentLot, stationID)
    //             setCurrentTask(returnedRoute)
    //         }

    //         // go back if lot has no items at this station (ex. just moved them all).
    //         // Dont go back though if the prevStation was a warehouse
    //         // Doesn't make sense to stay on this screen
    //         if (isObject(lot) && isObject(lot?.bins)) {
    //             const quantity = getBinQuantity(lot, stationID)
    //             if ((!quantity || (quantity <= 0)) && !warehouse) {
    //                 onBack()
    //             }
    //         }
    //     }

    //     return () => {

    //     }
    // }, [lotID, cards])




      //This function determines if multiple routes are merging into a station and handles the lot quantity available to move accordingly
      //If multiple routes merge into a station the parts at the station are kept track of at that bin
      //If one type of part doesn't exist yet none of that lot can be moved along
      //Otherwise, assuming 1 to 1 ratio the type of part with lowest count limits the amount of the lot that is available to move
      const handleNextStationsLot = (destinationId, quantity) => {

        const mergingRoutes = processes[currentLot.process_id].routes
                              .map(routeId => routes[routeId])
                              .filter(route => route.unload === destinationId)


        if(mergingRoutes.length>1){ //If multiple routes merge into station, keep track of parts at the station
            let countQuantity = currentLot.totalQuantity //Initialize count at totalquantity
            let part = ""
            for(const ind in mergingRoutes){
              let currPartQty = mergingRoutes[ind].part
              if(mergingRoutes[ind].load === stationID){ //Found the route that we are currently transferring parts along
                if(!!currentLot.bins[destinationId]){  // Bin exists, add parts to station
                  let existingQuantity = !!currentLot.bins[destinationId][currPartQty] ? currentLot.bins[destinationId][currPartQty] : 0
                  currentLot.bins[destinationId] = {
                    ...currentLot.bins[destinationId],
                    [currPartQty]: existingQuantity +=quantity
                  }

                  for(const count in mergingRoutes){
                     part = mergingRoutes[count].part
                    //If part exists at station and it's count is less than other parts,  limit available lot quantity to that part quantity
                    if(!!currentLot.bins[destinationId] && !!currentLot.bins[destinationId][part]){
                      countQuantity = currentLot.bins[destinationId][part]<countQuantity ? currentLot.bins[destinationId][part] : countQuantity
                    }
                    //If one of the parts doesnt exist yet at station set count to 0 (none of that lot will be available to move if a part is completely missing)
                    else{
                      countQuantity = 0
                    }
                  }
                  //Update lot count. As we looped through the routes that merge to station the limiting factor has been found for lot quantity
                  currentLot.bins[destinationId].count = countQuantity
                }
                else{//Nothing exists at station yet, creat bin, add parts to bin
                  currentLot.bins[destinationId] = {
                    [currPartQty]: quantity,
                    count: 0
                  }
                }
              }
            }
          }

          else{ // Only one route enters station, don't worry about tracking parts at the station
            let totalQuantity = !!currentLot.bins[destinationId]?.count ? currentLot.bins[destinationId].count + quantity : quantity
            currentLot.bins[destinationId] = {
                count: totalQuantity
            }
          }
        }

        const handleCurrentStationLot = (quantity) => {

          const mergingRoutes = processes[currentLot.process_id].routes
                                .map(routeId => routes[routeId])
                                .filter(route => route.unload === stationID)

          if(mergingRoutes.length>1){//subtract quantity from both count and the parts at the station
                for(const ind in currentLot.bins[stationID]){
                  if(currentLot.bins[stationID][ind]-quantity < 1){
                      delete currentLot.bins[stationID][ind]
                  }
                  else currentLot.bins[stationID][ind] -= quantity
                }
              }
          else{
            if (quantity === currentLot.bins[stationID].count) {
                delete currentLot.bins[stationID];
            } else {
                currentLot.bins[stationID].count -= quantity;
            }
          }
        }


    const onBack = () => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}`)
    }

    const onMoveClicked = () => {
        // Depending on if its a finish column, a single flow, or a split/choice
        if (routeOptions.length === 0) {
            onMove('FINISH', moveQuantity);
        } else if (routeOptions.length === 1) {
            onMove(routeOptions[0].unload, moveQuantity);
        } else if (routeOptions.some(route => route.divergeType === 'split')) {
            onMove(routeOptions.map(route => route.unload), moveQuantity);
        } else {
            setShowRouteSelector(true);
        }
    }

    // Handles moving lot to next station
    const onMove = (moveStations, quantity) => {
        if (Array.isArray(moveStations)) { // Split node, duplicate card and send to all stations
            for (var toStationId of moveStations) {
              handleNextStationsLot(toStationId, quantity)
            }
            // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
            handleCurrentStationLot(quantity)

            //Add dispersed key to lot for totalQuantity Util
            handleTaskAlert("LOT_MOVED", "Lot Moved", `Lot has been split between ${moveStations.map(stationId => stations[stationId].name).join(' & ')}`)
        }
        else { // Single-flow node, just send to the station
            const toStationId = moveStations;
            handleNextStationsLot(toStationId, quantity)

            // If the whole quantity is moved, delete that bin. Otherwise keep the bin but subtract the qty
            handleCurrentStationLot(quantity)

            const stationName = toStationId === 'FINISH' ? 'Finish' : stations[toStationId].name;
            handleTaskAlert("LOT_MOVED", "Lot Moved", `Lot has been moved to ${stationName}`)
        }
        dispatchPutCard(currentLot, lotID)
        onBack()
    }

    const renderRouteSelectorModal = useMemo(() => {
        return (
            <styled.ModalContainer
                isOpen={showRouteSelector}
                contentLabel="Kick Off Modal"
                onRequestClose={() => setShowRouteSelector(false)}
                style={{
                    overlay: {
                        zIndex: 500,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)'
                    },
                }}
            >

                <styled.BodyContainer>
                    <>
                    <styled.Title>Select the station to move this lot to</styled.Title>
                    {routeOptions.map((route, ind) => (
                        <ContentListItem
                            ind={ind}
                            element={stations[route.unload]}
                            schema='locations'
                            showEdit={false}
                            style={{cursor: 'pointer', background: 'white', height: '5rem'}}

                            onClick={() => {onMove(route.unload, moveQuantity); setShowRouteSelector(false)}}
                        />
                    ))}
                    </>
                </styled.BodyContainer>
            </styled.ModalContainer>
        )
    }, [routeOptions, showRouteSelector])

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
            {renderRouteSelectorModal}
            <styled.LotBodyContainer>
                <styled.LotHeader>
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
                    handleMoveClicked={() => onMoveClicked()}
                    handleCancel={() => onBack()}
                    handleFinish={() => setShowFinish(true)}
                    isFinish={routeOptions.length === 0}
                    quantity={moveQuantity}
                    setQuantity={setMoveQuantity}
                    maxQuantity={currentLot.bins[stationID]?.count}
                    minQuantity={1}
                    //route={currentTask}
                    disabled = {!processes[cards[lotID]?.process_id]?.showFinish}
                />
            </styled.LotButtonContainer>
            {showFinish &&
                renderFinishQuantity()
            }

        </styled.LotContainer>
    )

}

export default DashboardLotPage
