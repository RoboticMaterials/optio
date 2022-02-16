import React, { useRef, useState } from 'react'
import * as styled from './location_button.style'

import { StationTypes } from '../../../../../../constants/station_constants'
import { PositionTypes } from '../../../../../../constants/position_constants'

import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';

const LocationButton = (props) => {
    const { t, i18n } = useTranslation();

    const {
        type,
        isSelected,
        onDragStart,
        onClick,
        schema,
        locationAdded,
        disableDrag,
    } = props

    const LocationTypes = {
        ...StationTypes,
        ...PositionTypes
    }

    const dragRef = useRef(null);
    // const translateRef = useRef({x: 0, y: 0});
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    function formatString(string) {
        if (string === 'cart_position') {
            string = 'cart'
        } else if (string === 'shelf_position') {
            string = 'shelf'
        } else if (string === 'warehouse'){
            string = t("warehouse","Supermarket")
        } else if (string === 'human') {
            string = t("workstation","Work Station")
        } else if (string === 'charger_position') {
            string = 'Charger'
        }


        string = string.replace('_', ' ')
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleDrag(e, ui) {
        setX(x + ui.deltaX)
        setY(y + ui.deltaY)
    }type

    const handleDragStop = () => {
        setX(0)
        setY(0)
    }

    return (
        <Draggable disabled={!!locationAdded} ref={dragRef} key={`location-button-drag-ref-${type}`} onMouseDown={() => onClick(type)} onStart={() => !disableDrag && onDragStart(type)} onDrag={handleDrag} onStop={handleDragStop} axis="none" position={{x, y}}>
            <styled.LocationTypeButton
                isSelected={!!isSelected && isSelected === type}
                isNotSelected={!!isSelected && isSelected !== type}
                id={`location-type-button-${type}`}
                isSelected={isSelected}
                schema={schema}
            >
                <styled.LocationTypeLabel>{formatString(type)}</styled.LocationTypeLabel>
                    <styled.LocationTypeGraphic

                        fill={LocationTypes[type].color}
                        isSelected={!!isSelected && isSelected === type}
                        isNotSelected={!!isSelected && isSelected !== type}
                        stroke={LocationTypes[type].color}
                        id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"
                    >
                        {LocationTypes[type].svgPath}
                    </styled.LocationTypeGraphic>
            </styled.LocationTypeButton>
        </Draggable>

    )

}

LocationButton.defaultProps = {
    disableDrag: false
}

export default LocationButton
