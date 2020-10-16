import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as styled from './positions.style'

import { sortableElement, sortableHandle } from 'react-sortable-hoc';

// Import Components
import MinusButton from '../../../../basic/minus_button/minus_button'
import Textbox from '../../../../basic/textbox/textbox'

import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

// Import Actions
import locationsReducer from '../../../../../redux/reducers/locations_reducer';
import * as locationActions from '../../../../../redux/actions/locations_actions'
import * as positionActions from '../../../../../redux/actions/positions_actions'
import { deleteTask } from '../../../../../redux/actions/tasks_actions'
import { deepCopy } from '../../../../../methods/utils/utils'

// Import utils
import { LocationTypes } from '../../../../../methods/utils/locations_utils'

import uuid from 'uuid'

export default function Positions(props) {

    const {
        handleSetChildPositionToCartCoords,
        type
    } = props

    const dispatch = useDispatch()
    const [editingIndex, setEditingIndex] = useState(null)
    const positions = useSelector(state => state.locationsReducer.positions)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const tasks = useSelector(state => state.tasksReducer.tasks)

    const positionType = type
    let positionTypeCamel = ''
    let positionName = ''

    // Sets of vairables based on position type
    if (positionType === 'cart_position') {
        positionTypeCamel = 'cartPosition'
        positionName = 'Position'
    }
    if (positionType === 'shelf_position') {
        positionTypeCamel = 'shelfPosition'
        positionName = 'Shelf'

    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        dispatch(locationActions.setLocationAttributes(selectedLocation._id, { positions: arrayMove(selectedLocation.positions, oldIndex, newIndex) }))
        setEditingIndex(null)
    };

    const DragHandle = sortableHandle(() => <styled.SortIcon className='fas fa-bars'></styled.SortIcon>);

    const SortableItem = SortableElement(({ position, i }) =>
        <li style={{ listStyle: 'none' }}>
            <styled.PositionListItem>
                <MinusButton onClick={() => {
                    console.log('QQQQ Minus clicked', position)
                    // Sees if any tasks are associated with the position
                    Object.values(tasks).filter(task => {
                        return task.load.position == position._id || task.unload.position == position._id
                    }).forEach(relevantTask => {
                        dispatch(deleteTask(relevantTask._id.$oid))
                    })

                    // TODO: Get rid of deep copy
                    let locationPositionIDs = deepCopy(selectedLocation.children)
                    locationPositionIDs.splice(i, 1)
                    console.log('QQQQ Splicing these ids', locationPositionIDs)
                    dispatch(locationActions.setLocationAttributes(selectedLocation._id, { children: locationPositionIDs }))

                    dispatch(positionActions.deletePosition(positions[position._id], position._id))

                }}></MinusButton>
                <Textbox style={{ flex: '1' }} schema="locations" focus={i == editingIndex} defaultValue={position.name} onChange={(e) => {
                    setEditingIndex(i)
                    dispatch(positionActions.setPositionAttributes(position._id, { name: e.target.value }))
                }}></Textbox>
                <styled.CartIcon className='icon-cart' onClick={() => handleSetChildPositionToCartCoords(position)} />

                {/* Commenting out for now, not working with constent updating */}
                {/* <DragHandle></DragHandle> */}

            </styled.PositionListItem>
        </li>
    );

    const SortableList = SortableContainer(({ positions }) => {
        // if (positions[0] === undefined) return null
        return (
            <styled.PositionList>
                {positions.map((position, index) => {
                    if (position.type === positionType) {
                        return (
                            <SortableItem key={`position-item-${position._id}`} index={index} position={position} i={index} />
                        )
                    }
                })}
            </styled.PositionList>
        );
    });

    return (
        // Takes care of error when selectedLocation is null, but shelves are still being rendered
        selectedLocation == null ?
            <></>
            :
            <styled.PositionsContainer>

                {/* Cards for dragging a new position onto the map */}
                <styled.Cards>
                    <styled.NewPositionCard style={{ transform: 'translate(-0.4rem, 0.4rem)' }} />
                    <styled.NewPositionCard style={{ transform: 'translate(-0.2rem, 0.2rem)' }} />
                    <styled.NewPositionCard draggable={false}
                        onMouseDown={e => {
                            const newPositionID = uuid()
                            dispatch(positionActions.addPosition({
                                name: positionName + ' ' + (selectedLocation.children.filter((position) => positions[position].type === positionType).length + 1),
                                schema: 'positions',
                                type: positionType,
                                temp: true,
                                new: true,
                                pos_x: 0,
                                pos_y: 0,
                                rotation: 0,
                                x: e.clientX,
                                y: e.clientY,
                                parent: selectedLocation._id,
                                _id: newPositionID
                            }))

                            let { children } = selectedLocation
                            children.push(newPositionID)
                            dispatch(locationActions.setLocationAttributes(selectedLocation._id, { children }))
                        }
                        }
                    >
                        <styled.LocationTypeGraphic fill={LocationTypes[positionTypeCamel].color} stroke={LocationTypes[positionTypeCamel].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                            {LocationTypes[positionTypeCamel].svgPath}
                        </styled.LocationTypeGraphic>

                    </styled.NewPositionCard>

                </styled.Cards>

                <styled.Label>{'Associated ' + positionName} </styled.Label>

                <styled.ListContainer>
                    <SortableList positions={selectedLocation.children.map(id => positions[id])}
                        onSortEnd={onSortEnd}
                        useDragHandle={true}
                        lockAxis={'y'}
                        axis={'y'}
                        useDragHandle={true}
                    />
                </styled.ListContainer>
            </styled.PositionsContainer>
    )
}
