import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './warehouse_modal.style'

// Import Components
import Modal from 'react-modal';
import Lot from "../../../../../side_bar/content/cards/lot/lot";
import QuantityModal from "../../../../../basic/modals/quantity_modal/quantity_modal";
import SortFilterContainer from "../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container";

// Import Utils
import { getPreviousWarehouseStation } from '../../../../../../methods/utils/processes_utils'
import { sortBy } from "../../../../../../methods/utils/card_utils";
import { getCustomFields, getLotTotalQuantity, getMatchesFilter, getIsCardAtBin } from "../../../../../../methods/utils/lot_utils";
import { getStationProcesses } from '../../../../../../methods/utils/stations_utils'
import { quantityOneSchema } from "../../../../../../methods/utils/form_schemas";

// Import Constants
import { LOT_FILTER_OPTIONS, SORT_DIRECTIONS } from "../../../../../../constants/lot_contants";
import { SORT_MODES } from "../../../../../../constants/common_contants";

// Import Actions
import { getLotTemplates } from "../../../../../../redux/actions/lot_template_actions";
import { getCards, getProcessCards, putCard } from "../../../../../../redux/actions/card_actions";
import { getProcesses } from "../../../../../../redux/actions/processes_actions";

Modal.setAppElement('body');

const WarehouseModal = (props) => {

    const {
        isOpen,
        title,
        close,
        dashboard,
        onSubmit,
        stationID
    } = props

    const params = useParams()
    const {
        dashboardID,
        subPage,
    } = params || {}

    const history = useHistory()

    const dispatch = useDispatch()
    const dispatchGetCards = () => dispatch(getCards())
    const dispatchGetLotTemplates = async () => await dispatch(getLotTemplates())
    const dispatchGetProcesses = () => dispatch(getProcesses());
    const onPutCard = async (card, ID) => await dispatch(putCard(card, ID))
    const stations = useSelector(state => state.stationsReducer.stations)

    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const routes = useSelector(state => { return state.tasksReducer.tasks }) || {}
    const processCards = useSelector(state => { return state.cardsReducer.processCards })
    const cards = useSelector(state => state.cardsReducer.cards)

    const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [didLoadData, setDidLoadData] = useState(false)
    const [selectedLot, setSelectedLot] = useState(null)
    const [lotCount, setLotCount] = useState(null)
    const [showQuantitySelector, setShowQuantitySelector] = useState(false)
    const [availableKickOffCards, setAvailableKickOffCards] = useState([])

    const [sortMode, setSortMode] = useState(LOT_FILTER_OPTIONS.name)
    const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.ASCENDING)
    const [lotFilterValue, setLotFilterValue] = useState('')
    const [selectedFilterOption, setSelectedFilterOption] = useState(LOT_FILTER_OPTIONS.name)


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

    const handleCardClicked = (lotID) => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}/lots/${lotID}`)
        setSubmitting(false)
        close()
    }

    /*
    * handles the logic for when move button is pressed
    *
    * When a warehouse button is pressed, the lot is to be moved from the warehouse to the current station
    *
    * This is done by updating the cards station_id and route_id to those of the selected station
    * */
    const moveLot = async (card, quantity) => {
        // device_type: "human"
        // hil_response: true
        // lot_id: "6081b4bdf7a8bf5d56493f9b"
        // owner: "human"
        // quantity: 1
        // showModal: null
        // task_id: "022ea650-33de-4a96-af5a-d01c9a98ff90"
        const lotID = card._id
        console.log('QQQQ card', card)
        console.log('QQQQ QTY', quantity)


    }

    /*
* renders an array of buttons for each kick off lot
* */
    const renderAvailableLots = useMemo(() => {

        const stationProcesses = getStationProcesses(stationID)

        const warehouseStations = []
        stationProcesses.forEach((processID) => {
            const station = getPreviousWarehouseStation(processID, stationID)
            if (!!station) warehouseStations.push(station)
        })

        let sortedCards = Object.values(cards)

        if (sortMode) {
            sortBy(sortedCards, sortMode, sortDirection)
        }

        return sortedCards
            // Goes through the list of warehouses that might be before this station and sees if the card is at that warehouse
            .filter((card, ind) => {
                let cardAtWarehouse = false
                warehouseStations.map((warehouse) => {
                    if (getIsCardAtBin(card, warehouse?._id)) {
                        cardAtWarehouse = true
                    }
                })
                return cardAtWarehouse
            })
            .filter((currLot) => {
                const {
                    name: currLotName,
                    bins = {},
                } = currLot || {}

                const count = bins[stationID]?.count
                return getMatchesFilter({
                    ...currLot,
                    quantity: count
                }, lotFilterValue, selectedFilterOption)
            })
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
                const totalQuantity = getLotTotalQuantity({ bins })
                const templateValues = getCustomFields(lotTemplateId, currCard)

                return (
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
                        onClick={() => {
                            handleCardClicked(lotId)
                        }}
                        containerStyle={{ marginBottom: "0.5rem", width: "80%", margin: '.5rem auto .5rem auto' }}
                    />
                )
            })
    }, [cards])

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
                />


            </styled.Header>

            <styled.ContentContainer>
                {renderAvailableLots}
            </styled.ContentContainer>

        </styled.Container>
    )
}

export default WarehouseModal