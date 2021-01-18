import React, { useState, useEffect, useMemo } from 'react'
import * as styled from './locations_content.style'
import { useSelector, useDispatch } from 'react-redux'

// Import components
import ContentList from '../content_list/content_list'
import EditLocation from './edit_location/edit_location'

import { convertD3ToReal } from '../../../../methods/utils/map_utils'

// Import actions
import { sideBarBack, deleteLocationProcess } from '../../../../redux/actions/locations_actions'
import { setSelectedPosition, setPositionAttributes, addPosition, deletePosition, updatePosition } from '../../../../redux/actions/positions_actions'
import { setSelectedStation, setStationAttributes, addStation, deleteStation, updateStation, setSelectedStationChildrenCopy } from '../../../../redux/actions/stations_actions'

// Import Utils
import { setAction } from '../../../../redux/actions/sidebar_actions'
import { deepCopy } from '../../../../methods/utils/utils'
import { locationsSortedAlphabetically } from '../../../../methods/utils/locations_utils'

import uuid from 'uuid'

// This adds a location selected info to the reducer
export default function LocationContent() {

    const dispatch = useDispatch()

    const dispatchSetSelectedStaion = (station) => dispatch(setSelectedStation(station))
    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchAddStation = (station) => dispatch(addStation(station))
    const dispatchSetSelectedStationChildrenCopy = (children) => dispatch(setSelectedStationChildrenCopy(children))

    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))
    const dispatchAddPosition = (pos) => dispatch(addPosition(pos))
    const dispatchSetPositionAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))

    const onSideBarBack = (props) => dispatch(sideBarBack(props))
    const onDeleteLocationProcess = (props) => dispatch(deleteLocationProcess(props))

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
    const [editing, setEditing] = useState(!!editingStation ? editingStation : editingPosition)

    const selectedLocation = !!selectedStation ? selectedStation : selectedPosition
    const locations = {
        ...stations,
        ...positions
    }

    useEffect(() => {
        setEditing(!!editingStation ? editingStation : editingPosition)
    }, [editingStation, editingPosition])

    /**
     * This function is called when the back button is pressed. If the location is new, it is deleted;
     * otherwise, it is reverted to the state it was when editing begun.
     * TODO: FIX THIS JUNKY JUNK (redo location logic, it sucks)
     */
    const onBack = () => {

    }

    const onSetSelectedLocation = (id) => {

    }

    const onEditLocation = (id) => {

    }

    return (
        !!editing ?
            <EditLocation />

            :
            <ContentList
                title={'Locations'}
                schema={'locations'}
                // Filters out devices from being displayed in locations
                elements={
                    locationsSortedAlphabetically(Object.values(locations))
                        // Filters out devices, entry positions, other positions and right click to move positions
                        .filter(location => !location.parent && location.type !== 'device' && location.type !== 'cart_entry_position' && location.type !== 'shelf_entry_position' && location.type !== 'charger_entry_position' && location.type !== 'other' && location.name !== 'TempRightClickMovePosition' && (location.map_id === currentMap._id))
                }
                // elements={Object.values(locations)}
                onMouseEnter={(location) => onSetSelectedLocation(location._id)}
                onMouseLeave={() => onSetSelectedLocation(null)}
                onClick={(location) => {
                    onEditLocation(location._id)
                }}
                onPlus={() => {
                    setEditing(true)
                }}
            />
    )
}
