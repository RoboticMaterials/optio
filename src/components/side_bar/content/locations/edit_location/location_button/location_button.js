import React from 'react'
import * as styled from './location_button.style'

import { StationTypes } from '../../../../../../constants/station_constants'
import { PositionTypes } from '../../../../../../constants/position_constants'

const LocationButton = (props) => {

    const {
        type,
        isSelected,
        handleAddLocation
    } = props

    const LocationTypes = {
        ...StationTypes,
        ...PositionTypes
    }

    const template = LocationTypes[type].attributes


    return (
        <styled.LocationTypeButton
            isNotSelected={!isSelected}
            id={`location-type-button-${type}`}
            onMouseDown={async e => {

                handleAddLocation()
                // Handle Station addition
                // if (template.schema === 'station') {
                //     await Object.assign(selectedStation, { ...template, temp: true, map_id: currentMap._id })
                //     await dispatchAddStation(selectedStation)
                //     await dispatchSetSelectedStation(selectedStation)
                // }

                // else if (template.schema === 'position') {

                // }

                // else {
                //     throw ('Schema Does Not exist')
                // }
            }}

            isSelected={isSelected}
            style={{ cursor: 'grab' }}
        >
            <styled.LocationTypeGraphic fill={LocationTypes[type].color} isNotSelected={!isSelected} stroke={LocationTypes[type].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                {LocationTypes[type].svgPath}
            </styled.LocationTypeGraphic>
        </styled.LocationTypeButton>

    )

}

export default LocationButton
