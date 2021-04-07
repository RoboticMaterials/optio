import React, { useState, useRef } from 'react';

import * as styled from './associated_position_card.style';

import Draggable from 'react-draggable';

// Import Constants
import { PositionTypes, newPositionTemplate } from '../../../../../../../constants/position_constants'

const AssociatedPositionCard = (props) => {

    const {
        positionType,
        handleAddPosition,
        handleDeletePosition
    } = props
    

    const dragRef = useRef(null);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [dragging, setDragging] = useState(false)
    const [hovering, setHovering] = useState(false)

    let positionName
    // Sets of vairables based on position type
    if (positionType === 'cart_position') {
        positionName = 'Cart'
    }
    if (positionType === 'shelf_position') {
        positionName = 'Shelf'
    }

    function handleDrag(e, ui) {
        setX(x + ui.deltaX)
        setY(y + ui.deltaY)
        setDragging(true);
    }

    const handleDragStop = () => {
        setX(0)
        setY(0)
        setDragging(false);
        if (hovering) {
            handleDeletePosition();
        }
    }

    return (
        
            <styled.Card>

                <styled.NewPositionCard style={{ transform: 'translate(-0.4rem, 0.4rem)' }} />
                <styled.NewPositionCard style={{ transform: 'translate(-0.2rem, 0.2rem)' }}>
                        <styled.LocationTypeLabel>
                            {positionName}
                        </styled.LocationTypeLabel>

                        <styled.LocationTypeGraphic fill={PositionTypes[positionType].color} stroke={PositionTypes[positionType].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                            {PositionTypes[positionType].svgPath}
                        </styled.LocationTypeGraphic>
                    </styled.NewPositionCard>
                <Draggable ref={dragRef} key={`location-button-drag-ref-${positionType}`} onStart={() => handleAddPosition(positionType)} onDrag={handleDrag} onStop={handleDragStop} axis="none" position={{x, y}}>
                    <styled.NewPositionCard draggable={false} isDragging={dragging} onMouseEnter={() => setHovering(true)} onMouseLeave={() => {setHovering(false)}}>

                        <styled.LocationTypeLabel>
                            {positionName}
                        </styled.LocationTypeLabel>

                        <styled.LocationTypeGraphic fill={PositionTypes[positionType].color} stroke={PositionTypes[positionType].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                            {PositionTypes[positionType].svgPath}
                        </styled.LocationTypeGraphic>

                    </styled.NewPositionCard>
                </Draggable>
            </styled.Card>
    )
}

export default AssociatedPositionCard;