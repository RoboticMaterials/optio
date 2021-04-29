import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './dashboard_lot_list.style'

// Import Componenets
import LotContainer from "../../../../../side_bar/content/cards/lot/lot_container";
import SortFilterContainer from '../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container'
import LotSortBar from '../../../../../side_bar/content/cards/lot_sort_bar/lot_sort_bar'
import {
    columnCss, columnCss3,
    containerCss,
    descriptionCss,
    dropdownCss,
    reactDropdownSelectCss,
    valueCss
} from '../../../../../side_bar/content/cards/lot_bars.style'

// Import Utils
import { getIsCardAtBin, getLotTemplateData, getLotTotalQuantity, getMatchesFilter } from '../../../../../../methods/utils/lot_utils'
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

    const [lotFilterValue, setLotFilterValue] = useState('')
    const [sortMode, setSortMode] = useState(LOT_FILTER_OPTIONS.name)
    const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.ASCENDING)
    const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState(false)
    const [selectedFilterOption, setSelectedFilterOption] = useState(LOT_FILTER_OPTIONS.name)

    const station = stations[stationID]

    const handleCardClicked = (lotID) => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}/lots/${lotID}`)
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