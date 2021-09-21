import React, { useEffect, useState, useMemo } from "react";

// external components
import Modal from 'react-modal';
import { useDispatch, useSelector } from "react-redux";
import {useParams} from 'react-router-dom'

// internal components
import Button from "../../../../../basic/button/button";
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// actions
import { getCards, getProcessCards, putCard } from "../../../../../../redux/actions/card_actions";

// styles
import * as styled from './kick_off_modal.style'
import { useTheme } from "styled-components";
import { getProcesses } from "../../../../../../redux/actions/processes_actions";
import FadeLoader from "react-spinners/FadeLoader";
import { sortBy } from "../../../../../../methods/utils/card_utils";
import Lot from "../../../../../side_bar/content/cards/lot/lot";
import { checkCardMatchesFilter, getCustomFields, getLotTotalQuantity, getMatchesFilter } from "../../../../../../methods/utils/lot_utils";
import { findProcessStartNodes } from "../../../../../../methods/utils/processes_utils";
import QuantityModal from "../../../../../basic/modals/quantity_modal/quantity_modal";
import { quantityOneSchema } from "../../../../../../methods/utils/form_schemas";
import { LOT_FILTER_OPTIONS, SORT_DIRECTIONS } from "../../../../../../constants/lot_contants";
import { getLotTemplates } from "../../../../../../redux/actions/lot_template_actions";
import LotEditorContainer from "../../../../../side_bar/content/cards/card_editor/lot_editor_container";
import SortFilterContainer from "../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container";
import useWindowSize from '../../../../../../hooks/useWindowSize'

Modal.setAppElement('body');

const KickOffModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit
    } = props

    const params = useParams()

    const {
      dashboardID
    } = params

    // get current buttons, default to empty array
    const dashboardId = dashboard?._id?.$oid

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
    const [selectedCard, setSelectedCard] = useState(null)

    const isButtons = availableKickOffCards.length > 0
    const stationId = dashboard.station

    const size = useWindowSize()
    const windowWidth = size.width
    const phoneView = windowWidth < 500

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
    * This is done by updating the cards station_id and route_id to those of the first station in the first route
    * */

    const moveLot = async (card, quantity) => {
        const startDivergeType = processes[card.process_id].startDivergeType

        let requestSuccessStatus = false
        let message
        let updatedCard = card

        if(!!card && quantity > 0){ // Make sure the card is real
            if(startDivergeType === undefined || startDivergeType === 'split'){
            const processRoutes = processes[card.process_id].routes.map(routeId => routes[routeId])
            const kickoffStations = findProcessStartNodes(processRoutes)
            for(var station in kickoffStations){
                let totalQuantity = !!updatedCard.bins[kickoffStations[station]]?.count ? updatedCard.bins[kickoffStations[station]].count + quantity : quantity
                updatedCard.bins[kickoffStations[station]] = {
                    count: totalQuantity
                }
            }
            if (quantity === updatedCard.bins['QUEUE'].count) {
                delete updatedCard.bins['QUEUE'];
            } else {
                updatedCard.bins['QUEUE'].count -= quantity;
            }
            } else {
            let kickoffStationQuantity = !!card.bins[stationId]? card.bins[stationId].count : 0
            updatedCard = {
                ...card,
                bins: {
                    ...card.bins,
                    ['QUEUE']: {
                        ...card.bins['QUEUE'],
                        count:  parseInt(card.bins['QUEUE']?.count)-parseInt(quantity)
                    },
                    [stationId]: {
                        ...card.bins[stationId],
                        count: parseInt(quantity) + parseInt(kickoffStationQuantity)
                    }
                    }
                }

                if(updatedCard.bins['QUEUE'].count === 0) delete updatedCard.bins['QUEUE']
            }

            const result = await onPutCard(updatedCard, updatedCard._id)

                //check if request was successful
            if (!(result instanceof Error)) {
                requestSuccessStatus = true
                message = card.name ? `Kicked off ${quantity} ${quantity > 1 ? "items" : "item"} from '${card.name}'` : `Kicked off ${quantity} ${quantity > 1 ? "items" : "item"}`
            }
        } else {
            message = "Quantity must be greater than 0"
        }

        onSubmit(card.name, requestSuccessStatus, quantity, message)
        setSubmitting(false)
        close()
    }

    /*
    * renders an array of buttons for each kick off lot
    * */
    const renderKickOffButtons = useMemo(() => {
        return availableKickOffCards
            .filter(currLot => dashboard?.filters?.reduce((matchesAll, filter) => {
                const {
                    bins = {},
                } = currLot || {}
                const quantity = bins["QUEUE"]?.count || 0;
                return matchesAll && checkCardMatchesFilter({ ...currLot, quantity }, filter)
            }, true) || true)

            .map((currCard, cardIndex) => {
                const {
                    _id: lotId,
                    name,
                    start_date,
                    end_date,
                    bins = {},
                    flags,
                    lotNumber,
                    process_id: processId,
                    lotTemplateId
                } = currCard

                const process = processes[processId]
                const {
                    name: processName
                } = process || {}

                const count = bins["QUEUE"]?.count || 0
                const totalQuantity = getLotTotalQuantity(currCard)
                const templateValues = getCustomFields(lotTemplateId, currCard)

                return (
                    <Lot
                        renderParts = {false}
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
                        onClick={() => {
                            onButtonClick(currCard)
                        }}
                        containerStyle={{ marginBottom: "0.5rem", width: "80%", margin: '.5rem auto .5rem auto' }}
                    />
                )
            })
    },[availableKickOffCards])

    const loadData = async() => {
        const cardsResult = await dispatchGetCards()
        const processesResult = await dispatchGetProcesses()
        dispatchGetLotTemplates()

        if (!(cardsResult instanceof Error) && !(processesResult instanceof Error)) {
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

        if (kickOffEnabledInfo && Array.isArray(kickOffEnabledInfo)) kickOffEnabledInfo.forEach((currProcessId) => {
            const currProcessCards = processCards[currProcessId]

            let filteredCards = []
            if (currProcessCards) filteredCards = Object.values(currProcessCards).filter((currCard) => {
                // currCard.station_id === "QUEUE"
                if (currCard.bins && currCard.bins["QUEUE"]) return true
            }).map((currCard) => {
                return {
                    ...currCard,
                    count: currCard.bins["QUEUE"].count
                }
            })
            tempAvailableCards = tempAvailableCards.concat(filteredCards)
        })


        if (sortMode) {
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
                title={"Select Kickoff Quantity"}
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
            }}
        >
            {showLotEditor &&
                <LotEditorContainer
                    isOpen={true}
                    onAfterOpen={null}
                    processOptions={kickOffEnabledInfo}
                    cardId={null}
                    processId={null}
                    close={() => {
                        setShowLotEditor(false)
                        // setSelectedCard(null)
                    }}
                />
            }
            <styled.Header>
                <styled.HeaderMainContentContainer>
                    <styled.Title>{title}</styled.Title>
                    <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={close} />

                </styled.HeaderMainContentContainer>
                {/* {!phoneView &&
                    <SortFilterContainer

                        sortMode={dashboard?.sort?.direciton || LOT_FILTER_OPTIONS.name}
                        setSortMode={handleChangeSortMode}
                        sortDirection={dashboard?.sort?.direction || SORT_DIRECTIONS.ASCENDING}
                        setSortDirection={handleChangeSortDirection}

                        filters={dashboard.filters || []}
                        onAddFilter={filter => handleAddFilter(filter)}
                        onRemoveFilter={filterId => handleRemoveFilter(filterId)}

                        containerStyle={{}}
                    />
                } */}



            </styled.Header>

            <styled.BodyContainer>
                <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <styled.ContentContainer>
                        <styled.ReportButtonsContainer isButtons={isButtons}>
                            {isButtons ?
                                renderKickOffButtons
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
                        {/*!phoneView &&
                          <Button
                                // tertiary
                                // secondary
                                schema={"dashboards"}
                                // onClick={close}
                                onClick={() => {
                                  setShowLotEditor(true)
                                }}
                                label={"Create New Lot"}
                                type="button"
                                style={{ minWidth: '12rem', minHeight: '3rem' }}
                            />
                        */}

                    </styled.ButtonsContainer>
                </div>
            </styled.BodyContainer>
        </styled.Container>
    );
};

export default KickOffModal
