import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as styled from './positions.style'

import { sortableElement, sortableHandle } from 'react-sortable-hoc';

import MinusButton from '../../../../basic/minus_button/minus_button'
import Textbox from '../../../../basic/textbox/textbox'

import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import locationsReducer from '../../../../../redux/reducers/locations_reducer';
import * as locationActions from '../../../../../redux/actions/locations_actions'
import * as positionActions from '../../../../../redux/actions/positions_actions'
import { deleteTask } from '../../../../../redux/actions/tasks_actions'
import { deepCopy } from '../../../../../methods/utils/utils'

import uuid from 'uuid'

export default function Positions() {

    const dispatch = useDispatch()
    const [editingIndex, setEditingIndex] = useState(null)
    const positions = useSelector(state => state.locationsReducer.positions)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const tasks = useSelector(state => state.tasksReducer.tasks)

    const onSortEnd = ({ oldIndex, newIndex }) => {
        dispatch(locationActions.setLocationAttributes(selectedLocation._id, { positions: arrayMove(selectedLocation.positions, oldIndex, newIndex) }))
        setEditingIndex(null)
    };

    const DragHandle = sortableHandle(() => <styled.SortIcon className='fas fa-bars'></styled.SortIcon>);

    const SortableItem = SortableElement(({ position, i }) =>
        <li style={{ listStyle: 'none' }}>
            <styled.PositionListItem>
                <MinusButton onClick={() => {
                    Object.values(tasks).filter(task => {
                        return task.load.position == position._id || task.unload.position == position._id
                    }).forEach(relevantTask => {
                        dispatch(deleteTask(relevantTask._id.$oid))
                    })
                    console.log('QQQQ Location in positions', selectedLocation)

                    let locationPositionIDs = selectedLocation.children
                    locationPositionIDs.splice(i, 1)
                    dispatch(locationActions.setLocationAttributes(selectedLocation._id, { children: locationPositionIDs }))
                    dispatch(positionActions.deletePosition(positions[position._id], position._id))
                }}></MinusButton>
                <Textbox style={{ flex: '1' }} schema="locations" focus={i == editingIndex} defaultValue={position.name} onChange={(e) => {
                    setEditingIndex(i)
                    dispatch(positionActions.setPositionAttributes(position._id, { name: e.target.value }))
                }}></Textbox>
                <DragHandle></DragHandle>
            </styled.PositionListItem>
        </li>
    );

    const SortableList = SortableContainer(({ positions }) => {
        return (
            <styled.PositionList>
                {positions.map((position, index) => (
                    <SortableItem key={`position-item-${position._id}`} index={index} position={position} i={index} />
                ))}
            </styled.PositionList>
        );
    });

    return (
        <styled.PositionsContainer>

            {/* Cards for dragging a new position onto the map */}
            <styled.Cards>
                <styled.NewPositionCard style={{ transform: 'translate(-0.4rem, 0.4rem)' }} />
                <styled.NewPositionCard style={{ transform: 'translate(-0.2rem, 0.2rem)' }} />
                <styled.NewPositionCard draggable={false}
                    onMouseDown={e => {
                        const newPositionID = uuid()
                        dispatch(positionActions.addPosition({
                            name: 'Position ' + (selectedLocation.children.length + 1),
                            schema: 'positions',
                            type: 'cart_position',
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
                    <styled.LocationTypeGraphic id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        <rect x="100" y="40" width="200" height="320" rx="30" transform="translate(400 0) rotate(90)" fill="none" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="20" />
                        <path d="M315.5,200.87l-64,36.95A1,1,0,0,1,250,237v-73.9a1,1,0,0,1,1.5-.87l64,36.95A1,1,0,0,1,315.5,200.87Z" fill="#6283f0" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="10" />
                        <circle cx="200" cy="200" r="15" fill="#6283f0" />
                        <circle cx="150" cy="200" r="10" fill="#6283f0" />
                        <circle cx="102.5" cy="200" r="7.5" fill="#6283f0" />
                    </styled.LocationTypeGraphic>
                </styled.NewPositionCard>
            </styled.Cards>

            {selectedLocation.children.length > 0 &&
                <styled.Label>Associated Positions</styled.Label>
            }
            <styled.ListContainer>
                <SortableList positions={selectedLocation.children.map(id => positions[id])} onSortEnd={onSortEnd}
                    useDragHandle={true}
                    lockAxis={'y'}
                    axis={'y'}
                    useDragHandle={true}
                />
            </styled.ListContainer>
        </styled.PositionsContainer>
    )
}
