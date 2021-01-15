import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'


import { useSelector, useDispatch } from 'react-redux'

// Import actions
import { addStation, setSelectedStation, editingStation } from '../../../redux/actions/stations_actions'
import { addPosition, setSelectedPosition, editingPosition } from '../../../redux/actions/positions_actions'
import { setOpen } from "../../../redux/actions/sidebar_actions"



// Import utils
import { convertD3ToReal } from '../../../methods/utils/map_utils'
import { deepCopy } from '../../../methods/utils/utils'

// Import Constants
import { PositionTypes } from '../../../constants/position_constants'

// import styling
import * as styled from './right_click_menu.style'

import uuid from 'uuid'

/**
 * This is the menu that opens on right click
 * It does some funky things that will be explained here
 *
 * Send cart to location
 * Makes a temp position with a name of 'TempRightClickMovePosition'
 * That name is used in locations, widgets, map view and positions to tell if its a right click menu
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
    const dispatchEditingPosition = (bool) => dispatch(editingPosition(bool))

    const dispatchAddStation = (station) => dispatch(addStation(station))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchEditingStation = (bool) => dispatch(editingStation(bool))

    const dispatchShowSideBar = (bool) => dispatch(setOpen(bool))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const positions = useSelector(state => state.locationsReducer.positions)
    const editing = useSelector(state => state.locationsReducer.editingLocation)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const showSideBar = useSelector(state => state.sidebarReducer.open)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)

    const history = useHistory()


    const onSendCartToPosition = async () => {
        const pos = convertD3ToReal([coords.x, coords.y], d3)

        const tempSelectedPosition = {
            name: 'TempRightClickMovePosition',
            schema: 'position',
            type: 'cart_position',
            map_id: currentMap._id,
            pos_x: pos[0],
            pos_y: pos[1],
            rotation: 0,
            x: coords.x,
            y: coords.y,
            _id: uuid.v4()
        }

        await Object.assign(tempSelectedPosition, { ...PositionTypes['cart_position'].attributes, temp: true })
        await dispatchAddPositions(tempSelectedPosition)
        await dispatchSetSelectedPosition(tempSelectedPosition)

        buttonClicked()
    }

    const onAddStation = async () => {

        history.push('/locations')
        const pos = convertD3ToReal([coords.x, coords.y], d3)

        const tempSelectedStation = {
            new: true,
            name: '',
            schema: 'station',
            type: 'human',
            pos_x: pos[0],
            pos_y: pos[1],
            rotation: 0,
            x: coords.x,
            y: coords.y,
            _id: uuid.v4(),
            map_id: currentMap._id,
            children: [],
            dashboards: []
        }

        await dispatchAddStation(tempSelectedStation)
        await dispatchSetSelectedStation(tempSelectedStation)

        dispatchEditingStation(true)
        dispatchShowSideBar(true)

        if (!showSideBar) {
            const hamburger = document.querySelector('.hamburger')
            hamburger.classList.toggle('is-active')
        }

        buttonClicked()
    }

    return (
        <styled.MenuContainer style={{ top: coords.y, left: coords.x }}>
            {MiRMapEnabled ?
                <>
                    <styled.MenuButton onClick={onAddStation}>Add Station</styled.MenuButton>
                    <styled.MenuButton onClick={onSendCartToPosition}>Send Cart to Position</styled.MenuButton>
                </>
                :
                <styled.MenuButton onClick={onAddStation}>Add Station</styled.MenuButton>

            }

        </styled.MenuContainer>
    )
}

export default RightClickMenu
