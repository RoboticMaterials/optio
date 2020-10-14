import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

// Import actions
import { addLocation, setSelectedLocation} from '../../../redux/actions/locations_actions'

// Import templates
import { cartPositionAttributes } from '../../side_bar/content/locations/location_templates'

// import styling
import * as styled from './right_click_menu.style'

import uuid from 'uuid'

/**
 * This the menu that opens on right click
 * It does some funky things that will be explained here
 * 
 * Send cart to location
 * Makes a temp position with a name of 'TempRightClickMoveLocation'
 * That name is used in locations, widgets, map view and positions to tell if its a right click menu
 * If it is a right click menu position then the widgets should always be displayed for send or cancel, and not disappear on mouse leave. (see map_view and widgets)
 * 
 * 
 * @param {*} props 
 */
const RightClickMenu = (props) => {

    const {
        coords,
        buttonClicked
    } = props

    const dispath = useDispatch()
    const onAddLocation = (loc) => dispath(addLocation(loc))
    const onSetSelectedLocation = (loc) => dispath(setSelectedLocation(loc))
    
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)



    const handleSendCartToLocation = async() => {
        console.log('QQQQ Sending cart to location')

        const tempSelectedLocation = {
            name: 'TempRightClickMoveLocation',
            schema: null,
            type: null,
            pos_x: 0,
            pos_y: 0,
            rotation: 0,
            x: coords.x,
            y: coords.y,
            _id: uuid.v4()
        }

        await Object.assign(tempSelectedLocation, { ...cartPositionAttributes, temp: true })

        await onAddLocation(tempSelectedLocation)

        await onSetSelectedLocation(tempSelectedLocation)

        buttonClicked()

    }

    const handleAddLocation = () => {

    }

    return(
        <styled.MenuContainer style={{top: coords.y, left: coords.x}}>
            <styled.MenuButton onClick={handleSendCartToLocation}>Send Cart to Location</styled.MenuButton>
            {/* <styled.MenuButton onClick={handleAddLocation}>Add Location</styled.MenuButton> */}
        </styled.MenuContainer>
    )
}

export default RightClickMenu