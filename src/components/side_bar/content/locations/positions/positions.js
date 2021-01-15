import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as styled from './positions.style'

import { sortableElement, sortableHandle } from 'react-sortable-hoc';

// Import Components
import MinusButton from '../../../../basic/minus_button/minus_button'
import Textbox from '../../../../basic/textbox/textbox'
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'


import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

// Import Actions
import { setStationAttributes } from '../../../../../redux/actions/stations_actions'
import { setPositionAttributes, deletePosition, addPosition } from '../../../../../redux/actions/positions_actions'
import * as positionActions from '../../../../../redux/actions/positions_actions'
import { deleteTask } from '../../../../../redux/actions/tasks_actions'
import { deepCopy } from '../../../../../methods/utils/utils'

// Import Constants
import { PositionTypes } from '../../../../../constants/position_constants'

import uuid from 'uuid'

export default function Positions(props) {

    const {
        handleSetChildPositionToCartCoords,
    } = props

    const dispatch = useDispatch()
    const dispatchSetPositionAttributes = (id, attr) => dispatch(setPositionAttributes(id, attr))
    const dispatchDeletePosition = (id) => dispatch(deletePosition(id))
    const dispatchAddPosition = (position) => dispatch(addPosition(position))

    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))

    const positions = useSelector(state => state.locationsReducer.positions)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const selectedLocationCopy = useSelector(state => state.locationsReducer.selectedLocationCopy)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)

    const [editingIndex, setEditingIndex] = useState(null)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [deletingIndex, setDeletingIndex] = useState()
    const [deletingPosition, setDeletingPosition] = useState()


    // const [selectedPositions, setSelectedPositions] = useState([])


    const positionTypes = !!MiRMapEnabled ? ['cart_position', 'shelf_position',] : []
    const selectedPositions = Object.values(positions).filter(position => position.parent == selectedLocation._id)

    useEffect(() => {
        // setSelectedPositions(Object.values(positions).filter(position => position.parent == selectedLocation._id))
        return () => {

        }
    }, [])

    useEffect(() => {
        return () => {

        }
    }, [editingIndex])

    const onSortEnd = ({ oldIndex, newIndex }) => {
        // dispatch(locationActions.setLocationAttributes(selectedLocation._id, { positions: arrayMove(selectedLocation.positions, oldIndex, newIndex) }))
        // setEditingIndex(null)
    };

    const DragHandle = sortableHandle(() => <styled.SortIcon className='fas fa-bars'></styled.SortIcon>);

    const SortableItem = SortableElement(({ position, i }) =>
        // const SortableItem = ({ position, i }) => (
        <li style={{ listStyle: 'none' }}>
            <styled.PositionListItem>
                <MinusButton onClick={() => {
                    // Sees if any tasks are associated with the position
                    Object.values(tasks).filter(task => {
                        return task.load.position == position._id || task.unload.position == position._id
                    }).forEach(relevantTask => {
                        dispatch(deleteTask(relevantTask._id))
                    })

                    // TODO: Get rid of deep copy
                    let locationPositionIDs = deepCopy(selectedLocation.children)
                    locationPositionIDs.splice(i, 1)
                    dispatch(locationActions.setLocationAttributes(selectedLocation._id, { children: locationPositionIDs }))

                    dispatchDeletePosition(positions[position._id], position._id)

                }}
                />
                <Textbox
                    style={{ flex: '1' }}
                    schema="locations"
                    focus={i == editingIndex}
                    defaultValue={position.name}
                    onChange={(e) => {
                        setEditingIndex(i)
                        dispatchSetPositionAttributes(position._id, { name: e.target.value })
                    }}

                />
                <styled.CartIcon className='icon-cart' onClick={() => handleSetChildPositionToCartCoords(position)} />

                {/* Commenting out for now, not working with constent updating */}
                {/* <DragHandle></DragHandle> */}

            </styled.PositionListItem>
        </li>
    );

    const SortableList = SortableContainer(({ positions }) => {
        // const SortableList = useMemo((positions) => {
        if (positions === undefined) return null

        return positionTypes.map((positionType) => {
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
        })

    });
    // }, [selectedPositions]);

    /**
     * Handles deleting positions
     * Does some different things based on if the position is new or not (see comments bellow)
     * TODO: FIX THIS SHIT!
     * @param {*} position
     * @param {*} i
     */
    const handleDelete = async (position, i) => {
        // If the position is new, just remove it from the local station
        // Since the position is new, it does not exist in the backend and there can't be any associated tasks
        if (!!position.new) {

            // Remove the position from the list of children
            let locationPositionIDs = deepCopy(selectedLocation.children)
            locationPositionIDs.splice(i, 1)
            dispatch(locationActions.setLocationAttributes(selectedLocation._id, { children: locationPositionIDs }))

            // TODO: Need to update to handle positions that are not in the backend yet
            dispatchDeletePosition(position._id)
        }

        // Else remove from local copy, delete in backend and delete any associated tasks
        else {
            // Sees if any tasks are associated with the position
            Object.values(tasks).filter(task => {
                return task.load.position == position._id || task.unload.position == position._id
            }).forEach(relevantTask => {
                dispatch(deleteTask(relevantTask._id))
            })

            // TODO: Get rid of deep copy
            let locationPositionIDs = deepCopy(selectedLocation.children)
            locationPositionIDs.splice(i, 1)
            await dispatch(locationActions.setLocationAttributes(selectedLocation._id, { children: locationPositionIDs }))

            // If deleting an existing position, you also need to update the copy because it's a permenant delete, you cant undo a position delete
            // TODO: Get rid of copy's....
            onSetSelectedLocationCopy(deepCopy({
                ...selectedLocation,
                children: [...locationPositionIDs],
            }))


            dispatchDeletePosition(positions[position._id], position._id)

        }

    }

    const handleAssociatedPositions = (associatedPositions, positionType) => {

        return associatedPositions.map((position, i) => {

            if (position.type === positionType) {

                return (
                    <styled.PositionListItem background={PositionTypes[positionType].color}>


                        <MinusButton
                            onClick={() => {
                                setConfirmDeleteModal(true)
                                setDeletingIndex(i)
                                setDeletingPosition(position)
                            }}
                        />
                        <Textbox
                            style={{ flex: '1' }}
                            schema="locations"
                            focus={i == editingIndex}
                            // defaultValue={position.name}
                            value={position.name}
                            onChange={(e) => {
                                setEditingIndex(i)
                                dispatch(positionActions.setPositionAttributes(position._id, { name: e.target.value }))
                            }}

                        />


                        {/* If not a human position, then add ability to use cart location */}
                        {position.type !== 'human_position' &&
                            <styled.CartIcon className='icon-cart' onClick={() => handleSetChildPositionToCartCoords(position)} />
                        }

                        {/* Commenting out for now, not working with constent updating */}
                        {/* <DragHandle></DragHandle> */}


                    </styled.PositionListItem>
                )
            }
        })

    }

    const handlePositionCards = () => {

        return positionTypes.map((positionType) => {

            let positionName
            // Sets of vairables based on position type
            if (positionType === 'cart_position') {
                positionName = 'Cart'
            }
            if (positionType === 'shelf_position') {
                positionName = 'Shelf'
            }

            if (positionType === 'human_position') {
                positionName = 'Position'
            }
            return (
                <styled.Card>

                    <styled.NewPositionCard style={{ transform: 'translate(-0.4rem, 0.4rem)' }} />
                    <styled.NewPositionCard style={{ transform: 'translate(-0.2rem, 0.2rem)' }} />
                    <styled.NewPositionCard draggable={false}
                        onMouseDown={e => {
                            const newPositionID = uuid()
                            // TODO: Add this to constants
                            dispatchAddPosition({
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
                                _id: newPositionID,
                                map_id: currentMap._id
                            })

                            let { children } = selectedLocation
                            children.push(newPositionID)
                            dispatch(locationActions.setLocationAttributes(selectedLocation._id, { children }))
                        }
                        }
                    >

                        <styled.LocationTypeGraphic fill={PositionTypes[positionType].color} stroke={PositionTypes[positionType].color} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                            {PositionTypes[positionType].svgPath}
                        </styled.LocationTypeGraphic>

                        <styled.LocationTypeLabel>
                            {positionName}
                        </styled.LocationTypeLabel>

                    </styled.NewPositionCard>
                </styled.Card>
            )
        })

    }

    return (
        // Takes care of error when selectedLocation is null, but shelves are still being rendered
        selectedLocation == null ?
            <></>
            :
            <styled.PositionsContainer>

                <ConfirmDeleteModal
                    isOpen={!!confirmDeleteModal}
                    title={"Are you sure you want to delete this Position?"}
                    button_1_text={"Yes"}
                    handleOnClick1={() => {
                        handleDelete(deletingPosition, deletingIndex)
                        setConfirmDeleteModal(null)
                    }}
                    button_2_text={"No"}
                    handleOnClick2={() => setConfirmDeleteModal(null)}
                    handleClose={() => setConfirmDeleteModal(null)}
                />


                {/* Cards for dragging a new position onto the map */}

                {!!MiRMapEnabled &&
                    <>
                        <styled.CardContainer>
                            {handlePositionCards()}
                        </styled.CardContainer>

                        <styled.Label>Associated Positions</styled.Label>
                    </>

                }


                <styled.ListContainer>
                    {positionTypes.map((positionType) => {
                        return (
                            <>
                                {/* <styled.Label style={{fontSize:'1.25rem'}}>{positionType}</styled.Label> */}
                                {handleAssociatedPositions(selectedPositions, positionType)}
                            </>
                        )
                    })}
                    {/* <SortableList
                        positions={selectedPositions}
                        onSortEnd={onSortEnd}
                        useDragHandle={true}
                        lockAxis={'y'}
                        axis={'y'}
                    /> */}
                </styled.ListContainer>
            </styled.PositionsContainer>
    )
}
