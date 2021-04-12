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
import * as styled from './kick_off_modal.style'
import {useTheme} from "styled-components";
import {getProcesses} from "../../../../../../redux/actions/processes_actions";
import FadeLoader from "react-spinners/FadeLoader";
import Textbox from "../../../../../basic/textbox/textbox";
import {SORT_MODES} from "../../../../../../constants/common_contants";
import {sortBy} from "../../../../../../methods/utils/card_utils";
import Lot from "../../../../../side_bar/content/cards/lot/lot";
import {getLotTemplateData, getLotTotalQuantity, getMatchesFilter} from "../../../../../../methods/utils/lot_utils";
import Card from "../../../../../side_bar/content/cards/lot/lot";
import QuantityModal from "../../../../../basic/modals/quantity_modal/quantity_modal";
import SimpleModal from "../../../../../basic/modals/simple_modal/simple_modal";
import {quantityOneSchema} from "../../../../../../methods/utils/form_schemas";
import ZoneHeader from "../../../../../side_bar/content/cards/zone_header/zone_header";
import LotSortBar from "../../../../../side_bar/content/cards/lot_sort_bar/lot_sort_bar";
import {LOT_FILTER_OPTIONS, SORT_DIRECTIONS} from "../../../../../../constants/lot_contants";
import LotFilterBar from "../../../../../side_bar/content/cards/lot_filter_bar/lot_filter_bar";
import {getLotTemplates} from "../../../../../../redux/actions/lot_template_actions";
import LotEditorContainer from "../../../../../side_bar/content/cards/card_editor/lot_editor_container";
import SortFilterContainer from "../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container";

Modal.setAppElement('body');

const KickOffModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit
    } = props

    // get current buttons, default to empty array
    const dashboardId = dashboard.id

    const theme = useTheme()

    const dispatch = useDispatch()
    // const onGetProcessCards = (processId) => dispatch(getProcessCards(processId))
    const dispatchGetCards = () => dispatch(getCards())
    const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())
    const dispatchGetProcesses = () => dispatch(getProcesses());
    const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))

    const kickOffEnabledInfo = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards[dashboardId] })
    const processCards = useSelector(state => { return state.cardsReducer.processCards })
    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const routes = useSelector(state => { return state.tasksReducer.tasks }) || {}



    const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [showLotEditor, setShowLotEditor] = useState(false)
    const [didLoadData, setDidLoadData] = useState(false)
    const [selectedLot, setSelectedLot] = useState(null)
    const [lotCount, setLotCount] = useState(null)
    const [showQuantitySelector, setShowQuantitySelector] = useState(false)
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
            ["QUEUE"]: queueBin,
        } = bins || {}

        const queueBinCount = queueBin?.count ? queueBin.count : 0

        setLotCount(queueBinCount)
        setSelectedLot(lot)
    }

    /*
    * handles the logic for when a kick-off button is pressed
    *
    * When a kick-off button is pressed, the lot is to be moved from the queue of the current process it resides in
    * to the first station in the process
    *
    * This is done by updating the cards stationId and routeId to those of the first station in the first route
    * */
    const moveLot = async (card, quantity) => {

        let requestSuccessStatus = false
        let message

        // extract lot attributes
        const {
            bins,
            name: cardName,
            processId,
            id: cardId,
        } = card

        if(quantity && quantity > 0) {

            // get process of card
            const cardProcess = processes[processId]

            // get routes of process
            const processRoutes = cardProcess.routes

            // get id of first route
            var firstRouteId = null
            if(processRoutes && Array.isArray(processRoutes)) firstRouteId = processRoutes[0]

            // get first route
            const firstRoute = routes[firstRouteId]

            // extract route attributes
            const {
                load: {
                    station: loadStation
                }
            } = firstRoute || {}

            // update card
            if(firstRouteId && firstRoute && loadStation) {

                // extract first station's bin and queue bin from bins
                const {
                    [loadStation]: firstStationBin,
                    ["QUEUE"]: queueBin,
                    ...unalteredBins
                } = bins || {}

                const queueBinCount = queueBin?.count ? queueBin.count : 0
                const firstStationCount = firstStationBin?.count ? firstStationBin.count : 0


                // updated card will maintain all of the cards previous attributes with the stationId and routeId updated
                let updatedCard = {
                    ...card,                                // spread unaltered attributes
                    bins: {
                        ...unalteredBins,                   // spread unaltered bins
                        [loadStation]: {
                            ...firstStationBin,              // spread unaltered attributes of station bin if it exists
                            count: parseInt(quantity) + parseInt(firstStationCount)    // increment first station's count by the count of the queue
                        }
                    },
                }

                // need to add queue bin back, but subtract moved quantity
                if(quantity < queueBinCount) {
                    updatedCard = {
                        ...updatedCard,
                        bins: {
                            ...updatedCard.bins,
                            QUEUE:  {
                                ...queueBin,
                                count: parseInt(queueBinCount) - parseInt(quantity)
                            }
                        }
                    }
                }

                // send update action
                const result = await onPutCard(updatedCard, cardId)



                // check if request was successful
                if(!(result instanceof Error)) {
                    requestSuccessStatus = true
                    message = cardName ? `Kicked off ${quantity} ${quantity > 1 ? "items" : "item"} from '${cardName}'` : `Kicked off ${quantity} ${quantity > 1 ? "items" : "item"}`
                }
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

                const count = bins["QUEUE"]?.count || 0

                return getMatchesFilter({
                    ...currLot,
                    quantity: count
                }, lotFilterValue, selectedFilterOption)
            })
            .map((currCard, cardIndex) => {
                const {
                    id: lotId,
                    name,
                    start_date,
                    end_date,
                    bins = {},
                    flags,
                    lotNumber,
                    processId: processId,
                    lotTemplateId
                } = currCard

                const process = processes[processId]
                const {
                    name: processName
                } = process || {}

                const count = bins["QUEUE"]?.count || 0
                const totalQuantity = getLotTotalQuantity({bins})
                const templateValues = getLotTemplateData(lotTemplateId, currCard)

                return(
                        <Lot
                            templateValues={templateValues}
                            totalQuantity={totalQuantity}
                            enableFlagSelector={false}
                            lotNumber={lotNumber}
                            processName={processName}
                            flags={flags || []}
                            name={name}
                            start_date={start_date}
                            end_date={end_date}
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

    const loadData = async () => {
        const cardsResult = await dispatchGetCards()
        const processesResult = await dispatchGetProcesses()
        dispatchGetLotTemplates()

        if(!(cardsResult instanceof Error) && !(processesResult instanceof Error)) {
            setDidLoadData(true)
        }
    }

    /**
     * When modal is opened, get all cards associated with the processes
     *
     *
     */
    useEffect(() => {
        loadData()
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
        let tempAvailableCards = []

        if(kickOffEnabledInfo && Array.isArray(kickOffEnabledInfo)) kickOffEnabledInfo.forEach((currProcessId) => {
            
            const currProcessCards = processCards[currProcessId]

            let filteredCards = []
            if(currProcessCards) filteredCards = Object.values(currProcessCards).filter((currCard) => {
                if(currCard.bins && currCard.bins["QUEUE"]) return true
            }).map((currCard) => {
                return{
                    ...currCard,
                }
            })
            tempAvailableCards = tempAvailableCards.concat(filteredCards)
        })


        if(sortMode) {
            sortBy(tempAvailableCards, sortMode, sortDirection)
        }
        setAvailableKickOffCards(tempAvailableCards)

    }, [processCards, sortMode, sortDirection])

    // useEffect(() => {
    //     let tempAvailableCards = [...availableKickOffCards]
    //     sortBy(tempAvailableCards, sortMode, sortDirection)
    //     setAvailableKickOffCards(tempAvailableCards)
    // }, [, processCards])

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
                minValue={1}
                infoText={`${lotCount} items available.`}
                isOpen={true}
                title={"Select Quantity"}
                onRequestClose={() => setShowQuantitySelector(false)}
                onCloseButtonClick={() => setShowQuantitySelector(false)}
                handleOnClick1={(quantity) => {
                    setShowQuantitySelector(false)

                }}
                handleOnClick2={(quantity) => {
                    setShowQuantitySelector(false)
                    moveLot(selectedLot, quantity)
                }}
                button_1_text={"Cancel"}
                button_2_text={"Confirm"}
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
            {showLotEditor &&
            <LotEditorContainer
                isOpen={true}
                onAfterOpen={null}
                processOptions={kickOffEnabledInfo}
                showProcessSelector={true}
                cardId={null}
                processId={null}
                // binId={null}
                close={()=>{
                    setShowLotEditor(false)
                    // setSelectedCard(null)
                }}
            />
            }
            <styled.Header>
                <styled.HeaderMainContentContainer>
                    <styled.Title>{title}</styled.Title>
                    <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={close}/>

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
                                    didLoadData ?
                                    <styled.NoButtonsText>There are currently no lots in the queue available for kick off.</styled.NoButtonsText>
                                        :
                                        <FadeLoader
                                            css={styled.FadeLoaderCSS}
                                            height={5}
                                            width={3}
                                            loading={true}
                                        />
                                }

                            </styled.ReportButtonsContainer>
                        </styled.ContentContainer>

                        <styled.ButtonsContainer>
                            {/* <Button
                                tertiary
                                schema={"dashboards"}
                                onClick={close}
                                label={"Close"}
                                type="button"
                            /> */}
                            <Button
                                // tertiary
                                // secondary
                                schema={"dashboards"}
                                // onClick={close}
                                onClick={()=>setShowLotEditor(true)}
                                label={"Create New Lot"}
                                type="button"
                                style={{minWidth: '12rem', minHeight: '3rem'}}
                            />
                        </styled.ButtonsContainer>
                    </div>
            </styled.BodyContainer>
        </styled.Container>
    );
};

export default KickOffModal
