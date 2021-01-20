import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import uuid from 'uuid'

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

// Import Constants
import { StationTypes } from '../../../../../constants/station_constants'
import { PositionTypes } from '../../../../../constants/position_constants'

// Import actions
import { setSelectedPosition, setPositionAttributes, addPosition, deletePosition, updatePosition, setEditingPosition } from '../../../../../redux/actions/positions_actions'
import { setSelectedStation, setStationAttributes, addStation, deleteStation, updateStation, setSelectedStationChildrenCopy, setEditingStation, putStation, postStation } from '../../../../../redux/actions/stations_actions'


const EditLocation = () => {
    const dispatch = useDispatch()

    // Station Dispatches
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetEditingStation = (bool) => dispatch(setEditingStation(bool))
    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchAddStation = (station) => dispatch(addStation(station))
    const dispatchSetSelectedStationChildrenCopy = (children) => dispatch(setSelectedStationChildrenCopy(children))
    const dispatchPutStation = async (station) => await dispatch(putStation(station))
    const dispatchPostStation = async (station) => await dispatch(postStation(station))
    const dispatchDeleteStation = async (id) => await dispatch(deleteStation(id))

    // Position Dispatches
    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))
    const dispatchAddPosition = (pos) => dispatch(addPosition(pos))
    const dispatchSetPositionAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchSetEditingPosition = (bool) => dispatch(setEditingPosition(bool))
    const dispatchDeletePosition = async (id) => dispatch(deletePosition(id))

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

    const LocationTypes = {
        ...StationTypes,
        ...PositionTypes,
    }

    /**
     * This function is called when the save button is pressed. The location is POSTED or PUT to the backend.
     * If the location is new and is a station, this function also handles posting the default dashboard and
     * tieing it to this location. Each child position for a station is also either POSTED or PUT.
     */
    const onSave = async () => {

        // Station
        if (!!selectedStation) {

            // Post
            if (!!selectedStation.new) {
                await dispatchPostStation(selectedStation)

                // Add dashboard
            }
            // Put
            else {
                await dispatchPutStation(selectedStation)
            }

            // Children Positions
            selectedStation.children.map((child, ind) => {

            })
        }

        // Position
        else {

        }

        onBack()


    }

    const onDelete = () => {

        // Station 
        if (selectedLocation.schema === 'station') {
            dispatchDeleteStation(selectedStation._id)
        }

        // Position
        else {
            dispatchDeletePosition(selectedPosition._id)
        }

        onBack()
    }

    const onBack = () => {
        dispatchSetEditingStation(false)
        dispatchSetEditingPosition(false)

        dispatchSetSelectedPosition(null)
        dispatchSetSelectedStation(null)
    }

    /**
     * The X and Y here are set in map view view dragNewEntity
     */
    const onAddLocation = async (e, type) => {

        // TODO: Stick this into Constants
        const defaultAttributes = {
            name: '',
            schema: null,
            type: null,
            pos_x: 0,
            pos_y: 0,
            rotation: 0,
            x: 0,
            y: 0,
            _id: uuid.v4(),
            map_id: currentMap._id,
            temp: true
        }

        const attributes = LocationTypes[type].attributes

        const newStation = {
            ...defaultAttributes,
            ...attributes
        }
        console.log('QQQQ Whats here?', e, newStation)

        // Handle Station addition
        if (attributes.schema === 'station') {
            await dispatchAddStation(newStation)
            await dispatchSetSelectedStation(newStation)
        }

        else if (attributes.schema === 'position') {

        }

        else {
            throw ('Schema Does Not exist')
        }
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
            const isSelected = (!!selectedStation && selectedStation.type !== null && selectedStation.type === type) ? selectedStation.type : false;
            return (
                <LocationButton type={type} isSelected={isSelected} handleAddLocation={onAddLocation} />
            )
        })

    }

    const renderPositionButtons = () => {
        const types = ['cart_position', 'shelf_position']

        return types.map((type) => {
            const isSelected = (!!selectedPosition && selectedPosition.type !== null && selectedPosition.type !== type) ? selectedPosition.type : false;
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

                    {!selectedLocation ?
                        <>
                            <styled.LocationTypeContainer>
                                <styled.Label schema={'locations'}>Stations</styled.Label>
                                {renderStationButtons()}
                            </styled.LocationTypeContainer>

                            {MiRMapEnabled &&
                                <styled.LocationTypeContainer>
                                    <styled.Label schema={'locations'}>Positions</styled.Label>
                                    {renderPositionButtons()}

                                </styled.LocationTypeContainer>
                            }
                        </>

                        :
                        <LocationButton
                            type={selectedLocation.type}
                            isSelected={(!!selectedLocation && selectedLocation.type !== null) ? selectedLocation.type : false}
                            handleAddLocation={onAddLocation}
                        />

                    }

                </styled.DefaultTypesContainer>

                {(!!selectedLocation && selectedLocation.schema === 'station') ?

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