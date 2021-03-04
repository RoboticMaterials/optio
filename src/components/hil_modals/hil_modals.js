import React, { useState, useMemo, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { useTimer } from 'react-timer-hook'

import * as styled from './hil_modals.style';
import useWindowSize from '../../hooks/useWindowSize'

// Import Components
import Textbox from '../basic/textbox/textbox'
import HILSuccess from './hil_modals_content/hil_success'
import DropDownSearch from "../basic/drop_down_search_v2/drop_down_search";
import DropDownSearchField from "../basic/form/drop_down_search_field/drop_down_search_field";
import Button from "../basic/button/button";

// Import Actions
import { postTaskQueue, putTaskQueue, deleteTaskQueueItem } from '../../redux/actions/task_queue_actions'
import { postEvents } from '../../redux/actions/events_actions'
import { getTasks } from '../../redux/actions/tasks_actions'
import {setShowModalId} from '../../redux/actions/task_queue_actions'

// Import API
import { putTaskQueueItem } from '../../api/task_queue_api'

// Import Utils
import { deepCopy } from '../../methods/utils/utils'
import { getCards } from "../../redux/actions/card_actions";
import { sortBy } from "../../methods/utils/card_utils";
import { SORT_MODES } from "../../constants/common_contants";
import Lot from "../side_bar/content/cards/lot/lot";
import { getRouteProcesses, getLoadStationId } from "../../methods/utils/route_utils";
import {getLotTemplateData, getLotTotalQuantity, getMatchesFilter} from "../../methods/utils/lot_utils";
import {getLotTemplates} from "../../redux/actions/lot_template_actions";
import LotSortBar from "../side_bar/content/cards/lot_sort_bar/lot_sort_bar";
import LotFilterBar from "../side_bar/content/cards/lot_filter_bar/lot_filter_bar";
import {LOT_FILTER_OPTIONS, SORT_DIRECTIONS} from "../../constants/lot_contants";
import {
    BarsContainer,
    columnCss,
    containerCss,
    descriptionCss,
    dropdownCss,
    reactDropdownSelectCss,
    valueCss
} from "../side_bar/content/cards/lot_bars.style";


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
    const dispatchGetCards = () => dispatch(getCards())
    const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())
    const dispatchTaskQueueItemClicked = (id) => dispatch({ type: 'TASK_QUEUE_ITEM_CLICKED', payload: id })
    const disptachHILResponse = (response) => dispatch({ type: 'HIL_RESPONSE', payload: response })
    const disptachPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))
    const dispatchSetActiveHilDashboards = (active) => dispatch({ type: 'ACTIVE_HIL_DASHBOARDS', payload: active })
    const dispatchLocalHumanTask = (bol) => dispatch({ type: 'LOCAL_HUMAN_TASK', payload: bol })
    const dispatchSetShowModalId = (id) => dispatch(setShowModalId(id))

    const hilTimers = useSelector(state => { return state.taskQueueReducer.hilTimers })
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const tasks = useSelector(state => { return state.tasksReducer.tasks })
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const activeHilDashboards = useSelector(state => state.taskQueueReducer.activeHilDashboards)
    const taskQueueItemClicked = useSelector(state => state.taskQueueReducer.taskQueueItemClicked)
    const dashboardOpen = useSelector(state => state.dashboardsReducer.dashboardOpen)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards) || {}
    const objects = useSelector(state => state.objectsReducer.objects)
    const cards = useSelector(state => state.cardsReducer.cards)
    const showModalId = useSelector(state => state.taskQueueReducer.showModalID)

    const [quantity, setQuantity] = useState(taskQuantity)
    const [selectedTask, setSelectedTask] = useState(null)
    const [associatedTask, setAssociatedTask] = useState(null)
    const [trackQuantity, setTrackQuantity] = useState(null)
    const [selectedLot, setSelectedLot] = useState(null)
    const [isProcessTask, setIsProcessTask] = useState(true)
    const [availableLots, setAvailableLots] = useState([])
    const [selectedDashboard, setSelectedDashboard] = useState(null)
    const [showLotSelector, setShowLotSelector] = useState(false)
    const [didDisplayLots, setDidDisplayLots] = useState(false)
    const [didSelectInitialLot, setDidSelectInitialLot] = useState(false)
    const [hilLoadUnload, setHilLoadUnload] = useState('')
    const [dataLoaded, setDataLoaded] = useState(false)
    const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState('')
    const [changeQtyMouseHold, setChangeQtyMouseHold] = useState('')

    const [lotsAtStation, setLotsAtStation] = useState(false)
    const [taskHasProcess, setTaskHasProcess] = useState(false)
    const [noLotsSelected, setNoLotsSelected] = useState(false)
    const [modalClosed, setModalClosed] = useState(false)

    const [sortMode, setSortMode] = useState(LOT_FILTER_OPTIONS.name)
    const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.ASCENDING)
    const [lotFilterValue, setLotFilterValue] = useState('')
    const [ selectedFilterOption, setSelectedFilterOption ] = useState(LOT_FILTER_OPTIONS.name)
    const size = useWindowSize()
    const windowWidth = size.width

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

    // if number of available lots >= 5, auto focus lot filter text box
    useEffect(() => {
        if (availableLots.length >= 5) {
            setShouldFocusLotFilter(true)
        }
    }, [availableLots.length])

    // load lot data on load for selecting lot
    useEffect(() => {
        // get dashboard info from item
        const dashboard = dashboards[dashboardId]
        setSelectedDashboard(dashboard)
    }, [dashboards])

    // handles initial display of lot selector
    useEffect(() => {

        const currentTask = tasks[item.task_id]
        const routeProcesses = getRouteProcesses(currentTask?._id).map((currProcess) => currProcess._id) || []

        //If the task doesn't belong to a process, skip the lot selector screen and go straight to HIL modal
        if (!!routeProcesses[0]) {
            setTrackQuantity(currentTask.track_quantity)
            setTaskHasProcess(true)
            // Only show lot selector if they're cards loaded, lots have not been dispalyed yet, it's a load hil and there's available lots
            if (!didDisplayLots && hilLoadUnload && hilLoadUnload !== 'unload') {
                setShowLotSelector(true)
                setDidDisplayLots(true)
            }
        }

        else {
            setSelectedLot(null) // clear selected lot
            setShowLotSelector(false) // hide lot selector
            setTrackQuantity(true)
        }


    }, [availableLots, didDisplayLots, hilLoadUnload, isProcessTask])

    /*
    * Get dropdownsearch options for cards
    *
    * Filter out cards that don't belong to the same station
    * Each option only needs to contain the lot's id and a label to display, the extaneous information can be left out
    *
    * */
    useEffect(() => {

        const taskProcesses = getRouteProcesses(selectedTask?._id).map((currProcess) => currProcess._id)

        if ((taskProcesses && Array.isArray(taskProcesses) && (taskProcesses.length > 0))) {
            setIsProcessTask(true)

            let stationCards = Object.values(cards)
                .filter((currCard) => {
                    const {
                        bins,
                        process_id: currCardProcessId
                    } = currCard || {}

                    if (bins) {
                        if (bins[loadStationId] && bins[loadStationId].count > 0 && (taskProcesses.includes(currCardProcessId))) return true
                    }
                })
                .map((currCard) => {
                    const {
                        bins
                    } = currCard || {}

                    return {
                        ...currCard,
                        count: bins[loadStationId].count
                    }
                })

            console.log("hil modal stationCards",stationCards)

            if (sortMode) {
                sortBy(stationCards, sortMode, sortDirection)
            }

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




    }, [cards, selectedTask, sortMode, sortDirection])

    useEffect(() => {
        if (count && quantity && (quantity > count)) setQuantity(parseInt(count))


    }, [selectedLot])

    // Changes quantity on Mouse hold
    useEffect(() => {
        const interval = setInterval(() => {

            switch (changeQtyMouseHold) {
                case 'decrementTen':
                    if (count) {
                        if (quantity > count) {
                            // quantity should not exceed count, it may have been set higher before a lot was selected
                            // reduce quantity to lot count
                            setQuantity(count)
                        }
                        else {
                            // quantity cannot be negative
                            if (quantity - 10 > 0) setQuantity(quantity => quantity - 10)
                        }
                    }
                    else {
                        // quantity cannot be negative
                        if (quantity - 10 > 0) setQuantity(quantity => quantity - 10)
                    }

                    break;

                case 'decrementOne':
                    if (count) {
                        if (quantity > count) {
                            // quantity should not exceed count, it may have been set higher before a lot was selected
                            // reduce quantity to lot count
                            setQuantity(count)
                        }
                        else {
                            // quantity cannot be negative
                            if (quantity > 0) setQuantity(quantity => quantity - 1)
                        }
                    }
                    else {
                        // quantity cannot be negative
                        if (quantity > 0) setQuantity(quantity => quantity - 1)
                    }

                    break;

                case 'incrementOne':
                    if (count) {
                        if (quantity < count) {
                            setQuantity(quantity => quantity + 1)
                        }

                        else {
                            setQuantity(count)
                        }

                    }
                    // otherwise quantity can be anything
                    else {
                        setQuantity(quantity => quantity + 1)
                    }

                    break;

                case 'incrementTen':
                    if (count) {
                        if (quantity + 10 < count) {
                            setQuantity(quantity => quantity + 10)
                        }
                        else {
                            setQuantity(parseInt(count))
                        }

                    }
                    // otherwise quantity can be anything
                    else {
                        setQuantity(quantity => quantity + 10)
                    }
            }

        }, 200);
        return () => clearInterval(interval)
    }, [changeQtyMouseHold]
    )



    // Use Effect for when page loads, handles wether the HIL is a load or unload
    useEffect(() => {
        dispatchGetCards()
        dispatchGetLotTemplates()

        const currentTask = tasks[item.task_id]
        setSelectedTask(currentTask)
        if (currentTask) {
            if (!!currentTask.associated_task) setAssociatedTask(tasks[currentTask.associated_task])
        }

        // If the task's load location of the task q item matches the item's location then its a load hil, else its unload
        if (currentTask && currentTask?.load?.station === item.hil_station_id || !!item.dashboard) {
            // load
            setHilLoadUnload('load')
            setShowLotSelector(true)
        } else {
            // unload
            setHilLoadUnload('unload')
        }


        setDataLoaded(true)
        // On unmount, set the task q item to none
        return () => {
            dispatchTaskQueueItemClicked('')
            // dispatchLocalHumanTask(null)
        }

    }, [])

    useEffect(() => {

        if (!!item.quantity) {
            setQuantity(item.quantity)
        } else {
            if (!!selectedLot) {
                setQuantity(selectedLot.bins[loadStationId].count)
            }
            else { setQuantity(0) }
        }

    }, [selectedLot], [tasks])

    useEffect(() => {
        const currentTask = tasks[item.task_id]
        const routeProcesses = getRouteProcesses(currentTask?._id).map((currProcess) => currProcess._id) || []


        //If the route is part of a process and at least 1 lot is present display the
        //fraction or quantity modal depending on what was chosen during route creation
        //Else display quantity HIL
        if (!!routeProcesses[0]) {
            Object.values(cards).map((card) => {

                if (!!card.bins[getLoadStationId(currentTask)]) {
                    setLotsAtStation(true)

                }
            })
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
            // If track quantity then add quantity, or if noLotSelected then use quantity
            if (!!selectedTask.track_quantity || !!noLotsSelected) {
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


    const onBlurQuantityInput = () => {
        if (quantity > count) {
            setQuantity(count)
        }
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
            <>
                {windowWidth < 700 ?
                    <>
                        {taskHasProcess && //If the task isn't part of a process don't render the choose lot stuff on the HIL
                            <styled.SelectedLotContainer style={{ flexDirection: 'column', paddingBottom: '1rem' }}>

                                {selectedLot ?
                                    <styled.LotTitleDescription style={{ fontSize: '1.5rem' }}>Selected Lot:</styled.LotTitleDescription>
                                    :
                                    <styled.FooterButton
                                        onClick={() => {
                                            setShowLotSelector(true)
                                            setNoLotsSelected(false)
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
                        }
                    </>
                    :
                    <>
                        {taskHasProcess && //If the task isn't part of a process don't render the choose lot stuff on the HIL
                            <styled.SelectedLotContainer>

                                {selectedLot ?
                                    <styled.LotTitleDescription>Selected Lot:</styled.LotTitleDescription>
                                    :
                                    <styled.FooterButton
                                        onClick={() => {
                                            setShowLotSelector(true)
                                            setNoLotsSelected(false)
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
                        }
                    </>}
            </>
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
                            !!hilTimers[item._id] && hilLoadUnload === 'load' &&
                            <styled.HilTimer>{hilTimers[item._id]}</styled.HilTimer>
                        }
                    </styled.ColumnContainer>

                </styled.Header>

                <styled.LotSelectorContainer>
                    <styled.LotsContainer>

                        <styled.HilButton color={'#90eaa8'}
                            onClick={() => {
                                onHilSuccess()
                                dispatchSetShowModalId(null)
                                setModalClosed(true)

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

                    <styled.ColumnContainer>
                        <styled.HilMessage>{hilMessage}</styled.HilMessage>
                        {/* Only Showing timers on load at the moment, will probably change in the future */}
                        {
                            !!hilTimers[item._id] && hilLoadUnload === 'load' &&
                            <styled.HilTimer>{hilTimers[item._id]}</styled.HilTimer>
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
                                        dispatchSetShowModalId(null)
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

                            {renderSelectedLot()}

                            <styled.FooterButton style={{ marginBottom: '1rem', marginTop: "1rem", marginLeft: '1rem' }} color={'#ff9898'}
                                  onClick={()=> {
                                    onHilFailure()
                                    dispatchSetShowModalId(null)
                                    setModalClosed(true)
                                  }}>
                                <styled.HilIcon
                                    style={{ marginBottom: 0, marginRight: "1rem", fontSize: "2.5rem" }}
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

                    <styled.ColumnContainer>
                        <styled.HilMessage>{hilMessage}</styled.HilMessage>


                        {/* Only Showing timers on load at the moment, will probably change in the future */}
                        {
                            !!hilTimers[item._id] && hilLoadUnload === 'load' &&
                            <styled.HilTimer>{hilTimers[item._id]}</styled.HilTimer>
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

                                        {windowWidth > 590 &&
                                            <styled.HilInputIconContainer
                                                onClick={() => {

                                                    if (count) {
                                                        if (quantity > count) {
                                                            // quantity should not exceed count, it may have been set higher before a lot was selected
                                                            // reduce quantity to lot count
                                                            setQuantity(count)
                                                        }
                                                        else {
                                                            // quantity cannot be negative
                                                            if (quantity - 10 >= 0) setQuantity(quantity - 10)
                                                            else { setQuantity(0) }
                                                        }
                                                    }
                                                    else {
                                                        // quantity cannot be negative
                                                        if (quantity - 10 >= 0) setQuantity(quantity - 10)
                                                        else { setQuantity(0) }

                                                    }

                                                }}
                                                onMouseDown={() => {
                                                    setChangeQtyMouseHold('decrementTen')
                                                }}
                                                onMouseUp={() => {
                                                    setChangeQtyMouseHold('')
                                                }}
                                            >
                                                <styled.HilInputIcon
                                                    className='fas fa-minus-circle'
                                                    style={{ color: '#ff9898' }}
                                                />
                                                <styled.HilInputIconText style={{ color: '#ff9898' }}>10</styled.HilInputIconText>
                                            </styled.HilInputIconContainer>
                                        }

                                        <styled.HilInputIconContainer
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

                                            onMouseDown={() => {
                                                setChangeQtyMouseHold('decrementOne')
                                            }}
                                            onMouseUp={() => {
                                                setChangeQtyMouseHold('')
                                            }}
                                        >
                                            {

                                            }      <styled.HilInputIcon
                                                className='fas fa-minus-circle'
                                                style={{ color: '#ff9898' }}
                                            />
                                            <styled.HilInputIconText style={{ color: '#ff9898' }}>1</styled.HilInputIconText>
                                        </styled.HilInputIconContainer>


                                        <styled.HilInput
                                            type="number"
                                            onChange={(e) => {
                                                // get value and parse to int to avoid string concat instead of addition / subtraction
                                                const value = parseInt(e.target.value)

                                                // if there is a lot with a count, the quantity cannot exceed the count
                                                //  if (count) {
                                                //    if (value <= count)
                                                //}

                                                // otherwise the value can be anything
                                                //else {
                                                setQuantity(value)
                                                //}
                                            }}
                                            value={quantity}
                                            style={quantity > count ? { backgroundColor: 'red' } : {}}
                                            onBlur={onBlurQuantityInput}
                                        />
                                        <styled.HilInputIconContainer
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

                                            onMouseDown={() => {
                                                setChangeQtyMouseHold('incrementOne')
                                            }}
                                            onMouseUp={() => {
                                                setChangeQtyMouseHold('')
                                            }}
                                        >
                                            <styled.HilInputIcon
                                                className='fas fa-plus-circle'
                                                style={{ color: '#90eaa8' }}
                                            />
                                            <styled.HilInputIconText style={{ color: '#90eaa8' }}>1</styled.HilInputIconText>
                                        </styled.HilInputIconContainer>

                                        {windowWidth > 590 &&
                                            <styled.HilInputIconContainer
                                                onClick={() => {
                                                    // if there is a lot count, quantity cannot exceed lot count
                                                    if (count) {
                                                        if (quantity + 10 < count) {
                                                            setQuantity(quantity + 10)
                                                        }

                                                        // quantity is greater than count (probably was set before lot was selected), reduce to count
                                                        else {
                                                            setQuantity(parseInt(count))
                                                        }

                                                    }
                                                    // otherwise quantity can be anything
                                                    else {
                                                        setQuantity(quantity + 10)
                                                    }

                                                }}
                                                onMouseDown={() => {
                                                    setChangeQtyMouseHold('incrementTen')
                                                }}
                                                onMouseUp={() => {
                                                    setChangeQtyMouseHold('')
                                                }}
                                            >
                                                <styled.HilInputIcon
                                                    className='fas fa-plus-circle'
                                                    style={{ color: '#90eaa8' }}
                                                />
                                                <styled.HilInputIconText style={{ color: '#90eaa8' }}>10</styled.HilInputIconText>
                                            </styled.HilInputIconContainer>
                                        }

                                    </styled.HilInputContainer>
                                    {renderSelectedLot()}
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
                                    dispatchSetShowModalId(null)
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
                                  <></>
                                //<styled.HilButton color={'#f7cd89'} onClick={onHilPostpone}>
                                //    <styled.HilIcon
                                //        style={{}}
                                        // onClick={onHilPostpone}
                                //        className='icon-postpone'
                                  //      color={'#ff7700'}
                                  //      styled={{ marginTop: '.5rem' }}
                                  //  />
                                  //  <styled.HilButtonText
                                  //      color={'#ff7700'}
                                  //      style={{ margin: 0, padding: 0 }}
                                  //  >
                                  //      Postpone
                              //  </styled.HilButtonText>
                              //  </styled.HilButton>
                            }

                            {(hilType === 'pull' || hilType === 'push') && hilLoadUnload === 'load' &&

                                <styled.HilButton
                                color={'#ff9898'}
                                onClick={()=> {
                                        onHilFailure()
                                        dispatchSetShowModalId(null)
                                        setModalClosed(true)
                                      }}>
                                    <styled.HilIcon
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
                <styled.Header style={{ flexDirection: "column" }}>
                    <styled.HeaderMainContent>

                        <styled.ColumnContainer>
                            <styled.HilMessage>Select Lot</styled.HilMessage>
                        </styled.ColumnContainer>

                    </styled.HeaderMainContent>

                    <BarsContainer>
                        <LotSortBar
                            columnCss={columnCss}
                            containerCss={containerCss}
                            descriptionCss={descriptionCss}
                            dropdownCss={dropdownCss}
                            valueCss={valueCss}
                            reactDropdownSelectCss={reactDropdownSelectCss}
                            sortMode={sortMode}
                            setSortMode={setSortMode}
                            sortDirection={sortDirection}
                            setSortDirection={setSortDirection}
                        />
                        <LotFilterBar
                            columnCss={columnCss}
                            containerCss={containerCss}
                            descriptionCss={descriptionCss}
                            dropdownCss={dropdownCss}
                            valueCss={valueCss}
                            reactDropdownSelectCss={reactDropdownSelectCss}
                            shouldFocusLotFilter={shouldFocusLotFilter}
                            setLotFilterValue={setLotFilterValue}
                            selectedFilterOption={selectedFilterOption}
                            setSelectedFilterOption={setSelectedFilterOption}
                        />
                    </BarsContainer>
                </styled.Header>
                <styled.LotSelectorContainer>

                    {availableLots.length > 0 ?
                        <styled.LotsContainer>

                            {availableLots
                                .filter((currLot) => {
                                    return getMatchesFilter(currLot, lotFilterValue, selectedFilterOption)
                                })
                                .map((currLot, lotIndex) => {
                                    const {
                                        _id: lotId,
                                        name,
                                        object_id,
                                        cardId,
                                        start_date,
                                        end_date,
                                        bins = {},
                                        flags,
                                        lotNumber,
                                        process_id: processId = "",
                                        lotTemplateId
                                    } = currLot

                                    const process = processes[processId]
                                    const {
                                        name: processName
                                    } = process || {}

                                    const totalQuantity = getLotTotalQuantity({bins})

                                    const count = bins[stationId]?.count

                                    const isSelected = selectedLotId === lotId
                                    const templateValues = getLotTemplateData(lotTemplateId, currLot)

                                    // const lotName = lots[lot_id] ? lots[lot_id].name : null
                                    const objectName = objects[object_id] ? objects[object_id].name : null

                                    return (
                                        <styled.CardContainer>
                                            <Lot
                                                templateValues={templateValues}
                                                totalQuantity={totalQuantity}
                                                lotNumber={lotNumber}
                                                processName={processName}
                                                flags={flags || []}
                                                enableFlagSelector={false}
                                                name={name}
                                                start_date={start_date}
                                                end_date={end_date}
                                                objectName={objectName}
                                                count={count}
                                                id={lotId}
                                                index={lotIndex}
                                                isSelected={isSelected}
                                                selectable={!!selectedLotId}
                                                onClick={() => {
                                                    // set selected lot and close lot selector
                                                    setSelectedLot(currLot)
                                                    setShowLotSelector(false)
                                                }}
                                                containerStyle={{ marginBottom: "0.5rem" }}
                                            />
                                        </styled.CardContainer>
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
                            color={'#90eaa8'}
                            onClick={() => {
                                setSelectedLot(null) // clear selected lot
                                setNoLotsSelected(true)
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

                        <styled.FooterButton
                            color={'#ff9898'}
                            onClick={()=> {
                              onHilFailure()
                              dispatchSetShowModalId(null)
                              setModalClosed(true)
                            }}
                        >
                            <styled.HilIcon
                                className='fas fa-times'
                                color={'#ff1818'}
                                style={{ marginRight: '0.8rem' }}
                            />
                            <styled.HilButtonText
                                style={{ margin: 0, padding: 0 }}
                                color={'#ff1818'}
                            >
                                {"Cancel"}
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

    if (dataLoaded && modalClosed!==true) {
        return (
            <styled.HilContainer >

                {/*<styled.HilBorderContainer >*/}

                {
                    showLotSelector ?
                        renderLotSelector()
                        :
                        !!selectedTask && hilLoadUnload === 'load' ?
                            trackQuantity !== true && lotsAtStation === true && noLotsSelected !== true ?
                                renderFractionOptions()
                                :
                                renderQuantityOptions()

                            :
                            renderUnloadOptions()
                }




                {/*</styled.HilBorderContainer>*/}

            </styled.HilContainer>
        )
    }
    else {
        return null
    }
}

export default HILModals
