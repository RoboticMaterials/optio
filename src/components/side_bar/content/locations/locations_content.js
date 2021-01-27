import React, { useState, useEffect, useMemo } from 'react'
import * as styled from './locations_content.style'
import { useSelector, useDispatch } from 'react-redux'

// Import components
import ContentList from '../content_list/content_list'
import EditLocation from './edit_location/edit_location'

import { convertD3ToReal } from '../../../../methods/utils/map_utils'

// Import actions
import { setEditingPosition, setSelectedPosition, setSelectedStationChildrenCopy } from '../../../../redux/actions/positions_actions'
import { setEditingStation, setSelectedStation } from '../../../../redux/actions/stations_actions'

// Import Constants
import { StationTypes } from '../../../../constants/station_constants'

// Import Utils
import { setAction } from '../../../../redux/actions/sidebar_actions'
import { deepCopy } from '../../../../methods/utils/utils'
import { locationsSortedAlphabetically } from '../../../../methods/utils/locations_utils'

import uuid from 'uuid'

// This adds a location selected info to the reducer
export default function LocationContent() {

    const dispatch = useDispatch()

    const dispatchSetEditingPosition = (bool) => dispatch(setEditingPosition(bool))
    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))

    const dispatchSetEditingStation = (bool) => dispatch(setEditingStation(bool))
    const dispatchSetSelectedStation = (position) => dispatch(setSelectedStation(position))
    const dispatchSetSelectedStationChildrenCopy = (positions) => dispatch(setSelectedStationChildrenCopy(positions))

    const stations = useSelector(state => state.stationsReducer.stations)
    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const positions = useSelector(state => state.positionsReducer.positions)

    const editingStation = useSelector(state => state.stationsReducer.editingStation)
    const editingPosition = useSelector(state => state.positionsReducer.editingPosition)

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const devices = useSelector(state => state.devicesReducer.devices)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)
    const processes = useSelector(state => state.processesReducer.processes)

    const [mergeStation, setMergeStation] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const selectedLocation = !!selectedStation ? selectedStation : selectedPosition

    const locations = {
        ...stations,
        ...positions
    }

    useEffect(() => {
        return () => {

        }
    }, [])

    const onSetSelectedLocation = (id) => {
        if (id in stations) {
            dispatchSetSelectedStation(stations[id])
        }

        else if (id in positions) {
            dispatchSetSelectedPosition(positions[id])
        }

        else if (id === null) {
            dispatchSetSelectedStation(null)
            dispatchSetSelectedPosition(null)

        }
    }

    /**
     * Tells what location is being edited
     * Handles whether location is a station or a position
     * @param {*} id
     */
    const onEditLocation = (id) => {
        const editingLocation = locations[id]

        // If a station
        if (editingLocation.schema === 'station') {
            dispatchSetEditingStation(true)
            dispatchSetSelectedStation(editingLocation)

            // Copy Children
            if (editingLocation.children.length > 0) {
                let copy = {}

                editingLocation.children.forEach(child => {
                    copy[child] = positions[child]
                })

                dispatchSetSelectedStationChildrenCopy(copy)
            }
        }

        // Else its a position
        else {
            dispatchSetEditingPosition(true)
            dispatchSetSelectedPosition(editingLocation)
        }
    }

    return (
        (editingPosition || editingStation) ?
            <EditLocation />

            :
            <ContentList
                title={'Locations'}
                schema={'locations'}
                // Filters out devices from being displayed in locations
                elements={
                    locationsSortedAlphabetically(Object.values(locations))
                        // Filters out devices, entry positions, other positions and right click to move positions
                        .filter(location => !location.parent && location.type !== 'device' && location.type !== 'cart_entry_position' && location.type !== 'shelf_entry_position' && location.type !== 'charger_entry_position' && location.type !== 'other' && location.schema !== 'temporary_position' && (location.map_id === currentMap._id))
                }
                // elements={Object.values(locations)}
                onMouseEnter={(location) => onSetSelectedLocation(location._id)}
                onMouseLeave={() => onSetSelectedLocation(null)}
                onClick={(location) => {
                    console.log('QQQQ Editing Location', location)
                    onEditLocation(location._id)
                }}
                onPlus={() => {
                    dispatchSetEditingStation(true)
                }}
            />
    )
}
