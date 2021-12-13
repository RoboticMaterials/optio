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
        close,
        dashboard,
        onSubmit,
        onSubmitLabel,

        initialQuantity,
        disableFilter,
        sortFunction,

        warehouseID,
        stationID
    } = props;

    const [selectedLot, setSelectedLot] = useState(null);

    const processes = useSelector(state => { return state.processesReducer.processes }) || {}
    const cards = useSelector(state => state.cardsReducer.cards)
    const stations = useSelector(state=>state.stationsReducer.stations)

    /*
* renders an array of buttons for each kick off lot
* */
    const renderAvailableLots = useMemo(() => {

        // Finds all cards at the warehouse, and maps them to something with quantity (to use in rendering)
        let availableLots = Object.values(cards)
            .filter(lot => getIsCardAtBin(lot, warehouseID))
            .map(lot => ({...lot, quantity: lot.bins[warehouseID]?.count}))

        // Applies dashboard filters
        if (!!dashboard.filters) {
            dashboard.filters.forEach(filter => {
                availableLots = availableLots.filter(lot => checkCardMatchesFilter(lot, filter))
            })
        }

        // Sorts Cards
        if (!!dashboard.sort && !!dashboard.sort.mode && !!dashboard.sort.direction) {
            sortBy(availableLots, dashboard.sort.mode, dashboard.sort.direction)
        }

        if (sortFunction) {
            availableLots = availableLots.sort(sortFunction)
        }

        // Maps cards to rendering
        if (availableLots.length > 0) {
            return availableLots.map((lot, idx) => {

                const templateValues = getCustomFields(lot.lotTemplateId, lot);
                const processName = processes[lot.process_id]?.name;

                const disabled = !!disableFilter ? disableFilter(lot) : false

                return (
                    <Lot
                        templateValues={templateValues}
                        totalQuantity={lot.totalQuantity}
                        enableFlagSelector={false}
                        lotNumber={lot.lotNum}
                        processName={processName}
                        flags={lot?.flags || []}
                        name={lot.name}
                        lotDisabled={disabled}
                        clickDisabled={disabled}
                        start_date={lot.start_date}
                        end_date={lot.end_date}
                        count={lot.bins[warehouseID]?.count || 0}
                        id={lot._id}
                        index={idx}
                        onClick={() => setSelectedLot(lot)}
                        containerStyle={{ marginBottom: "0.5rem", width: "80%", margin: '.5rem auto .5rem auto' }}
                    />
                )

            })
        } else {
            return (
                <styled.NoCardsLabel>No Lots in Warehouse</styled.NoCardsLabel>
            )
        }

    }, [cards, warehouseID])


    return (
      <>
        {!!selectedLot &&
            <QuantityModal
                validationSchema={quantityOneSchema}
                initialValue={Math.min(initialQuantity, selectedLot.bins[warehouseID]?.count || 0)}
                maxValue={selectedLot.bins[warehouseID]?.count || 0}
                minValue={1}
                infoText={`${selectedLot.bins[warehouseID]?.count || 0} items available.`}
                isOpen={!!selectedLot}
                title={"Select Quantity"}
                onRequestClose={() => setSelectedLot(null)}
                onCloseButtonClick={() => setSelectedLot(null)}
                handleOnClick1={(quantity) => {setSelectedLot(null)}}
                handleOnClick2={(quantity) => {setSelectedLot(null); onSubmit(selectedLot._id, quantity)}}
                button_1_text={"Cancel"}
                button_2_text={onSubmitLabel}
            />
        }

        <styled.Container
            isOpen={isOpen}
            contentLabel="Warehouse Modal"
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
                    <styled.Title>{stations[warehouseID]?.name || 'Warehouse'}</styled.Title>
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

WarehouseModal.defaultProps = {
    onSubmitLabel: "Pull",
    disableFilter: () => false
}

export default WarehouseModal
