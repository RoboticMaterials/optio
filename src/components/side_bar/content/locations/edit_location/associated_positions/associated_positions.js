import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as styled from './associated_positions.style'

import { sortableElement, sortableHandle } from 'react-sortable-hoc';

// Import Components
import MinusButton from '../../../../../basic/minus_button/minus_button'
import Textbox from '../../../../../basic/textbox/textbox'
import ConfirmDeleteModal from '../../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import AssociatedPositionCard from './associated_position_card/associated_position_card'

import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

// Import Actions
import { setStationAttributes } from '../../../../../../redux/actions/stations_actions'
import { setPositionAttributes, deletePosition, addPosition, postPosition, setSelectedStationChildrenCopy } from '../../../../../../redux/actions/positions_actions'
import * as positionActions from '../../../../../../redux/actions/positions_actions'
import { deleteTask } from '../../../../../../redux/actions/tasks_actions'
import { pageDataChanged } from '../../../../../../redux/actions/sidebar_actions'
import { deepCopy } from '../../../../../../methods/utils/utils'

// Import Constants
import { PositionTypes, newPositionTemplate } from '../../../../../../constants/position_constants'
import { setSelectedStation } from '../../../../../../redux/actions/stations_actions';

export default function Positions(props) {

    const {
        handleSetChildPositionToCartCoords,
    } = props

    const dispatch = useDispatch()
    const dispatchSetPositionAttributes = (id, attr) => dispatch(setPositionAttributes(id, attr))
    const dispatchDeletePosition = (id) => dispatch(deletePosition(id))
    const dispatchAddPosition = (position) => dispatch(addPosition(position))
    const disptachPostPosition = (position) => dispatch(postPosition(position))
    const dispatchSetSelectedStationChildrenCopy = (positions) => dispatch(setSelectedStationChildrenCopy(positions))
    const dispatchPageDataChanged = (bool) => dispatch(pageDataChanged(true))
    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))

    const positions = useSelector(state => state.positionsReducer.positions)
    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const currentMapId = useSelector(state => state.settingsReducer.settings.currentMapId)
    const maps = useSelector(state => state.mapReducer.maps)
    const currentMap = Object.values(maps).find(map => map.id === currentMapId)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)
    const selectedStationChildrenCopy = useSelector(state => state.positionsReducer.selectedStationChildrenCopy)
    const serverSettings = useSelector(state => state.settingsReducer.settings)
    const deviceEnabled = serverSettings.deviceEnabled

    const [editingIndex, setEditingIndex] = useState(null)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [deletingIndex, setDeletingIndex] = useState()
    const [deletingPosition, setDeletingPosition] = useState()
    const [mostRecentPositionId, setMostRecentPositionId] = useState(null)

    const positionTypes = !!MiRMapEnabled ? ['cart_position', 'shelf_position',] : []

    /**
     * Handles deleting positions
     * Does some different things based on if the position is new or not (see comments bellow)
     * TODO: FIX THIS SHIT!
     * @param {*} position
     */
    const onDelete = (position) => {
        dispatchDeletePosition(position.id)
    }

    const renderAssociatedPositions = () => {
        return positionTypes.map((positionType) => {
            return Object.values(selectedStationChildrenCopy).map((position, i) => {
                if (position.type === positionType) {
                    return (
                        <styled.PositionListItem key={`associatecd_pos_${i}`}>


                            <MinusButton
                                onClick={() => {
                                    setConfirmDeleteModal(true)
                                    setDeletingIndex(i)
                                    setDeletingPosition(position)
                                }}
                                style={{color: PositionTypes[positionType].color}}
                            />
                            <Textbox
                                style={{ flex: '1' }}
                                textboxContainerStyle={{flex: '1', marginLeft: '0.3rem'}}
                                schema="locations"
                                focus={i == editingIndex}
                                // defaultValue={position.name}
                                value={position.name}
                                onChange={(e) => {
                                    setEditingIndex(i)
                                    dispatchPageDataChanged(true)
                                    dispatch(positionActions.setPositionAttributes(position.id, { name: e.target.value }))
                                }}

                            />


                            {/* If not a human position, then add ability to use cart location */}
                            {position.type !== 'human_position' &&
                                <styled.CartIcon className='icon-cart' onClick={() => handleSetChildPositionToCartCoords(position)} style={{color: PositionTypes[positionType].color}}/>
                            }

                            {/* Commenting out for now, not working with constent updating */}
                            {/* <DragHandle></DragHandle> */}


                        </styled.PositionListItem>
                    )
                }
            })
        })



    }

    // TODO: Comment
    const onAddAssociatedPosition = async (type) => {

        // const newPositionName = selectedStation.name + ' ' + (selectedStation.children.filter((position) => positions[position].type === type).length + 1)
        const newPositionName = `${type === 'cart_position' ? 'Cart Position' : 'Shelf Position'}` + ' ' + (selectedStation.children.filter((position) => positions[position].type === type).length + 1)

        const newPositionType = type

        const newPosition = newPositionTemplate(newPositionName, newPositionType, selectedStation.id, currentMap.id)

        await dispatchSetSelectedStationChildrenCopy({
            ...selectedStationChildrenCopy,
            [newPosition.id]: newPosition
        })


        await dispatchAddPosition(newPosition)

        let { children } = selectedStation
        children.push(newPosition.id)

        setMostRecentPositionId(newPosition.id)
        dispatchSetStationAttributes(selectedStation.id, { children })
    }

    const onDeleteAssociatedPosition = async () => {
        await onDelete(deletingPosition)
        setConfirmDeleteModal(null)
    }

    const renderPositionCards = () => {

        return positionTypes.map((positionType) =>
            <AssociatedPositionCard
                positionType={positionType}
                handleAddPosition={onAddAssociatedPosition}
                handleDeletePosition={() => {
                    onDelete(selectedStationChildrenCopy[mostRecentPositionId])
                }}
            />
        )
    }

    return (

        <styled.PositionsContainer>

            <ConfirmDeleteModal
                isOpen={!!confirmDeleteModal}
                title={"Are you sure you want to delete this Position?"}
                button_1_text={"Yes"}
                handleOnClick1={async () => {
                    await onDeleteAssociatedPosition()
                }}
                button_2_text={"No"}
                handleOnClick2={() => setConfirmDeleteModal(null)}
                handleClose={() => setConfirmDeleteModal(null)}
            />


            {/* Cards for dragging a new position onto the map */}

            {!!deviceEnabled &&
                <>
                    <styled.CardContainer>
                        {renderPositionCards()}
                    </styled.CardContainer>

                    <styled.Label>Associated Positions</styled.Label>
                </>

            }


            <styled.ListContainer>
                {!!selectedStationChildrenCopy &&
                    renderAssociatedPositions()
                }
            </styled.ListContainer>
        </styled.PositionsContainer>
    )
}
