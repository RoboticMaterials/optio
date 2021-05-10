import React from 'react'
import { useHistory } from 'react-router-dom'


import { useSelector, useDispatch } from 'react-redux'

// Import actions
import { addStation, setSelectedStation} from '../../../redux/actions/stations_actions'
import { addPosition, setSelectedPosition, setEditingPosition, setSelectedStationChildrenCopy } from '../../../redux/actions/positions_actions'
import { setOpen } from "../../../redux/actions/sidebar_actions"

// Import utils
import { convertD3ToReal } from '../../../methods/utils/map_utils'
import { deepCopy } from '../../../methods/utils/utils'

// Import Constants
import { PositionTypes } from '../../../constants/position_constants'
import { LocationDefaultAttributes } from '../../../constants/location_constants'
import { StationTypes } from '../../../constants/station_constants'


// import styling
import * as styled from './right_click_menu.style'

import uuid from 'uuid'
import {setEditingStation} from "../../../redux/reducers/stations_reducer";

/**
 * This is the menu that opens on right click
 * It does some funky things that will be explained here
 *
 * Send cart to location
 * Makes a temp position with a schema of 'temporary_position'
 * That schema is used in locations, widgets, map view and positions to tell if its a right click menu
 * If it is a right click menu position then the widgets should always be displayed for send or cancel, and not disappear on mouse leave. (see map_view and widgets)
 *
 * The widget buttons have custom actions, and those actions can be found inside of widget_button is widgets
 * @param {*} props
 */
const RightClickMenu = (props) => {

    const {
        coords,
        buttonClicked,
        d3,
    } = props

    const dispatch = useDispatch()

    const dispatchAddPositions = (position) => dispatch(addPosition(position))
    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))

    const dispatchAddStation = (station) => dispatch(addStation(station))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchEditingStation = (bool) => dispatch(setEditingStation(bool))
    const dispatchSetSelectedStationChildrenCopy = (children) => dispatch(setSelectedStationChildrenCopy(children))

    const dispatchShowSideBar = (bool) => dispatch(setOpen(bool))

    const currentMap = useSelector(state => state.settingsReducer.settings.currentMap)
    const showSideBar = useSelector(state => state.sidebarReducer.open)
    const deviceEnabled = useSelector(state => state.settingsReducer.settings.deviceEnabled)
    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const history = useHistory()


    const disbaleStation = !!selectedStation ? true : !!selectedPosition ? true : false

    const onSendCartToPosition = async () => {
        const pos = convertD3ToReal([coords.x, coords.y], d3)

        const tempSelectedPosition = {
            name: '',
            schema: 'temporary_position',
            type: 'cart_position',
            mapId: currentMap.id,
            pos_x: pos[0],
            pos_y: pos[1],
            rotation: 0,
            x: coords.x,
            y: coords.y,
            id: uuid.v4()
        }

        await Object.assign(tempSelectedPosition, { ...PositionTypes['temporary_cart_position'].attributes, temp: true })
        await dispatchAddPositions(tempSelectedPosition)
        await dispatchSetSelectedPosition(tempSelectedPosition)

        buttonClicked()
    }

    const onAddStation = async () => {

        const pos = convertD3ToReal([coords.x, coords.y], d3)

        const defaultAttributes = deepCopy(LocationDefaultAttributes)

        defaultAttributes['mapId'] = currentMap.id
        defaultAttributes['id'] = uuid.v4()
        defaultAttributes['pos_x'] = pos[0]
        defaultAttributes['pos_y'] = pos[1]
        defaultAttributes['x'] = coords.x
        defaultAttributes['y'] = coords.y
        defaultAttributes['temp'] = false


        const attributes = deepCopy(StationTypes['human'].attributes)

        const tempSelectedStation = {
            ...defaultAttributes,
            ...attributes
        }

        dispatchEditingStation(true)
        dispatchSetSelectedStationChildrenCopy({})
        dispatchAddStation(tempSelectedStation)
        dispatchSetSelectedStation(tempSelectedStation)

        history.push('/locations')

        dispatchShowSideBar(true)


        buttonClicked()
    }

    return (
        <styled.MenuContainer style={{ top: coords.y, left: coords.x }}>
            {deviceEnabled ?
                <>
                    <styled.MenuButton disabled={disbaleStation} onClick={() => !disbaleStation && onAddStation()}>Add Station</styled.MenuButton>
                    <styled.MenuButton disabled={disbaleStation} onClick={onSendCartToPosition}>Send Cart to Position</styled.MenuButton>
                </>
                :
                <styled.MenuButton onClick={onAddStation}>Add Station</styled.MenuButton>

            }

        </styled.MenuContainer>
    )
}

export default RightClickMenu
