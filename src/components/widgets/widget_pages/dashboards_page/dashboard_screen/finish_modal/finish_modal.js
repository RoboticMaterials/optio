import React, {useEffect, useState} from "react";

// external components
import Modal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";

// internal components
import Button from "../../../../../basic/button/button";
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// actions
import {getCards, getProcessCards, putCard} from "../../../../../../redux/actions/card_actions";

// styles
import * as styled from './finish_modal.style'
import {useTheme} from "styled-components";
import {getProcesses} from "../../../../../../redux/actions/processes_actions";
import Textbox from "../../../../../basic/textbox/textbox";
import {SORT_MODES} from "../../../../../../constants/common_contants";
import {sortBy} from "../../../../../../methods/utils/card_utils";
import Lot from "../../../../../side_bar/content/cards/lot/lot";
import {getLotTemplateData, getLotTotalQuantity, getMatchesFilter} from "../../../../../../methods/utils/lot_utils";
import Card from "../../../../../side_bar/content/cards/lot/lot";
import QuantityModal from "../../../../../basic/modals/quantity_modal/quantity_modal";
import {quantityOneSchema} from "../../../../../../methods/utils/form_schemas";
import {getLotTemplates} from "../../../../../../redux/actions/lot_template_actions";
import LotSortBar from "../../../../../side_bar/content/cards/lot_sort_bar/lot_sort_bar";
import LotFilterBar from "../../../../../side_bar/content/cards/lot_filter_bar/lot_filter_bar";
import {LOT_FILTER_OPTIONS, SORT_DIRECTIONS} from "../../../../../../constants/lot_contants";
import SortFilterContainer from "../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container";

Modal.setAppElement('body');

const FinishModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit
    } = props

    // get current buttons, default to empty array
    const dashboardId = dashboard?._id?.$oid

    const theme = useTheme()

    const dispatch = useDispatch()
    // const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
    const dispatchGetCards = () => dispatch(getCards())
    const dispatchGetProcesses = () => dispatch(getProcesses())
    const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())
    const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))

    const finishEnabledDashboard = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardId] })
    const processCards = useSelector(state => { return state.cardsReducer.processCards })
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const routes = useSelector(state => { return state.tasksReducer.tasks }) || {}


    const [selectedLot, setSelectedLot] = useState(null)
    const [lotCount, setLotCount] = useState(null)
    const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState(false)
    const [showQuantitySelector, setShowQuantitySelector] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [availableKickOffCards, setAvailableKickOffCards] = useState([])

    const [sortMode, setSortMode] = useState(LOT_FILTER_OPTIONS.name)
    const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.ASCENDING)
    const [lotFilterValue, setLotFilterValue] = useState('')
    const [ selectedFilterOption, setSelectedFilterOption ] = useState(LOT_FILTER_OPTIONS.name)

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
            bins,
            name: cardName,
            process_id,
            _id: cardId,
        } = card

        if(quantity && quantity > 0) {
            // extract first station's bin and queue bin from bins
            const {
                [stationId]: currentStationBin,
                ["FINISH"]: finishBin,
                ...unalteredBins
            } = bins || {}

            const queueBinCount = finishBin?.count ? finishBin.count : 0
            const currentStationBinCount = currentStationBin?.count ? currentStationBin.count : 0

            // udpated card will maintain all of the cards previous attributes with the station_id and route_id updated
            let updatedCard = {
                ...card,                                // spread unaltered attributes
                bins: {
                    ...unalteredBins,                   // spread unaltered bins
                    ["FINISH"]: {
                        ...finishBin,              // spread unaltered attributes of station bin if it exists
                        count: parseInt(queueBinCount) + parseInt(quantity)    // increment first station's count by the count of the queue
                    }
                },
            }

            if(quantity < currentStationBinCount) {
                updatedCard = {
                    ...updatedCard,
                    bins: {
                        ...updatedCard.bins,
                        [stationId]:  {
                            ...currentStationBin,
                            count: parseInt(currentStationBinCount) - parseInt(quantity)
                        }
                    }
                }
            }

            // send update action
            const result = await onPutCard(updatedCard, cardId)

            // check if request was successful
            if(!(result instanceof Error)) {
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
                const templateValues = getLotTemplateData(lotTemplateId, currCard)

                return(
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
                        onClick={()=>{
                            onButtonClick(currCard)
                        }}
                        containerStyle={{marginBottom: "0.5rem", width: "80%", margin: '.5rem auto .5rem auto'}}
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

        if(finishEnabledDashboard && Array.isArray(finishEnabledDashboard)) finishEnabledDashboard.forEach((currProcessId) => {
            const currProcessCards = processCards[currProcessId]

            var filteredCards = []
            if(currProcessCards) filteredCards = Object.values(currProcessCards).filter((currCard) => {
                if(currCard.bins && currCard.bins[stationId]) return true
            })
            .map((currCard) => {
                return{
                    ...currCard,
                    count: currCard.bins[stationId].count
                }
            })
            tempAvailableCards = tempAvailableCards.concat(filteredCards)
        })

        if(sortMode) {
            sortBy(tempAvailableCards, sortMode, sortDirection)
        }

        setAvailableKickOffCards(tempAvailableCards)

    }, [processCards, sortMode, sortDirection])

    // if number of available lots >= 5, auto focus lot filter text box
    useEffect(() => {
        if(availableKickOffCards.length >= 5 ) {
            setShouldFocusLotFilter(true)
        }
    }, [availableKickOffCards.length])

    if(showQuantitySelector) {
        return(
            <QuantityModal
                validationSchema={quantityOneSchema}
                maxValue={lotCount}
                minValue={0}
                infoText={`${lotCount} items available.`}
                isOpen={true}
                title={"Select Quantity"}
                onRequestClose={() => setShowQuantitySelector(false)}
                onCloseButtonClick={() => setShowQuantitySelector(false)}
                handleOnClick1={(quantity) => {
                    setShowQuantitySelector(false)
                    moveLot(selectedLot, quantity)
                }}
                handleOnClick2={() => {
                    setShowQuantitySelector(false)
                }}
                button_1_text={"Confirm"}
                button_2_text={"Cancel"}
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
                    zIndex: 500
                },
                content: {

                }
            }}
        >
            <styled.Header>
                <styled.HeaderMainContentContainer>
                    <div style={{marginRight: "auto", flex: 1}}/>
                    <styled.Title>{title}</styled.Title>
                    <div style={{flex: 1, display: "flex", justifyContent: "flex-end"}}>
                        <Button
                            onClick={close}
                            schema={'dashboards'}
                        >
                            <i className="fa fa-times" aria-hidden="true"/>
                        </Button>
                    </div>
                </styled.HeaderMainContentContainer>

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

            <styled.BodyContainer>
                    <div style={{display: "flex", flexDirection: "column", overflow: "hidden"}}>
                        <styled.ContentContainer>
                            <styled.ReportButtonsContainer isButtons={isButtons}>
                                {isButtons ?
                                    renderKickOffButtons()
                                    :
                                    <styled.NoButtonsText>No available lots.</styled.NoButtonsText>
                                }

                            </styled.ReportButtonsContainer>
                        </styled.ContentContainer>

                        <styled.ButtonsContainer>
                            <Button
                                tertiary
                                schema={"dashboards"}
                                onClick={close}
                                label={"Close"}
                                type="button"
                            />
                        </styled.ButtonsContainer>
                    </div>
            </styled.BodyContainer>
        </styled.Container>
    );
};

export default FinishModal
