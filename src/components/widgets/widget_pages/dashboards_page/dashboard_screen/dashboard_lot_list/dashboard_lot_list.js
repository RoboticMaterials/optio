import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './dashboard_lot_list.style'

// Import Componenets
import LotContainer from "../../../../../side_bar/content/cards/lot/lot_container";
import SortFilterContainer from '../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container'
import Button  from '../../../../../basic/button/button';

// Import Utils
import { deepCopy } from '../../../../../../methods/utils/utils'
import { getIsCardAtBin, checkCardMatchesFilter, getMatchesFilter } from '../../../../../../methods/utils/lot_utils'
import { sortBy } from '../../../../../../methods/utils/card_utils'
import useWindowSize from '../../../../../../hooks/useWindowSize'

// Import Constants
import { LOT_FILTER_OPTIONS, SORT_DIRECTIONS } from '../../../../../../constants/lot_contants'

// Import Actions
import { putDashboard } from '../../../../../../redux/actions/dashboards_actions'


const DashboardLotList = (props) => {

    const {
        onCardClicked
    } = props

    const params = useParams()

    const {
        stationID,
        dashboardID,
    } = params || {}

    const dispatch = useDispatch()

    const stations = useSelector(state => state.stationsReducer.stations) || {}
    const cards = useSelector(state => state.cardsReducer.cards) || {}
    const dashboard = useSelector(state => state.dashboardsReducer.dashboards)[dashboardID] || {}
    const serverSettings = useSelector(state => state.settingsReducer.settings) || {}
    const localSettings = useSelector(state => state.localReducer.localSettings) || {}
    const stationCards = useSelector(state => state.cardsReducer.stationCards)[stationID] || cards

    const [lotFilterValue, setLotFilterValue] = useState('')
    const [shouldFocusLotFilter, setShouldFocusLotFilter] = useState(false)
    const [selectedFilterOption, setSelectedFilterOption] = useState(LOT_FILTER_OPTIONS.name)
    const dispatchPutDashboard = (dashboard, id) => dispatch(putDashboard(dashboard, id))

    const size = useWindowSize()
    const station = stations[stationID]

    const handleChangeSortMode = (mode) => {
        let dashboardCopy = deepCopy(dashboard)
        if (!dashboardCopy.sort) {dashboardCopy.sort = {}}
        dashboardCopy.sort.mode = mode
        dispatchPutDashboard(dashboardCopy, dashboard._id.$oid)
    }

    const handleChangeSortDirection = (direction) => {
        let dashboardCopy = deepCopy(dashboard)
        if (!dashboardCopy.sort) {dashboardCopy.sort = {}}
        dashboardCopy.sort.direction = direction
        dispatchPutDashboard(dashboardCopy, dashboard._id.$oid)
    }

    const handleAddFilter = (filter) => {
        let dashboardCopy = deepCopy(dashboard)
        if (!dashboardCopy.filters) {dashboardCopy.filters = []}
        dashboardCopy.filters.push(filter)
        dispatchPutDashboard(dashboardCopy, dashboard._id.$oid)
    }

    const handleRemoveFilter = (filterId) => {
        let dashboardCopy = deepCopy(dashboard)
        dashboardCopy.filters = dashboardCopy.filters.filter(filter => filter._id !== filterId)
        dispatchPutDashboard(dashboardCopy, dashboard._id.$oid)
    }


    const renderLotCards = useMemo(() => {

      if(!!serverSettings.enableMultipleLotFilters){
        let organizedCards = Object.values(stationCards)
                                .filter(card => getIsCardAtBin(card, station?._id))
                                .map(card => {
                                    const {
                                        bins = {},
                                    } = card || {}

                                    const quantity = bins[stationID]?.count
                                    return {...card, quantity}
                                })

        if (!!dashboard.sort && !!dashboard.sort.mode && !!dashboard.sort.direction) {
            sortBy(organizedCards, dashboard.sort.mode, dashboard.sort.direction)
        }

        return organizedCards.map((card, ind) => {

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
                        onCardClicked(currCardId)
                    }}
                    containerStyle={{
                        margin: ".5rem",
                        marginBottom: '1rem',
                        // pointerEvents: station.type === 'warehouse' ? 'none' : 'auto'
                    }}
                />
            )
        })
      }
      else{
        let organizedCards = Object.values(stationCards)
                                .filter(card => getIsCardAtBin(card, station?._id))
                                .map(card => {
                                    const {
                                        bins = {},
                                    } = card || {}

                                    const quantity = bins[stationID]?.count
                                    return {...card, quantity}
                                })

        if (!!dashboard.sort && !!dashboard.sort.mode && !!dashboard.sort.direction) {
            sortBy(organizedCards, dashboard.sort.mode, dashboard.sort.direction)
          }

          return organizedCards
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
                              onCardClicked(currCardId)
                          }}
                          containerStyle={{
                              margin: ".5rem",
                              marginBottom: '1.5rem'
                          }}
                      />
                  )
              })
          }

    }, [stationCards, onCardClicked, dashboard.filters, dashboard.sortBy, lotFilterValue, selectedFilterOption, serverSettings.enableMultipleLotFilters])

    return (
        <styled.LotListContainer>
            {(!serverSettings.hideFilterSortDashboards || size.width>1000) &&
              <SortFilterContainer
                  lotFilterValue={lotFilterValue}
                  shouldFocusLotFilter={shouldFocusLotFilter}
                  setLotFilterValue={setLotFilterValue}
                  selectedFilterOption={selectedFilterOption}
                  setSelectedFilterOption={setSelectedFilterOption}
                  multipleFilters = {serverSettings.enableMultipleLotFilters}
                  sortMode={!!dashboard?.sort?.mode ? dashboard.sort.mode : LOT_FILTER_OPTIONS.name}
                  setSortMode={handleChangeSortMode}
                  sortDirection={dashboard?.sort?.direction?.id == 0 ? SORT_DIRECTIONS.ASCENDING : SORT_DIRECTIONS.DESCENDING}
                  setSortDirection={handleChangeSortDirection}

                  filters={dashboard.filters || []}
                  onAddFilter={filter => handleAddFilter(filter)}
                  onRemoveFilter={filterId => handleRemoveFilter(filterId)}

                  containerStyle={{marginBottom: '1rem'}}
              />
            }
            <styled.LotCardContainer>
                {renderLotCards}
            </styled.LotCardContainer>
            {/* <styled.Footer>
                <Button>Log Out</Button>
            </styled.Footer> */}
        </styled.LotListContainer>
    )
}

export default DashboardLotList
