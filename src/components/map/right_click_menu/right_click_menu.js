import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'


import { useSelector, useDispatch } from 'react-redux'

// Import actions
import { addLocation, setSelectedLocation, deselectLocation, widgetLoaded, setSelectedLocationCopy, setSelectedLocationChildrenCopy} from '../../../redux/actions/locations_actions'

import * as sidebarActions from "../../../redux/actions/sidebar_actions"
import * as locationActions from '../../../redux/actions/locations_actions'



// Import utils
import { LocationTypes } from '../../../methods/utils/locations_utils'
import { convertD3ToReal } from '../../../methods/utils/map_utils'
import { deepCopy } from '../../../methods/utils/utils'

// import styling
import * as styled from './right_click_menu.style'

import uuid from 'uuid'

/**
 * This is the menu that opens on right click
 * It does some funky things that will be explained here
 *
 * Send cart to location
 * Makes a temp position with a name of 'TempRightClickMoveLocation'
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
    const onAddLocation = (loc) => dispatch(addLocation(loc))
    const onSetSelectedLocation = (loc) => dispatch(setSelectedLocation(loc))
    const onShowSideBar = (bool)=> dispatch(sidebarActions.setOpen(bool))
    const onSetSelectedLocationCopy = (location) => dispatch(setSelectedLocationCopy(location))
    const onSetSelectedLocationChildrenCopy = (locationChildren) => dispatch(setSelectedLocationChildrenCopy(locationChildren))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const positions = useSelector(state => state.locationsReducer.positions)
    const editing = useSelector(state => state.locationsReducer.editingLocation)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const showSideBar = useSelector(state=> state.sidebarReducer.open)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)

    const history = useHistory()


    const handleSendCartToLocation = async() => {
        const pos = convertD3ToReal([coords.x, coords.y], d3)

        const tempSelectedLocation = {
            name: 'TempRightClickMoveLocation',
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

        await Object.assign(tempSelectedLocation, { ...LocationTypes['cart_position'].attributes, temp: true })
        await onAddLocation(tempSelectedLocation)
        await onSetSelectedLocation(tempSelectedLocation)

        buttonClicked()
    }

    const handleAddLocation = async() => {

        history.push('/locations')
        const pos = convertD3ToReal([coords.x, coords.y], d3)

            const tempSelectedLocation = {
                new: true,
                name: '',
                schema: 'station',
                type: 'workstation',
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

            if (MiRMapEnabled==true){
                const tempSelectedLocation = {
                    new: true,
                    name: '',
                    schema: 'position',
                    type: 'cart_position',
                    pos_x: pos[0],
                    pos_y: pos[1],
                    rotation: 0,
                    x: coords.x,
                    y: coords.y,
                    _id: uuid.v4(),
                    map_id: currentMap._id
                }
              }

         await dispatch(locationActions.addLocation(tempSelectedLocation))
         await dispatch(locationActions.setSelectedLocation(tempSelectedLocation))

         dispatch(locationActions.editing(true))
         onShowSideBar(true)

         if(!showSideBar){
         const hamburger = document.querySelector('.hamburger')
         hamburger.classList.toggle('is-active')
       }

        buttonClicked()
    }

    return(
        <styled.MenuContainer style={{top: coords.y, left: coords.x}}>
        {MiRMapEnabled ?
          <>
            <styled.MenuButton onClick={handleAddLocation}>Add Cart Position</styled.MenuButton>
            <styled.MenuButton onClick={handleSendCartToLocation}>Send Cart to Location</styled.MenuButton>
          </>
          :
            <styled.MenuButton onClick={handleAddLocation}>Add Workstation</styled.MenuButton>

        }

        </styled.MenuContainer>
    )
}

export default RightClickMenu
