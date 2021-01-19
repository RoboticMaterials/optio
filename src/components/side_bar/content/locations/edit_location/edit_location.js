import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as styled from './edit_location.style'

// Import Components
import LocationButton from './location_button/location_button'
import ContentHeader from '../../content_header/content_header'
import ConfirmDeleteModal from '../../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import AssociatedPositions from './associated_positions/associated_positions'

// Import Basic Components
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'
import Textbox from '../../../../basic/textbox/textbox.js'
import Button from '../../../../basic/button/button'

// Import actions
import { sideBarBack, deleteLocationProcess } from '../../../../../redux/actions/locations_actions'
import { setSelectedPosition, setPositionAttributes, addPosition, deletePosition, updatePosition, setEditingPosition } from '../../../../../redux/actions/positions_actions'
import { setSelectedStation, setStationAttributes, addStation, deleteStation, updateStation, setSelectedStationChildrenCopy, setEditingStation } from '../../../../../redux/actions/stations_actions'


const EditLocation = () => {
    const dispatch = useDispatch()

    const dispatchSetSelectedStaion = (station) => dispatch(setSelectedStation(station))
    const dispatchSetEditingStation = (bool) => dispatch(setEditingStation(bool))
    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchAddStation = (station) => dispatch(addStation(station))
    const dispatchSetSelectedStationChildrenCopy = (children) => dispatch(setSelectedStationChildrenCopy(children))

    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))
    const dispatchAddPosition = (pos) => dispatch(addPosition(pos))
    const dispatchSetPositionAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchSetEditingPosition = (bool) => dispatch(setEditingPosition(bool))

    const stations = useSelector(state => state.stationsReducer.stations)
    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const positions = useSelector(state => state.positionsReducer.positions)

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const devices = useSelector(state => state.devicesReducer.devices)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)
    const processes = useSelector(state => state.processesReducer.processes)

    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const selectedLocation = !!selectedStation ? selectedStation : selectedPosition

    /**
     * This function is called when the save button is pressed. The location is POSTED or PUT to the backend.
     * If the location is new and is a station, this function also handles posting the default dashboard and
     * tieing it to this location. Each child position for a station is also either POSTED or PUT.
     */
    const onSave = () => {
    }

    const onDelete = () => {

    }

    const onBack = () => {
        dispatchSetEditingStation(false)
        dispatchSetEditingPosition(false)

        dispatchSetSelectedPosition(null)
        dispatchSetSelectedStaion(null)
    }

    const onAddLocation = () => {

    }

    const onLocationNameChange = (e) => {
        if (!!selectedStation) {
            dispatchSetStationAttributes(selectedStation._id, { name: e.target.value })
        }
        else {
            dispatchSetPositionAttributes(selectedPosition._id, { name: e.target.value })
        }
    }

    const handleSetPositionToCartCoords = async () => {

        Object.values(devices).map(async (device, ind) => {
            if (device.device_model === 'MiR100') {
                const devicePosition = device.position

                const updatedSelectedLocation = {
                    ...selectedLocation,
                    pos_x: devicePosition.pos_x,
                    pos_y: devicePosition.pos_y,
                    x: devicePosition.x,
                    y: devicePosition.y,
                    rotation: devicePosition.orientation,
                }

                // Not sure why onSetSelectedLocation is not working, should be the same as a normal dispatch...
                await dispatchAddPosition(updatedSelectedLocation)
                await dispatchSetSelectedPosition(updatedSelectedLocation)
            }
        })
    }

    const handleSetChildPositionToCartCoords = (position) => {
        Object.values(devices).map(async (device, ind) => {
            if (device.device_model === 'MiR100') {
                const devicePosition = device.position

                const updatedPosition = {
                    ...position,
                    pos_x: devicePosition.pos_x,
                    pos_y: devicePosition.pos_y,
                    x: devicePosition.x,
                    y: devicePosition.y,
                    rotation: devicePosition.orientation,
                }

                dispatchAddPosition(updatedPosition)

            }
        })
    }


    const renderStationButtons = () => {
        // If there is a type selected and its not the button type, that means this type has not been selected so gray everything out
        const types = ['human', 'warehouse']

        return types.map((type) => {
            const isSelected = selectedStation.type !== null && selectedStation.type !== type ? true : false;
            return (
                <LocationButton type={type} isSelected={isSelected} handleAddLocation={onAddLocation} />
            )
        })

    }

    const renderPositionButtons = () => {
        const types = ['cart_position', 'shelf_position']

        return types.map((type) => {
            const isSelected = selectedStation.type !== null && selectedStation.type !== type ? true : false;
            return (
                <LocationButton type={type} isSelected={isSelected} handleAddLocation={onAddLocation} />
            )
        })
    }

    return (
        <>
            <styled.ContentContainer
            >

                <ConfirmDeleteModal
                    isOpen={!!confirmDeleteModal}
                    title={"Are you sure you want to delete this Location?"}
                    button_1_text={"Yes"}
                    handleOnClick1={() => {
                        onDelete()
                        setConfirmDeleteModal(null)
                    }}
                    button_2_text={"No"}
                    handleOnClick2={() => setConfirmDeleteModal(null)}
                    handleClose={() => setConfirmDeleteModal(null)}
                />

                <div style={{ marginBottom: '1rem' }}>

                    <ContentHeader
                        content={'locations'}
                        mode={'create'}
                        onClickBack={onBack}
                        onClickSave={onSave}

                    />
                </div>
                {/* Location Title */}
                <Textbox
                    placeholder="Location Name"
                    defaultValue={!!selectedLocation && selectedLocation.name}
                    schema={'locations'}
                    focus={!!selectedLocation && selectedLocation.type == null}
                    onChange={(e) => {
                        onLocationNameChange(e)
                    }}
                    style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                </Textbox>
                {/* Location Type */}
                <styled.DefaultTypesContainer>

                    {!selectedLocation.type ?
                        <>
                            <>
                                {renderStationButtons()}
                            </>

                            {MiRMapEnabled &&
                                <>

                                    {renderPositionButtons()}

                                </>
                            }
                        </>

                        :
                        <LocationButton type={selectedLocation.type} isSelected={true} handleAddLocation={onAddLocation} />

                    }

                </styled.DefaultTypesContainer>

                {selectedLocation.schema === 'station' ?

                    <AssociatedPositions handleSetChildPositionToCartCoords={handleSetChildPositionToCartCoords} />
                    :
                    <Button
                        schema={'locations'}
                        secondary
                        onClick={() => {
                            handleSetPositionToCartCoords()
                        }}
                        style={{ marginBottom: '1rem' }}
                    >
                        Use Cart Location
                    </Button>
                }
                <div style={{ height: "100%" }}></div>


                {/* Delete Location Button */}
                <Button schema={'locations'} secondary onClick={() => setConfirmDeleteModal(true)} >Delete</Button>
            </styled.ContentContainer>
    )
        </>
    )
}

export default EditLocation