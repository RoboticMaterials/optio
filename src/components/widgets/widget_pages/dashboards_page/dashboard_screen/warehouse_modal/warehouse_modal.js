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
import TransferLotModal from '../transfer_lot_modal/transfer_lot_modal'

// Import Utils
import { getPreviousWarehouseStation } from '../../../../../../methods/utils/processes_utils'
import { sortBy } from "../../../../../../methods/utils/card_utils";
import { getCustomFields, getLotTotalQuantity, checkCardMatchesFilter, getIsCardAtBin } from "../../../../../../methods/utils/lot_utils";
import { getStationProcesses } from '../../../../../../methods/utils/stations_utils'
import { quantityOneSchema } from "../../../../../../methods/utils/form_schemas";

// Import Constants
import { LOT_FILTER_OPTIONS, SORT_DIRECTIONS } from "../../../../../../constants/lot_contants";
import { SORT_MODES } from "../../../../../../constants/common_contants";

// Import Actions
import { getLotTemplates } from "../../../../../../redux/actions/lot_template_actions";
import { getCards, getProcessCards, putCard } from "../../../../../../redux/actions/card_actions";
import { getProcesses } from "../../../../../../redux/actions/processes_actions";
import { getProcessStations } from '../../../../../../methods/utils/processes_utils'

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
    const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))

    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const cards = useSelector(state => state.cardsReducer.cards)
    const stations = useSelector(state=>state.stationsReducer.stations)
    const routes = useSelector(state => state.tasksReducer.tasks)

    const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState(false)
    const [showTransferLotModal, setShowTransferLotModal] = useState(false)
    const [processTransferOptions, setProcessTransferOptions] = useState([])
    const [currentLot, setCurrentLot] = useState(null)
    const isWarehouse = true

    // Add warehouse to URL
    // The reason why you need to do this is that there is no other way to tell if the lot is at a warehouse
    // IE: you refresh the page and only the lotID is there, but the lot is split into the current station and the warehouse before
    // There would be no way to tell which one is which
    const handleCardClicked = (lotID) => {
        setCurrentLot(cards[lotID])
        warehouseProcessTransfer(lotID)
        //history.push(`/locations/${stationID}/dashboards/${dashboardID}/lots/${lotID}/warehouse`)
    }

    const warehouseProcessTransfer = async(lotID) => {
      const proc = []
      const currCard = cards[lotID]
        Object.values(processes).forEach((process) => {
            const processStations = Object.keys(getProcessStations(process,routes))
            for(const ind in processStations){
              if(processStations[ind] === stationID && !!currCard.bins[getPreviousWarehouseStation(process._id, stationID)?._id]){
                proc.push([process])
              }
            }
        })
        setProcessTransferOptions(proc)
        setShowTransferLotModal(true)
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

        let organizedCards = Object.values(cards)
            .map(card => {
                const {
                    bins = {},
                } = card || {}

                const quantity = bins[stationID]?.count
                return {...card, quantity}
            })

        if (!!dashboard.filters) {
            dashboard.filters.forEach(filter => {
                organizedCards = organizedCards.filter(card => checkCardMatchesFilter(card, filter))
            })
        }

        if (!!dashboard.sort && !!dashboard.sort.mode && !!dashboard.sort.direction) {
            sortBy(organizedCards, dashboard.sort.mode, dashboard.sort.direction)
        }


        // This array is all the IDs of the cards being shown
        // This fixes an issue with 2 processes going from the same warehouse into the same station (this would show all those cards twice)
        let warehouseCards = []

        // Goes through each warehouse that is infront to the station and renders cards
        return warehouseStations.map((warehouse) => {
            const warehouseID = warehouse?._id
            return organizedCards
                .filter(card => getIsCardAtBin(card, warehouseID))
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

                    // If the card is alwready being displayed, then dont show
                    if (warehouseCards.includes(lotId)) {
                        return
                    } else {
                        warehouseCards.push(lotId)
                    }

                    const process = processes[processId]
                    const {
                        name: processName
                    } = process || {}

                    const count = bins[warehouseID]?.count || 0
                    const totalQuantity = getLotTotalQuantity({ bins }, currCard)
                    const templateValues = getCustomFields(lotTemplateId, currCard, dashboardID)

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

        })


    }, [cards])


    return (
      <>
        {!!showTransferLotModal &&
          <TransferLotModal
            isOpen = {true}
            close = {()=>{
              setShowTransferLotModal(false)
              close()
            }}
            options = {processTransferOptions}
            lot = {currentLot}
            warehouse = {isWarehouse}
          />
        }
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
                {/* <SortFilterContainer
                    lotFilterValue={lotFilterValue}
                    sortMode={sortMode}
                    setSortMode={setSortMode}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    shouldFocusLotFilter={shouldFocusLotFilter}
                    setLotFilterValue={setLotFilterValue}
                    selectedFilterOption={selectedFilterOption}
                    setSelectedFilterOption={setSelectedFilterOption}
                /> */}


            </styled.Header>

            <styled.ContentContainer>
                {renderAvailableLots}
            </styled.ContentContainer>
        </styled.Container>
        </>
    )
}

export default WarehouseModal
