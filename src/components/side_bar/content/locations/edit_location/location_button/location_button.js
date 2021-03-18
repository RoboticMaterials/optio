import React from 'react'
import * as styled from './location_button.style'

import { StationTypes } from '../../../../../../constants/station_constants'
import { PositionTypes } from '../../../../../../constants/position_constants'

const LocationButton = (props) => {

    const {
        type,
        isSelected,
        handleAddLocation,
        schema
    } = props

    const LocationTypes = {
        ...StationTypes,
        ...PositionTypes
    }

    function formatString(string) {
        if (string === 'cart_position') {
            string = 'cart'
        } else if (string === 'shelf_position') {
            string = 'shelf'
        }

        string = string.replace('_', ' ')
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <>
            <styled.LocationTypeButton
                isSelected={!!isSelected && isSelected === type}
                isNotSelected={!!isSelected && isSelected !== type}
                id={`location-type-button-${type}`}
                onMouseDown={async e => {
                    handleAddLocation(type)
                }}
                isSelected={isSelected}
                schema={schema}
            >   
                <styled.LocationTypeLabel>{formatString(type)}</styled.LocationTypeLabel>
                <styled.LocationTypeGraphic
                    
                    fill={LocationTypes[type].color}
                    isNotSelected={!!isSelected && isSelected !== type}
                    stroke={LocationTypes[type].color}
                    id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"
                >
                    {LocationTypes[type].svgPath}
                </styled.LocationTypeGraphic>
                
            </styled.LocationTypeButton>
        </>

    )

}

export default LocationButton
