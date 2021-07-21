import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Styles
import * as styled from './dashboard_lot_list.style'

// Import Componenets
import LotContainer from "../../../../../side_bar/content/cards/lot/lot_container";
import SortFilterContainer from '../../../../../side_bar/content/cards/sort_filter_container/sort_filter_container'

// Import Utils
import { deepCopy } from '../../../../../../methods/utils/utils'
import { getIsCardAtBin, checkCardMatchesFilter } from '../../../../../../methods/utils/lot_utils'
import { sortBy } from '../../../../../../methods/utils/card_utils'
import useWindowSize from '../../../../../../hooks/useWindowSize'

// Import Constants
import { LOT_FILTER_OPTIONS, SORT_DIRECTIONS } from '../../../../../../constants/lot_contants'

// Import Actions
import { putDashboard } from '../../../../../../redux/actions/dashboards_actions'


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
    const routes = useSelector(state => state.tasksReducer.tasks)
    const dashboard = useSelector(state => state.dashboardsReducer.dashboards)[dashboardID]
    const serverSettings = useSelector(state => state.settingsReducer.settings)
    const localSettings = useSelector(state => state.localReducer.localSettings)
    
    const dispatchPutDashboard = (dashboard, id) => dispatch(putDashboard(dashboard, id))

    const size = useWindowSize()
    const phoneView = size.width < 500

    const station = stations[stationID]

    const handleCardClicked = (lotID) => {
        history.push(`/locations/${stationID}/dashboards/${dashboardID}/lots/${lotID}`)
    }

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

    // Handles when lot is currently on the cart
    const onLotIsCurrentlyAtCart = (lot) => {
        const currDevice = Object.values(devices)[0]

        // If device has a current task q item
        if (!!currDevice && !!currDevice.current_task_queue_id && currDevice.current_task_queue_id.length > 0) {

            // Get the corresponding task q
            const currTaskQueue = taskQueue[currDevice.current_task_queue_id]

            if (!currTaskQueue) return true

            // Get the coresponding route
            const currRoute = routes[currTaskQueue?.task_id]

            // See if the lot belongs to this task q item
            const currLotIsInTaskQ = currTaskQueue?.lot_id === lot._id

            // See if the device is at the unload station and unload hil is displaying
            const deviceAtUnload = !currTaskQueue?.next_position && currRoute?.unload?.station === currTaskQueue.hil_station_id

            // See if the lot already has a quantity at the station
            // IE the lot is split and already here
            const quantityAtStation = lot.bins[stationID].count
            const lotHasQuantityAlreadyAtStation = currTaskQueue?.quantity !== quantityAtStation

            // If lot is in the task,
            // lot does not have quantity at the station
            // the device is driving to the next position or the device is at unload,
            // then dont show card on dashboard
            if (currLotIsInTaskQ && !lotHasQuantityAlreadyAtStation && (!!currTaskQueue?.next_position || deviceAtUnload)) {
                return false
            }
        }
        return true
    }

    const renderLotCards = useMemo(() => {

        let organizedCards = Object.values(cards)
                                .filter(card => getIsCardAtBin(card, station?._id))
                                .filter(card => onLotIsCurrentlyAtCart(card))
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
                        handleCardClicked(currCardId)
                    }}
                    containerStyle={{
                        margin: ".5rem",
                    }}
                />
            )
        })

        
    }, [cards, dashboard.filters, dashboard.sortBy])

    return (
        <styled.LotListContainer>
            {(!phoneView && !(!!serverSettings?.hideFilterSortDashboards && !localSettings?.mapViewEnabled)) &&
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
            }
            <styled.LotCardContainer>
                {renderLotCards}
            </styled.LotCardContainer>
        </styled.LotListContainer>
    )


}

export default DashboardLotList
