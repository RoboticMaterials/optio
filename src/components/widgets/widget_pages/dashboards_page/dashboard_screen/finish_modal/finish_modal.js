import React, { useEffect, useState } from "react";

// external components
import Modal from 'react-modal';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom'


// actions
import { getCards, getProcessCards, putCard } from "../../../../../../redux/actions/card_actions";

// styles
import * as styled from './finish_modal.style'
import { useTheme } from "styled-components";
import { getProcesses } from "../../../../../../redux/actions/processes_actions";
import Textbox from "../../../../../basic/textbox/textbox";
import { SORT_MODES } from "../../../../../../constants/common_contants";
import { sortBy } from "../../../../../../methods/utils/card_utils";
import Lot from "../../../../../side_bar/content/cards/lot/lot";
import {getCustomFields, getLotTotalQuantity, getMatchesFilter} from "../../../../../../methods/utils/lot_utils";
import Card from "../../../../../side_bar/content/cards/lot/lot";
import QuantityModal from "../../../../../basic/modals/quantity_modal/quantity_modal";
import { quantityOneSchema } from "../../../../../../methods/utils/form_schemas";
import { getLotTemplates } from "../../../../../../redux/actions/lot_template_actions";
import LotSortBar from "../../../../../side_bar/content/cards/lot_sort_bar/lot_sort_bar";
import LotFilterBar from "../../../../../side_bar/content/cards/lot_filter_bar/lot_filter_bar";
import { LOT_FILTER_OPTIONS, SORT_DIRECTIONS } from "../../../../../../constants/lot_contants";
import SortFilterContainer from "../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container";
import * as taskQueueActions from "../../../../../../redux/actions/task_queue_actions";
import {DEVICE_CONSTANTS} from "../../../../../../constants/device_constants";
import {CUSTOM_TASK_ID} from "../../../../../../constants/route_constants";
import {deepCopy} from "../../../../../../methods/utils/utils";
import {putTaskQueue} from "../../../../../../redux/actions/task_queue_actions";

Modal.setAppElement('body');

const FinishModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit,

        // If there is already a lot selected, then dont show selection screen
        lotSelected,
    } = props

    // get current buttons, default to empty array
    const dashboardId = dashboard?._id?.$oid

    const params = useParams()
    const theme = useTheme()

    const {
        stationID,
        dashboardID,
        subPage,
        lotID
    } = params || {}

    const dispatch = useDispatch()
    // const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
    const dispatchGetCards = () => dispatch(getCards())
    const dispatchGetProcesses = () => dispatch(getProcesses())
    const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())
    const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
    const dispatchHandlePostTaskQueue = async (props) => await dispatch(taskQueueActions.handlePostTaskQueue(props))
    const disptachPutTaskQueue = async (item, id) => await dispatch(putTaskQueue(item, id))

    const finishEnabledDashboard = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardId] })
    const processCards = useSelector(state => { return state.cardsReducer.processCards })
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const routes = useSelector(state => { return state.tasksReducer.tasks }) || {}
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)
    const serverSettings = useSelector(state => state.settingsReducer.settings)

    const [selectedLot, setSelectedLot] = useState(lotSelected ? processCards[lotID] : null)
    const [lotCount, setLotCount] = useState(null)
    const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState(false)
    const [showQuantitySelector, setShowQuantitySelector] = useState(lotSelected)
    const [submitting, setSubmitting] = useState(false)
    const [availableKickOffCards, setAvailableKickOffCards] = useState([])

    const [sortMode, setSortMode] = useState(LOT_FILTER_OPTIONS.name)
    const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.ASCENDING)
    const [lotFilterValue, setLotFilterValue] = useState('')
    const [selectedFilterOption, setSelectedFilterOption] = useState(LOT_FILTER_OPTIONS.name)

    const isButtons = availableKickOffCards.length > 0

    const stationId = dashboard.station

    const onButtonClick = async (lot) => {
        setShowQuantitySelector(true)

        // extract card attributes
        const {
            bins,
        } = lot

        // extract first station's bin and queue bin from bins
        const {
            [stationId]: currentStationBin,
        } = bins || {}

        const currentStationBinCount = currentStationBin?.count ? currentStationBin.count : 0

        setLotCount(currentStationBinCount)
        setSelectedLot(lot)
    }

    /*
    * handles the logic for when a kick-off button is pressed
    *
    * When a kick-off button is pressed, the lot is to be moved from the queue of the current process it resides in
    * to the first station in the process
    *
    * This is done by updating the cards station_id and route_id to those of the first station in the first route
    * */
    const moveLot = async (card, quantity) => {

        let requestSuccessStatus = false
        let message

        // extract lot attributes
        const {
            name: cardName,
            _id: lotId,
        } = card

        if(quantity && quantity > 0) {

            // moving lot is handled through custom task
            const custom = {
                load: {
                    station: stationId,
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
            const result = await dispatchHandlePostTaskQueue({ hil_response: null, tasks, deviceType: DEVICE_CONSTANTS.HUMAN, taskQueue, Id: CUSTOM_TASK_ID, custom })

            // check if request was successful
            if(!(result instanceof Error)) {

                const {
                    _id,
                    dashboardID,
                    dashboard,
                    ...rest
                } = result || {}

                // now must update task queue item to move the lot
                setTimeout(async () =>  {

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
            }
        }

        else {
            message = "Quantity must be greater than 0"
        }

        onSubmit(cardName, requestSuccessStatus, quantity, message)
        setSubmitting(false)
        close()
    }


    /*
    * renders an array of buttons for each kick off lot
    * */
    const renderKickOffButtons = () => {
        return availableKickOffCards
            .filter((currLot) => {
                const {
                    name: currLotName,
                    bins = {},
                } = currLot || {}

                const count = bins[stationId]?.count
                return getMatchesFilter({
                    ...currLot,
                    quantity: count
                }, lotFilterValue, selectedFilterOption)
            })
            .map((currCard, cardIndex) => {
                const {
                    _id: lotId,
                    // count = 0,
                    name,
                    start_date,
                    end_date,
                    flags,
                    lotNumber,
                    bins = {},
                    process_id: processId = "",
                    lotTemplateId
                } = currCard

                const process = processes[processId]
                const {
                    name: processName
                } = process || {}

                const count = bins[stationId]?.count
                const totalQuantity = getLotTotalQuantity({bins})
                const templateValues = getCustomFields(lotTemplateId, currCard)

                return (
                    <Lot
                        totalQuantity={totalQuantity}
                        templateValues={templateValues}
                        flags={flags || []}
                        processName={processName}
                        lotNumber={lotNumber}
                        enableFlagSelector={false}
                        name={name}
                        start_date={start_date}
                        end_date={end_date}
                        // objectName={objectName}
                        count={count}
                        id={lotId}
                        index={cardIndex}
                        onClick={() => {
                            onButtonClick(currCard)
                        }}
                        containerStyle={{ marginBottom: "0.5rem", width: "80%", margin: '.5rem auto .5rem auto' }}
                    />
                )
            })
    }

    /**
     * When modal is opened, get all cards associated with the processes
     *
     *
     */
    useEffect(() => {
        dispatchGetCards()
        dispatchGetProcesses()
        dispatchGetLotTemplates()
    }, [])

    /**
     * Get the cards actually available for kick off
     *
     * For a lot to be available for kick off, it must have at least 1 item in the 'queue' bin
     *
     * This function creates a temporary array for storing kick off cards as it checks each lot of each process associated with the station
     *
     * This function loops through every lot belonging to a process that the current station is the first station of
     * Each lot's bins attribute is checked to see if it contains any items in the "QUEUE" bin
     *
     * if a lot is found to have items in the "QUEUE" bin, it is added to the list of kick off cards
     *
     * finally, local state variable availableKickOffCards is set to the list of kick off cards for later use
     *
     */
    useEffect(() => {
        var tempAvailableCards = []

        if (finishEnabledDashboard && Array.isArray(finishEnabledDashboard)) finishEnabledDashboard.forEach((currProcessId) => {
            const currProcessCards = processCards[currProcessId]

            var filteredCards = []
            if (currProcessCards) filteredCards = Object.values(currProcessCards).filter((currCard) => {
                if (currCard.bins && currCard.bins[stationId]) return true
            })
                .map((currCard) => {
                    return {
                        ...currCard,
                        count: currCard.bins[stationId].count
                    }
                })
            tempAvailableCards = tempAvailableCards.concat(filteredCards)
        })

        if (sortMode) {
            sortBy(tempAvailableCards, sortMode, sortDirection)
        }

        setAvailableKickOffCards(tempAvailableCards)

    }, [processCards, sortMode, sortDirection])

    // if number of available lots >= 5, auto focus lot filter text box
    useEffect(() => {
        if (availableKickOffCards.length >= 5) {
            setShouldFocusLotFilter(true)
        }
    }, [availableKickOffCards.length])

    if (showQuantitySelector) {
        return (
            <QuantityModal
                validationSchema={quantityOneSchema}
                maxValue={lotCount}
                minValue={1}
                infoText={`${lotCount} items available.`}
                isOpen={true}
                title={"Select Quantity"}
                onRequestClose={() => setShowQuantitySelector(false)}
                onCloseButtonClick={() => setShowQuantitySelector(false)}
                handleOnClick2={(quantity) => {
                    setShowQuantitySelector(false)
                    moveLot(selectedLot, quantity)
                }}
                handleOnClick1={() => {
                    setShowQuantitySelector(false)
                }}
                button_2_text={"Confirm"}
                button_1_text={"Cancel"}
            />
        )
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
                content: {

                }
            }}
        >
            <styled.Header>
                <styled.HeaderMainContentContainer>
                    <styled.Title>{title}</styled.Title>
                    <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={close} />
                </styled.HeaderMainContentContainer>

                <SortFilterContainer
                    lotFilterValue={lotFilterValue}
                    sortMode={sortMode}
                    setSortMode={setSortMode}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    shouldFocusLotFilter={shouldFocusLotFilter}
                    setLotFilterValue={setLotFilterValue}
                    selectedFilterOption={selectedFilterOption}
                    setSelectedFilterOption={setSelectedFilterOption}
                    multipleFilters = {serverSettings.enableMultipleLotFilters}
                />
            </styled.Header>

            <styled.BodyContainer>
                <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <styled.ContentContainer>
                        <styled.ReportButtonsContainer isButtons={isButtons}>
                            {isButtons ?
                                renderKickOffButtons()
                                :
                                <styled.NoButtonsText>No available lots.</styled.NoButtonsText>
                            }

                        </styled.ReportButtonsContainer>
                    </styled.ContentContainer>
                </div>
            </styled.BodyContainer>
        </styled.Container>
    );
};

FinishModal.defaultProps = {
    lotSelected: false,
}

export default FinishModal
