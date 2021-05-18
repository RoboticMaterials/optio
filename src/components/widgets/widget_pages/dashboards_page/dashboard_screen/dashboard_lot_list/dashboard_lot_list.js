import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './dashboard_lot_list.style'

// Import Componenets
import LotContainer from "../../../../../side_bar/content/cards/lot/lot_container";
import SortFilterContainer from '../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container'

// Import Utils
import { getIsCardAtBin, getMatchesFilter } from '../../../../../../methods/utils/lot_utils'
import { sortBy } from '../../../../../../methods/utils/card_utils'

// Import Constants
import { LOT_FILTER_OPTIONS, SORT_DIRECTIONS } from '../../../../../../constants/lot_contants'


const DashboardLotList = () => {

    const params = useParams()

    const {
        stationID,
        dashboardID,
    } = params || {}

    const dispatch = useDispatch()
    const history = useHistory()

    const stations = useSelector(state => state.stationsReducer.stations)
    const cards = useSelector(state => state.cardsReducer.cards)
    const devices = useSelector(state => state.devicesReducer.devices)
    const taskQueue = useSelector(state => state.taskQueueReducer.taskQueue)

    const [lotFilterValue, setLotFilterValue] = useState('')
    const [sortMode, setSortMode] = useState(LOT_FILTER_OPTIONS.name)
    const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.ASCENDING)
    const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState(false)
    const [selectedFilterOption, setSelectedFilterOption] = useState(LOT_FILTER_OPTIONS.name)

    const station = stations[stationID]

    const handleCardClicked = (lotID) => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}/lots/${lotID}`)
    }

    const onLotIsCurrentlyAtCart = (lot) => {
        const currDevice = Object.values(devices)[0]
        if (!!currDevice.current_task_queue_id && currDevice.current_task_queue_id.length > 0 && ) {
            const currTaskQueue = taskQueue[currDevice.current_task_queue_id]
            if (currTaskQueue?.lot_id === lot._id) {
                console.log('QQQQ lot', lot)
                console.log('QQQQ device', currDevice)
                console.log('QQQQ task q', currTaskQueue)
                return false
            }
        }
        return true
    }

    const renderLotCards = useMemo(() => {

        let sortedCards = Object.values(cards)

        if (sortMode) {
            sortBy(sortedCards, sortMode, sortDirection)
        }

        return sortedCards
            .filter((card, ind) => {
                return getIsCardAtBin(card, station?._id)
            })
            .filter((currLot) => { return onLotIsCurrentlyAtCart(currLot) })
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
            .map((card, ind) => {

                const {
                    _id: currCardId,
                    process_id: currCardProcessId
                } = card || {}

                return (
                    <LotContainer
                        lotId={currCardId}
                        binId={stationID}
                        enableFlagSelector={false}
                        key={currCardId}
                        onClick={() => {
                            handleCardClicked(currCardId)
                        }}
                        containerStyle={{
                            margin: ".5rem",
                        }}
                    />
                )
            })

    }, [cards, lotFilterValue, selectedFilterOption, sortMode, sortDirection])

    return (
        <styled.LotListContainer>
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
                containerStyle={{ justifyContent: 'center' }}
            />
            {renderLotCards}
        </styled.LotListContainer>
    )


}

export default DashboardLotList