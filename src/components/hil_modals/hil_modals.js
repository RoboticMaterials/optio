import React, { useState, useMemo, useEffect, useRef } from 'react';

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
import { setShowModalId } from '../../redux/actions/task_queue_actions'

// Import API
import { putTaskQueueItem } from '../../api/task_queue_api'

// Import Utils
import { deepCopy } from '../../methods/utils/utils'
import { getCards } from "../../redux/actions/card_actions";
import {getInitialValues, sortBy} from "../../methods/utils/card_utils";
import { SORT_MODES } from "../../constants/common_contants";
import Lot from "../side_bar/content/cards/lot/lot";
import { getRouteProcesses, getLoadStationId } from "../../methods/utils/route_utils";
import {getBinQuantity, getLotTemplateData, getLotTotalQuantity, getMatchesFilter} from "../../methods/utils/lot_utils";
import { getLotTemplates } from "../../redux/actions/lot_template_actions";
import LotSortBar from "../side_bar/content/cards/lot_sort_bar/lot_sort_bar";
import LotFilterBar from "../side_bar/content/cards/lot_filter_bar/lot_filter_bar";
import {CONTENT, defaultBins, LOT_FILTER_OPTIONS, SORT_DIRECTIONS} from "../../constants/lot_contants";
import {
    BarsContainer,
    columnCss,
    containerCss,
    descriptionCss,
    dropdownCss,
    reactDropdownSelectCss,
    valueCss
} from "../side_bar/content/cards/lot_bars.style";
import SortFilterContainer from "../side_bar/content/cards/sort_filter_container/sort_filter_container";
import HilLotItem from "./hil_lot_item/hil_lot_item";
import {CARD_SCHEMA_MODES, getCardSchema} from "../../methods/utils/form_schemas";
import {Formik} from "formik";
import LotContainer from "../side_bar/content/cards/lot/lot_container";
import {immutableDelete, isNonEmptyArray} from "../../methods/utils/array_utils";
import HilButton from "./hil_button/hil_button";
import NumberField from "../basic/form/number_field/number_field";


export const QUANTITY_MODES = {
    QUANTITY: "QUANTITY",
    FRACTION: "FRACTION"
}

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

    const params = useParams()
    const dashboardID = params.dashboardID

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
    const [showQuantitySelector, setShowQuantitySelector] = useState(false)
    const [activeLotIndex, setActiveLotIndex] = useState(null)
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
    const [selectedFilterOption, setSelectedFilterOption] = useState(LOT_FILTER_OPTIONS.name)
    const size = useWindowSize()
    const windowWidth = size.width

    const formRef = useRef(null)
    const {
        current
    } = formRef || {}

    const {
        values = {},
        touched = {},
        errors = {},
        status = {},
        setValues = () => { },
        setErrors = () => { },
        resetForm = () => { },
        setTouched = () => { },
        setFieldValue = () => { },
        setStatus = () => { },
    } = current || {}
    const {
        lots: selectedLots = []
    } = values || {}

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
            setFieldValue(`lots`, []) // clear selected lot
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

            if (sortMode) {
                sortBy(stationCards, sortMode, sortDirection)
            }

            if (stationCards && Array.isArray(stationCards) && stationCards.length > 0) {
                if ((stationCards.length === 1) && !isNonEmptyArray(selectedLots) && !didSelectInitialLot) {
                    // setSelectedLots([stationCards[0]])
                    setFieldValue(`lots[0]`, {
                        lot: stationCards[0],
                        quantity: 0
                    })
                    setDidSelectInitialLot(true)
                }
                setAvailableLots(stationCards)
            }
        }

        else {
            // setIsProcessTask(false)
        }




    }, [cards, selectedTask, sortMode, sortDirection])

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

            // Deletes the dashboard id from active list for the hil that has been responded too
            const activeHilCopy = deepCopy(activeHilDashboards)
            delete activeHilCopy[dashboardID]
            dispatchSetActiveHilDashboards(activeHilCopy)
        }

    }, [])

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
            lots: []
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
        const activeHilCopy = deepCopy(activeHilDashboards)
        delete activeHilCopy[dashboardID]
        dispatchSetActiveHilDashboards(activeHilCopy)

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
            <>
                {windowWidth < 700 ?
                    <>
                        {taskHasProcess && //If the task isn't part of a process don't render the choose lot stuff on the HIL
                            <styled.SelectedLotContainer style={{ flexDirection: 'column', paddingBottom: '1rem' }}>

                                {isNonEmptyArray(selectedLots) ?
                                    <styled.LotTitleDescription style={{ fontSize: '1.5rem' }}>Selected Lot:</styled.LotTitleDescription>
                                    :
                                    <div>temp</div>
                                    // <styled.FooterButton
                                    //     onClick={() => {
                                    //         setShowLotSelector(true)
                                    //         setNoLotsSelected(false)
                                    //     }}
                                    // >
                                    //
                                    //     <styled.LotTitleDescription>Select Lot</styled.LotTitleDescription>
                                    // </styled.FooterButton>
                                }

                                {isNonEmptyArray(selectedLots) &&
                                    <styled.SelectedLotName>
                                    </styled.SelectedLotName>
                                }
                            </styled.SelectedLotContainer>
                        }
                    </>
                    :
                    <>
                        {taskHasProcess && //If the task isn't part of a process don't render the choose lot stuff on the HIL
                            <styled.SelectedLotContainer>

                                {isNonEmptyArray(selectedLots) ?
                                    <styled.LotTitleDescription>Selected Lot:</styled.LotTitleDescription>
                                    :
                                    <div></div>
                                    // <styled.FooterButton
                                    //     onClick={() => {
                                    //         setShowLotSelector(true)
                                    //         setNoLotsSelected(false)
                                    //     }}
                                    // >
                                    //
                                    //     <styled.LotTitleDescription>Select Lot</styled.LotTitleDescription>
                                    // </styled.FooterButton>
                                }

                                {isNonEmptyArray(selectedLots) &&
                                    <styled.SelectedLotName>

                                    </styled.SelectedLotName>
                                }
                            </styled.SelectedLotContainer>
                        }
                    </>}
            </>
        )
    }

    const renderUnloadOptions = () => {
        console.log("renderUnloadOptions")
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

    const renderFractionOptions = (index) => {
        console.log("renderFractionOptions")

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
                                <HilButton
                                    color={'#90eaa8'}
                                    label={`${value} (Quantity ${Math.ceil(2 * decimal)})`}
                                    filter={Math.cbrt(eval(value))}
                                    onClick={() => {
                                        setFieldValue(`lots${index}`, {
                                            ...selectedLots[index],
                                            fraction: value
                                        })
                                    }}
                                />
                            )
                        })}

                    </styled.LotsContainer>

                    {(hilType === 'pull' || hilType === 'push') && hilLoadUnload === 'load' &&
                        <styled.FooterContainer>

                            {renderSelectedLot()}

                            {/*<styled.FooterButton style={{ marginBottom: '1rem', marginTop: "1rem", marginLeft: '1rem' }} color={'#ff9898'}*/}
                            {/*    onClick={() => {*/}
                            {/*        onHilFailure()*/}
                            {/*        dispatchSetShowModalId(null)*/}
                            {/*        setModalClosed(true)*/}
                            {/*    }}>*/}
                            {/*    <styled.HilIcon*/}
                            {/*        style={{ marginBottom: 0, marginRight: "1rem", fontSize: "2.5rem" }}*/}
                            {/*        className='fas fa-times'*/}
                            {/*        color={'#ff1818'}*/}
                            {/*    />*/}
                            {/*    <styled.HilButtonText style={{ margin: 0, padding: 0 }} color={'#ff1818'}>Cancel</styled.HilButtonText>*/}
                            {/*</styled.FooterButton>*/}
                        </styled.FooterContainer>
                    }


                </styled.LotSelectorContainer>
            </>
        )


    }


    const getIsSelected = (lotId) => {
        for(const currItem of selectedLots) {
            const {
                lot: currLot
            } = currItem || {}
            const {
                _id: currLotId
            } = currLot

            if(currLotId === lotId) return true
        }

        return false
    }

    const getSelectedLotIndex = (lot) => {
        const {
            _id: lotId
        } = lot || {}

        const index = selectedLots.findIndex((currItem) => {
            const {
                lot: currLot
            } = currItem || {}
            const {
                _id: currLotId
            } = currLot || {}

            return lotId === currLotId
        })

        return index
    }


    const renderLotSelector = () => {
        console.log("oh boy")
        return (
            <>
                <styled.Header style={{ flexDirection: "column" }}>
                    <styled.HeaderMainContent>

                        <styled.ColumnContainer>
                            <styled.HilMessage>Select Lot</styled.HilMessage>
                        </styled.ColumnContainer>

                    </styled.HeaderMainContent>

                    <SortFilterContainer
                        sortMode={sortMode}
                        setSortMode={setSortMode}
                        sortDirection={sortDirection}
                        setSortDirection={setSortDirection}
                        shouldFocusLotFilter={shouldFocusLotFilter}
                        setLotFilterValue={setLotFilterValue}
                        selectedFilterOption={selectedFilterOption}
                        setSelectedFilterOption={setSelectedFilterOption}
                    />
                </styled.Header>
                <styled.LotSelectorContainer>

                    {availableLots.length > 0 ?
                        <styled.RealLotsContainer>

                            {availableLots
                                .filter((currLot) => {
                                    const {
                                        bins = {},
                                    } = currLot

                                    const count = bins[stationId]?.count

                                    return getMatchesFilter({
                                        ...currLot,
                                        quantity: count
                                    }, lotFilterValue, selectedFilterOption)
                                })
                                .map((currLot, lotIndex) => {
                                    const {
                                        _id: lotId,
                                        process_id: processId = "",
                                    } = currLot



                                    const isSelected = getIsSelected(lotId)

                                    return (
                                        <styled.CardContainer>
                                            <LotContainer
                                                lotId={lotId}
                                                binId={stationId || loadStationId}
                                                processId={processId}
                                                isSelected={isSelected}
                                                selectable={!!isNonEmptyArray(selectedLots)}
                                                onClick={() => {
                                                    const existingIndex = getSelectedLotIndex(currLot) // check if lot is already selected
                                                    if(existingIndex === -1) {
                                                        setFieldValue(`lots`, [
                                                            ...values.lots,
                                                            {
                                                                lot: currLot,
                                                                quantity: 0
                                                            }
                                                        ])
                                                        // setShowLotSelector(false)
                                                    }
                                                    else {
                                                        setFieldValue(`lots`, immutableDelete(selectedLots, existingIndex))
                                                    }
                                                }}
                                                containerStyle={{ marginBottom: "0.5rem" }}
                                            />
                                        </styled.CardContainer>
                                    )
                                })
                            }
                        </styled.RealLotsContainer>

                        :
                        <styled.NoLotsContainer>
                            <styled.NoLotsText>No lots available</styled.NoLotsText>
                        </styled.NoLotsContainer>
                    }

                    <styled.FooterContainer>
                        <HilButton
                            containerCss={styled.footerButtonCss}
                            label={"Continue Without Lot"}
                            onClick={() => {
                                // setFieldValue(`lots`, []) // clear selected lot
                                setNoLotsSelected(true)
                                setShowLotSelector(false) // hide lot selector
                            }}
                            color={'#90eaa8'}
                            textColor={'#1c933c'}
                        />

                        <HilButton
                            containerCss={styled.footerButtonCss}
                            label={"Cancel"}
                            onClick={() => {
                                onHilFailure()
                                dispatchSetShowModalId(null)
                                setModalClosed(true)
                            }}
                            color={'#ff9898'}
                            iconColor={'#ff1818'}
                            iconName={'fas fa-times'}
                            textColor={'#ff1818'}
                        />
                    </styled.FooterContainer>
                </styled.LotSelectorContainer>
            </>
        )
    }

    const renderLots = () => {

        return (
            <styled.RealLotsContainer>
                {selectedLots.map((currItem, currIndex) => {
                    const {
                        lot: currLot,
                        quantity: currQuantity,
                        fraction
                    } = currItem || {}
                    const {
                        _id: lotId,
                        process_id: processId = "",
                    } = currLot


                    return (
                        <HilLotItem
                            onMinusClick={() => {
                                setFieldValue("lots", immutableDelete(selectedLots, currIndex))
                            }}
                            onQuantityClick={() => {
                                setShowQuantitySelector(true)
                                setActiveLotIndex(currIndex)
                            }}
                            quantityMode={trackQuantity ? QUANTITY_MODES.QUANTITY : QUANTITY_MODES.FRACTION}
                            name={`lots[${currIndex}]`}
                            lotId={lotId}
                            binId={stationId || loadStationId}
                            processId={processId}
                            selectedQuantity={currQuantity}
                            fraction={fraction}
                        />
                    )
                })}
            </styled.RealLotsContainer>
        )

    }

    const renderStuff = () => {

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
                        {renderLots()}
                    </styled.LotsContainer>

                    <styled.HilButtonContainer>

                        <HilButton
                            label={"Add Lots"}
                            color={'#34baeb'}
                            iconName={'fas fa-plus'}
                            iconColor={'#1c933c'}
                            textColor={'#1c933c'}
                            onClick={() => {
                                setShowLotSelector(true)
                                // onHilSuccess()
                                // dispatchSetShowModalId(null)
                            }}
                        />

                        <HilButton
                            label={"Confirm"}
                            color={'#90eaa8'}
                            iconName={'fas fa-check'}
                            iconColor={'#1c933c'}
                            textColor={'#1c933c'}
                            onClick={() => {
                                onHilSuccess()
                                dispatchSetShowModalId(null)
                            }}
                        />

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

                            <HilButton
                                color={'#ff9898'}
                                iconName={'fas fa-times'}
                                iconColor={'#ff1818'}
                                label={"Cancel"}
                                textColor={'#ff1818'}
                                onClick={() => {
                                    onHilFailure()
                                    dispatchSetShowModalId(null)
                                    setModalClosed(true)
                                }}
                            />

                        }

                    </styled.HilButtonContainer>
                </styled.LotSelectorContainer>
            </>
        )
    }

    const renderQuantitySelector = () => {
        const activeItem = selectedLots[activeLotIndex]
        const {
            lot: activeLot,
            quantity: activeLotQuantity,
            fraction: activeLotFraction
        } = activeItem || {}

        const {
            _id: lotId,
            process_id: processId = "",
        } = activeLot

        const maxValue = getBinQuantity(activeLot, stationId || loadStationId)

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
                    <styled.LotsContainer style={{
                        justifyContent: "space-around"
                    }}>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                alignSelf: "stretch"
                            }}
                        >
                        <styled.SubtitleContainer>
                            <styled.HilSubtitleMessage>Current Lot</styled.HilSubtitleMessage>
                        </styled.SubtitleContainer>
                        <LotContainer
                            lotId={lotId}
                            binId={stationId || loadStationId}
                            processId={processId}
                            containerStyle={{ marginBottom: "0.5rem", alignSelf: "stretch" }}
                        />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}
                        >
                            <styled.SubtitleContainer>
                                <styled.HilSubtitleMessage>Enter Quantity</styled.HilSubtitleMessage>
                            </styled.SubtitleContainer>

                            <NumberField
                                minValue={0}
                                maxValue={maxValue}
                                name={`lots[${activeLotIndex}].quantity`}
                            />

                            <styled.RowContainer style={{
                                marginTop: "1rem"
                            }}>
                                <styled.InfoText>{`There are ${maxValue} items available in the current lot.`}</styled.InfoText>
                            </styled.RowContainer>
                        </div>

                    </styled.LotsContainer>

                    <styled.HilButtonContainer>

                        <HilButton
                            label={"Continue"}
                            color={'#90eaa8'}
                            iconName={'fas fa-check'}
                            iconColor={'#1c933c'}
                            textColor={'#1c933c'}
                            onClick={() => {
                                setShowQuantitySelector(false)
                            }}
                        />
                    </styled.HilButtonContainer>
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

    if (dataLoaded && modalClosed !== true) {
        return (
            <Formik
                innerRef={formRef}
                initialValues={{
                    lots: []
                }}
                validateOnChange={true}
                validateOnBlur={true}
                onSubmit={()=>{}} // this is necessary
            >


            <styled.HilContainer >

                {/*<styled.HilBorderContainer >*/}

                {showQuantitySelector ?
                    renderQuantitySelector()
                    :
                    showLotSelector ?
                        renderLotSelector()
                        :
                        !!selectedTask && hilLoadUnload === 'load' ?
                            trackQuantity !== true && lotsAtStation === true && noLotsSelected !== true ?
                                renderFractionOptions()
                                :
                                renderStuff()

                            :
                            renderUnloadOptions()
                }




                {/*</styled.HilBorderContainer>*/}

            </styled.HilContainer>
            </Formik>
        )
    }
    else {
        console.log("ELLLLSSSEEE")
        return null
    }
}

export default HILModals
