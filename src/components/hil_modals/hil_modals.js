import React, { useState, useMemo, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './hil_modals.style';

// Import Components
import Textbox from '../basic/textbox/textbox'
import HILSuccess from './hil_modals_content/hil_success'

// Import Actions
import { postTaskQueue, putTaskQueue } from '../../redux/actions/task_queue_actions'
import { postEvents } from '../../redux/actions/events_actions'

// Import API
import { putTaskQueueItem } from '../../api/task_queue_api'

// Import Utils
import { deepCopy } from '../../methods/utils/utils'
import DropDownSearch from "../basic/drop_down_search_v2/drop_down_search";
import { getCards } from "../../redux/actions/card_actions";
import DropDownSearchField from "../basic/form/drop_down_search_field/drop_down_search_field";
import Button from "../basic/button/button";


/**
 * Handles what type of HIL to display depending on the status
 */
const HILModals = (props) => {

    const {
        hilMessage,
        hilType,
        taskQuantity,
        taskQueueID,
        item
    } = props

    const {
        dashboard: dashboardId
    } = item || {}

    const dispatch = useDispatch()
    const dispatchPostTaskQueue = (response) => dispatch(postTaskQueue(response))
    const dispatchGetCards = () => dispatch(getCards())
    const dispatchTaskQueueItemClicked = (id) => dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })
    const disptachHILResponse = (response) => dispatch({ type: 'HIL_RESPONSE', payload: response })
    const disptachPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))
    const dispatchSetActiveHilDashboards = (active) => dispatch({ type: 'ACTIVE_HIL_DASHBOARDS', payload: active })
    const dispatchPostEvents = (event) => dispatch(postEvents)
    const dispatchLocalHumanTask = (bol) => dispatch({ type: 'LOCAL_HUMAN_TASK', payload: bol })



    const hilTimers = useSelector(state => { return state.taskQueueReducer.hilTimers })
    const tasks = useSelector(state => { return state.tasksReducer.tasks })
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const activeHilDashboards = useSelector(state => state.taskQueueReducer.activeHilDashboards)
    const taskQueueItemClicked = useSelector(state => state.taskQueueReducer.taskQueueItemClicked)
    const dashboardOpen = useSelector(state => state.dashboardsReducer.dashboardOpen)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards) || {}
    const objects = useSelector(state => state.objectsReducer.objects)
    const cards = useSelector(state => state.cardsReducer.cards)

    const [quantity, setQuantity] = useState(taskQuantity)
    const [selectedTask, setSelectedTask] = useState(null)
    const [associatedTask, setAssociatedTask] = useState(null)
    const [selectedLot, setSelectedLot] = useState(null)
    const [isProcessTask, setIsProcessTask] = useState(true)
    const [availableLots, setAvailableLots] = useState([])
    const [selectedDashboard, setSelectedDashboard] = useState(null)
    const [cardsLoaded, setCardsLoaded] = useState([false])
    const [showLotSelector, setShowLotSelector] = useState(false)
    const [didDisplayLots, setDidDisplayLots] = useState(false)
    const [didSelectInitialLot, setDidSelectInitialLot] = useState(false)
    const [hilLoadUnload, setHilLoadUnload] = useState('')

    const {
        name: dashboardName,
        station: stationId, //"c754a665-f756-4c74-a7c5-e8c014039ba3"
    } = selectedDashboard || {}

    const currentTask = tasks[item.task_id]

    const {
        type,
        load,
        unload
    } = currentTask || {}

    const {
        station: unloadStationId
    } = unload || {}

    const {
        station: loadStationId
    } = load || {}

    const {
        name: selectedLotName,
        _id: selectedLotId,
        bins
    } = selectedLot || {}

    const currentBin = bins ? bins[loadStationId] : {}
    const {
        count
    } = currentBin || {}

    // If the qty goes below 0, then set to 0. You can never send negative parts
    if (quantity < 0) {
        setQuantity(0)
    }

    // load card data on load for selecting lot
    useEffect(() => {
        dispatchGetCards()
        setCardsLoaded(true)
    }, [])

    // load card data on load for selecting lot
    useEffect(() => {
        // get dashboard info from item
        const dashboard = dashboards[dashboardId]
        setSelectedDashboard(dashboard)
    }, [dashboards])

    // handles initial display of lot selector
    useEffect(() => {

        // Only show lot selector is they're cards loaded, lots have not been dispalyed yet, it's a load hil and there's available lots
        if (cardsLoaded && !didDisplayLots && hilLoadUnload !== 'unload' && isProcessTask) {
            setShowLotSelector(true)
            setDidDisplayLots(true)
        }

    }, [cardsLoaded, availableLots, didDisplayLots, hilLoadUnload, isProcessTask])

    /*
    * Get dropdownsearch options for cards
    *
    * Filter out cards that don't belong to the same station
    * Each option only needs to contain the card's id and a label to display, the extaneous information can be left out
    *
    * */
    useEffect(() => {

        if(
            (selectedTask && selectedTask.processes && Array.isArray(selectedTask.processes ) && (selectedTask.processes.length > 0)) ||
            (associatedTask && associatedTask.processes && Array.isArray(associatedTask.processes ) && (associatedTask.processes.length > 0))
        ) {
            setIsProcessTask(true)
            const taskProcesses = selectedTask.processes
            const associatedsTaskProcess = associatedTask.processes

            const stationCards = Object.values(cards).filter((currCard) => {
                const {
                    bins,
                    process_id: currCardProcessId
                } = currCard || {}

                if (bins) {
                    if (bins[loadStationId] && bins[loadStationId].count > 0 && (taskProcesses.includes(currCardProcessId) || associatedsTaskProcess).includes(currCardProcessId)) return true
                }

            })

            if (stationCards && Array.isArray(stationCards) && stationCards.length > 0) {
                if ((stationCards.length === 1) && !selectedLot && !didSelectInitialLot) {
                    setSelectedLot(stationCards[0])
                    setDidSelectInitialLot(true)
                }
                setAvailableLots(stationCards)
            }
        }

        else {
            // setIsProcessTask(false)
        }




    }, [cards, selectedTask])

    useEffect(() => {
        if (count && quantity && (quantity > count)) setQuantity(parseInt(count))


    }, [selectedLot])

    // Use Effect for when page loads, handles wether the HIL is a load or unload
    useEffect(() => {

        const currentTask = tasks[item.task_id]
        setSelectedTask(currentTask)

        if(currentTask) {
            if(currentTask.associated_task) setAssociatedTask(tasks[currentTask.associated_task])
        }

        // If the task's load location of the task q item matches the item's location then its a load hil, else its unload
        if (currentTask && currentTask?.load?.station === item.hil_station_id || !!item.dashboard) {
            // load
            setHilLoadUnload('load')
        } else {
            // unload
            setHilLoadUnload('unload')
        }

        if (!!item.quantity) {
            setQuantity(item.quantity)
        } else {
            setQuantity(0)
        }

        // On unmount, set the task q item to none
        return () => {
            dispatchTaskQueueItemClicked('')
            dispatchLocalHumanTask(false)
        }

    }, [tasks])

    // Posts HIL Success to API
    const onHilSuccess = async (fraction) => {


        dispatchTaskQueueItemClicked('')

        let newItem = {
            ...item,
            hil_response: true,
            lot_id: selectedLotId
        }

        // If its a load, then add a quantity to the response
        if (hilLoadUnload === 'load') {
            // If track quantity then add quantity
            if (!!selectedTask.track_quantity) {
                newItem.quantity = quantity
            }

            // Else it's a fraction so tell the fraction amount
            else {
                newItem.fraction = fraction
            }
        }

        // Deletes the dashboard id from active list for the hil that has been responded too
        dispatchSetActiveHilDashboards(delete (activeHilDashboards[item.hil_station_id]))

        const ID = deepCopy(taskQueueID)

        delete newItem._id
        delete newItem.dashboard

        // This is used to make the tap of the HIL button respond quickly
        disptachHILResponse(hilLoadUnload === 'load' ? 'load' : 'unload')
        setTimeout(() => disptachHILResponse(''), 2000)

        await disptachPutTaskQueue(newItem, ID)

        // onLogHumanEvent()
    }

    // Posts HIL Postpone to API
    // HIL Postpone will place the current task after the next task in the queue. (Delays task by 1 task)
    const onHilPostpone = () => {
        dispatchTaskQueueItemClicked('')
    }

    // Posts HIL Failure to API
    const onHilFailure = async () => {

        let newItem = {
            ...item,
            hil_response: false
        }
        delete newItem._id
        await putTaskQueueItem(newItem, taskQueueID)

        dispatchTaskQueueItemClicked('')
    }

    // Posts event to back end for stats and tracking
    const onLogHumanEvent = () => {

        let event = {
            object: null,
            outgoing: false,
            quantity: 0,
            station: null,
            time: null,
        }

        //Get the time
        const time = Date.now() / 1000
        const object = tasks[item.task_id].obj
        const station = item.hil_station_id

        let eventQuantity = 0
        if (!!item.quantity) {
            eventQuantity = item.quantity
        } else {
            eventQuantity = quantity
        }

        let outgoing = null
        if (hilLoadUnload === 'load') {
            outgoing = true
        } else if (hilLoadUnload === 'unload') {
            outgoing = false
        } else (
            outgoing = 'Unknown'
        )

        event.time = time
        event.object = object
        event.station = station
        event.quantity = eventQuantity
        event.outgoing = outgoing

        // dispatchPostEvents(event)
    }

    const renderSelectedLot = () => {
        return (
            <styled.SelectedLotContainer>
                {selectedLot ?
                    <styled.LotTitleDescription>Selected Lot:</styled.LotTitleDescription>
                    :
                    <styled.FooterButton
                        onClick={() => {
                            setShowLotSelector(true)
                        }}
                    >
                        <styled.LotTitleDescription>Select Lot</styled.LotTitleDescription>
                    </styled.FooterButton>
                }

                {(selectedLot) &&
                <styled.SelectedLotName>
                    {selectedLotName &&
                    <styled.LotTitleName>{selectedLotName}</styled.LotTitleName>
                    }
                    {!showLotSelector &&
                    <styled.EditLotIcon
                        className="fas fa-edit"
                        onClick={() => {
                            setShowLotSelector(true)
                        }}
                    />
                    }
                </styled.SelectedLotName>
                }
            </styled.SelectedLotContainer>
        )
    }

    const renderUnloadOptions = () => {
        return (
            <>
                <styled.Header>

                    <styled.ColumnContainer>
                        <styled.HilMessage>{hilMessage}</styled.HilMessage>
                        {/* Only Showing timers on load at the moment, will probably change in the future */}
                        {
                            !!hilTimers[item._id.$oid] && hilLoadUnload === 'load' &&
                            <styled.HilTimer>{hilTimers[item._id.$oid]}</styled.HilTimer>
                        }
                    </styled.ColumnContainer>

                </styled.Header>

                <styled.LotSelectorContainer>
                    <styled.LotsContainer>

                        <styled.HilButton color={'#90eaa8'}
                                          onClick={() => {
                                              onHilSuccess()
                                          }}
                        >
                            <styled.HilIcon
                                className='fas fa-check'
                                color={'#1c933c'}
                            />
                            {/* <styled.HilButtonText color={'#1c933c'}>1</styled.HilButtonText> */}
                        </styled.HilButton>

                    </styled.LotsContainer>
                </styled.LotSelectorContainer>
            </>
        )
    }

    const renderFractionOptions = () => {

        const fractionOptions = ['1', '3/4', '1/2', '1/4']
        const fractionDecimals = ['1', '0.75', '0.5', '0.25']

        return (
            <>
                <styled.Header>

                    {!!taskQueueItemClicked &&
                    <styled.HilExitModal
                        className='fas fa-times'
                        onClick={() => dispatchTaskQueueItemClicked('')}
                    />
                    }


                    <styled.ColumnContainer>
                        <styled.HilMessage>{hilMessage}</styled.HilMessage>
                        {/* Only Showing timers on load at the moment, will probably change in the future */}
                        {
                            !!hilTimers[item._id.$oid] && hilLoadUnload === 'load' &&
                            <styled.HilTimer>{hilTimers[item._id.$oid]}</styled.HilTimer>
                        }
                    </styled.ColumnContainer>

                    {/* <styled.InvisibleItem /> */}

                </styled.Header>

                <styled.LotSelectorContainer>

                    <styled.LotsContainer>
                        <styled.SubtitleContainer>
                            <styled.HilSubtitleMessage>Select a fraction:</styled.HilSubtitleMessage>
                        </styled.SubtitleContainer>


                        {fractionOptions.map((value, ind) => {
                            const decimal = fractionDecimals[ind]
                            return (
                                <styled.HilButton
                                    color={'#90eaa8'}
                                    filter={Math.cbrt(eval(value))}
                                    onClick={() => {
                                        onHilSuccess(eval(value))
                                    }}
                                >
                                    {/* <styled.HilIcon
                                className='fas fa-check'
                                color={'#1c933c'}
                            /> */}
                                    <styled.RowContainer>
                                        <styled.HilButtonText style={{ fontSize: '3rem' }} color={'#1c933c'}>{value}</styled.HilButtonText>
                                        {!!count &&
                                        <styled.HilButtonQuantityText color={'#1c933c'}>{'(Quantity ' + Math.ceil(count * decimal) + ')'}</styled.HilButtonQuantityText>
                                        }

                                    </styled.RowContainer>
                                </styled.HilButton>
                            )
                        })}

                    </styled.LotsContainer>

                    {(hilType === 'pull' || hilType === 'push') && hilLoadUnload === 'load' &&
                    <styled.FooterContainer>


                        {isProcessTask && renderSelectedLot()}

                        <styled.FooterButton style={{ margin: 0, marginTop: "1rem" }} color={'#ff9898'} onClick={onHilFailure}>
                            <styled.HilIcon
                                style={{ margin: 0, marginRight: "1rem", fontSize: "2.5rem" }}
                                className='fas fa-times'
                                color={'#ff1818'}
                            />
                            <styled.HilButtonText style={{ margin: 0, padding: 0 }} color={'#ff1818'}>Cancel</styled.HilButtonText>
                        </styled.FooterButton>
                    </styled.FooterContainer>
                    }


                </styled.LotSelectorContainer>
            </>
        )


    }

    const renderQuantityOptions = () => {

        return (
            <>

                <styled.Header>

                    {!!taskQueueItemClicked &&
                    <styled.HilExitModal
                        className='fas fa-times'
                        onClick={() => dispatchTaskQueueItemClicked('')}
                    />
                    }


                    <styled.ColumnContainer>
                        <styled.HilMessage>{hilMessage}</styled.HilMessage>


                        {/* Only Showing timers on load at the moment, will probably change in the future */}
                        {
                            !!hilTimers[item._id.$oid] && hilLoadUnload === 'load' &&
                            <styled.HilTimer>{hilTimers[item._id.$oid]}</styled.HilTimer>
                        }
                    </styled.ColumnContainer>

                    {/* <styled.InvisibleItem /> */}

                </styled.Header>

                <styled.LotSelectorContainer>

                    <styled.LotsContainer style={{ justifyContent: hilLoadUnload === 'load' && "space-between" }}>



                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            {
                                (hilType === 'pull' || hilType === 'push') && hilLoadUnload === 'load' &&
                                <>
                                    <styled.HilMessage style={{ marginBottom: '1rem' }}>Enter Quantity</styled.HilMessage>

                                    <styled.HilInputContainer>


                                        <styled.HilInputIcon
                                            className='fas fa-minus-circle'
                                            styled={{ color: '#ff1818' }}
                                            onClick={() => {

                                                if (count) {
                                                    if (quantity > count) {
                                                        // quantity should not exceed count, it may have been set higher before a lot was selected
                                                        // reduce quantity to lot count
                                                        setQuantity(count)
                                                    }
                                                    else {
                                                        // quantity cannot be negative
                                                        if (quantity > 0) setQuantity(quantity - 1)
                                                    }
                                                }
                                                else {
                                                    // quantity cannot be negative
                                                    if (quantity > 0) setQuantity(quantity - 1)
                                                }

                                            }}
                                        />

                                        <styled.HilInput
                                            type="number"
                                            onChange={(e) => {
                                                // get value and parse to int to avoid string concat instead of addition / subtraction
                                                const value = parseInt(e.target.value)

                                                // if there is a lot with a count, the quantity cannot exceed the count
                                                if (count) {
                                                    if (value <= count) setQuantity(value)
                                                }

                                                // otherwise the value can be anything
                                                else {
                                                    setQuantity(value)
                                                }
                                            }}
                                            value={quantity}
                                        />

                                        <styled.HilInputIcon
                                            className='fas fa-plus-circle'
                                            styled={{ color: '#1c933c' }}
                                            onClick={() => {
                                                // if there is a lot count, quantity cannot exceed lot count
                                                if (count) {
                                                    if (quantity < count) {
                                                        setQuantity(quantity + 1)
                                                    }

                                                    // quantity is greater than count (probably was set before lot was selected), reduce to count
                                                    else {
                                                        setQuantity(parseInt(count))
                                                    }

                                                }
                                                // otherwise quantity can be anything
                                                else {
                                                    setQuantity(quantity + 1)
                                                }

                                            }}
                                        />


                                    </styled.HilInputContainer>
                                    {isProcessTask && renderSelectedLot()}
                                </>

                            }


                            {count &&
                            <styled.HilSubText style={{ marginBottom: "1rem" }}>Available Lot Items: {count}</styled.HilSubText>
                            }
                        </div>

                        <styled.HilButtonContainer>

                            <styled.HilButton
                                color={'#90eaa8'}
                                onClick={() => {
                                    onHilSuccess()
                                }}
                            >
                                <styled.HilIcon
                                    // onClick={() => {
                                    //     onHilSuccess()
                                    // }}
                                    style={{ margin: 0, marginRight: "1rem", fontSize: "2.5rem" }}
                                    className='fas fa-check'
                                    color={'#1c933c'}

                                />
                                <styled.HilButtonText
                                    color={'#1c933c'}
                                    style={{ margin: 0, padding: 0 }}
                                >
                                    Confirm
                                </styled.HilButtonText>
                            </styled.HilButton>

                            {((hilType === 'pull' && hilLoadUnload === 'load') || hilType === 'check') &&
                            <styled.HilButton color={'#f7cd89'} onClick={onHilPostpone}>
                                <styled.HilIcon
                                    style={{}}
                                    // onClick={onHilPostpone}
                                    className='icon-postpone'
                                    color={'#ff7700'}
                                    styled={{ marginTop: '.5rem' }}
                                />
                                <styled.HilButtonText
                                    color={'#ff7700'}
                                    style={{ margin: 0, padding: 0 }}
                                >
                                    Postpone
                                </styled.HilButtonText>
                            </styled.HilButton>
                            }

                            {(hilType === 'pull' || hilType === 'push') && hilLoadUnload === 'load' &&

                            <styled.HilButton color={'#ff9898'} onClick={onHilFailure}>
                                <styled.HilIcon
                                    // onClick={onHilFailure}
                                    className='fas fa-times'
                                    color={'#ff1818'}
                                />
                                <styled.HilButtonText color={'#ff1818'}>Cancel</styled.HilButtonText>
                            </styled.HilButton>
                            }

                        </styled.HilButtonContainer>
                    </styled.LotsContainer>
                </styled.LotSelectorContainer>
            </>
        )
    }


    const renderLotSelector = () => {
        return (
            <>
                <styled.Header>

                    {!!taskQueueItemClicked &&
                    <styled.HilExitModal
                        className='fas fa-times'
                        onClick={() => dispatchTaskQueueItemClicked('')}
                    />
                    }


                    <styled.ColumnContainer>
                        <styled.HilMessage>Select Lot</styled.HilMessage>
                    </styled.ColumnContainer>

                    {/* <styled.InvisibleItem /> */}

                </styled.Header>
                <styled.LotSelectorContainer>

                    {availableLots.length > 0 ?
                        <styled.LotsContainer>

                            {availableLots.map((currLot) => {
                                const {
                                    name,
                                    _id: lotId,
                                    bins
                                } = currLot

                                const isSelected = selectedLotId === lotId

                                return (
                                    <styled.LotButton
                                        isSelected={isSelected}
                                        color={'orange'}
                                        schema={"lots"}
                                        onClick={() => {
                                            // set selected lot and close lot selector
                                            setSelectedLot(currLot)
                                            setShowLotSelector(false)
                                        }}
                                    >

                                        {/*{isSelected &&*/}
                                        {/*    <styled.DeselectLotIcon*/}
                                        {/*        className='fas fa-times-circle'*/}
                                        {/*        onClick={(e) => {*/}
                                        {/*            e.stopPropagation()*/}
                                        {/*            e.preventDefault()*/}
                                        {/*            setSelectedLot(null)*/}
                                        {/*        }}*/}
                                        {/*    />*/}
                                        {/*}*/}
                                        <styled.LotButtonText isSelected={isSelected}
                                                              color={'#32a897'}>{name}</styled.LotButtonText>
                                    </styled.LotButton>
                                )
                            })
                            }
                        </styled.LotsContainer>

                        :
                        <styled.NoLotsContainer>
                            <styled.NoLotsText>No lots available</styled.NoLotsText>
                        </styled.NoLotsContainer>
                    }

                    <styled.FooterContainer>
                        <styled.FooterButton
                            style={{ margin: 0 }}
                            color={'#90eaa8'}
                            onClick={() => {
                                setSelectedLot(null) // clear selected lot
                                setShowLotSelector(false) // hide lot selector
                            }}
                        >
                            <styled.HilButtonText
                                style={{ margin: 0, padding: 0 }}
                                color={'#1c933c'}
                            >
                                {"Continue Without Lot"}
                            </styled.HilButtonText>
                        </styled.FooterButton>
                    </styled.FooterContainer>




                </styled.LotSelectorContainer>
            </>
        )
    }

    /**
     * Conditioinally renders HIL Modal based on type.
     *
     * Type 1: HIL Load Pull
     * This type requires a quantity input, success, postpone, and cancel
     * Requires a postpone becauses if someone requests (pulls) a object without
     * the person loading being ready, they should be able to postopen until they are ready
     *
     * Type 2: HIL Load Push
     * This type requires a quantity input, success and cancel
     * No postpone because you're pushing objects to the next location.
     * Meaning that your objects should be ready since you said they were
     *
     * Type 3: HIL Unload
     * This type requires just a success button
     * No Cancel, postpone or quantity button.
     * Quantity is already taken care of in the load section, no objects should be lost in transportation.
     * No postpone becasue your objects are already on the cart and ready to be taken off, plus the cart cant be used while objects are on it
     * No cancel becasue the cart cant be used with objects on it
     *
     * Type 4: HIL Check
     * This type requires a Yes of postpone button
     * The purpose of a HIL check is to make sure the operator is ready to deliver parts.
     * HIL Check will only show on a pull request
     */

    return (
        <styled.HilContainer >

            {/*<styled.HilBorderContainer >*/}

            {
                showLotSelector ?
                    renderLotSelector()
                    :
                    !!selectedTask && hilLoadUnload === 'load' ?
                        selectedTask.track_quantity ?
                            renderQuantityOptions()
                            :
                            renderFractionOptions()

                        :
                        renderUnloadOptions()
            }




            {/*</styled.HilBorderContainer>*/}

        </styled.HilContainer>
    )
}

export default HILModals
