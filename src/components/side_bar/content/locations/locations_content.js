import React, { useState, useEffect, useMemo } from 'react'
import * as styled from './locations_content.style'
import { useSelector, useDispatch } from 'react-redux'

// Import components
import ContentHeader from '../content_header/content_header'
import Textbox from '../../../basic/textbox/textbox.js'
import Button from '../../../basic/button/button'
import DropDownSearch from '../../../basic/drop_down_search_v2/drop_down_search'
import ConfirmDeleteModal from '../../../basic/modals/confirm_delete_modal/confirm_delete_modal'

// Import components
import ContentList from '../content_list/content_list'
import Positions from './positions/positions'
import LocationButton from './location_buttons/location_buttons'

import { convertD3ToReal } from '../../../../methods/utils/map_utils'

// Import actions
import { sideBarBack, deleteLocationProcess } from '../../../../redux/actions/locations_actions'
import { setSelectedPosition, setPositionAttributes, addPosition, deletePosition, updatePosition } from '../../../../redux/actions/positions_actions'
import { setSelectedStation, setStationAttributes, addStation, deleteStation, updateStation, setSelectedStationChildrenCopy } from '../../../../redux/actions/stations_actions'

// Import Utils
import { setAction } from '../../../../redux/actions/sidebar_actions'
import { deepCopy } from '../../../../methods/utils/utils'
import { locationsSortedAlphabetically } from '../../../../methods/utils/locations_utils'

import uuid from 'uuid'

// This adds a location selected info to the reducer
export default function LocationContent() {

    const dispatch = useDispatch()

    const dispatchSetSelectedStaion = (station) => dispatch(setSelectedStation(station))
    const dispatchSetStationAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))
    const dispatchAddStation = (station) => dispatch(addStation(station))
    const dispatchSetSelectedStationChildrenCopy = (children) => dispatch(setSelectedStationChildrenCopy(children))

    const dispatchSetSelectedPosition = (position) => dispatch(setSelectedPosition(position))
    const dispatchAddPosition = (pos) => dispatch(addPosition(pos))
    const dispatchSetPositionAttributes = (id, attr) => dispatch(setStationAttributes(id, attr))

    const onSideBarBack = (props) => dispatch(sideBarBack(props))
    const onDeleteLocationProcess = (props) => dispatch(deleteLocationProcess(props))

    const stations = useSelector(state => state.locationsReducer.stations)
    const selectedStation = useSelector(state => state.stationsReducer.selectedStation)
    const selectedPosition = useSelector(state => state.positionsReducer.selectedPosition)
    const positions = useSelector(state => state.locationsReducer.positions)

    const tasks = useSelector(state => state.tasksReducer.tasks)
    const devices = useSelector(state => state.devicesReducer.devices)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const editing = useSelector(state => state.locationsReducer.editingLocation)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)
    const processes = useSelector(state => state.processesReducer.processes)

    const [mergeStation, setMergeStation] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const selectedLocation = !!selectedStation ? selectedStation : selectedPosition

    /**
     * This function is called when the back button is pressed. If the location is new, it is deleted;
     * otherwise, it is reverted to the state it was when editing begun.
     * TODO: FIX THIS JUNKY JUNK (redo location logic, it sucks)
     */
    const onBack = () => {

    }

    /**
     * This function is called when the save button is pressed. The location is POSTED or PUT to the backend.
     * If the location is new and is a station, this function also handles posting the default dashboard and
     * tieing it to this location. Each child position for a station is also either POSTED or PUT.
     */
    const onSave = () => {
    }

    const onDelete = () => {

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

    const onAddLocation = () => {

    }

    const onLocationNameChange = (e) => {
        if(!!selectedStation){
            dispatchSetStationAttributes(selectedStation._id, { name: e.target.value })
        }
        else {
            dispatchSetPositionAttributes(selectedPosition._id, { name: e.target.value })
        }
    }

    const renderStationButtons = () => {
        // If there is a type selected and its not the button type, that means this type has not been selected so gray everything out
        const types = ['human', 'warehouse']

        return types.map((type) => {
            const isSelected = selectedStation.type !== null && selectedStation.type !== type ? true : false;
            return (
                <LocationButton type={'human'} isSelected={isSelected} handleAddLocation={onAddLocation} />
            )
        })

    }

    // TODO: Probably can get rid of editing state, just see if there's a selectedLocation, if there is, you're editing
    if (editing) { // Editing Mode

        let locationTypeName = ''
        if (!!selectedLocation) {
            switch (selectedLocation.type) {

                case 'cart_position':
                    locationTypeName = 'Cart Position'
                    break;

                case 'human':
                    locationTypeName = 'Station'
                    break;

                default:
                    locationTypeName = selectedLocation.type
                    break;
            }
        }
        return (
            <styled.ContentContainer

                // Delete any newf positions that were never dragged onto the map
                onMouseUp={e => {

                }}
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

                    {!!selectedLocation &&
                        <>
                            {!selectedLocation.type ?
                                <>
                                    <>
                                        <styled.LocationTypeContainer>
                                            <LocationTypeButton type='human' selected={selectedLocation.type} />
                                            <styled.LocationTypeLabel>Station</styled.LocationTypeLabel>
                                        </styled.LocationTypeContainer>

                                        <styled.LocationTypeContainer>
                                            <LocationTypeButton type='warehouse' selected={selectedLocation.type} />
                                            <styled.LocationTypeLabel>Warehouse</styled.LocationTypeLabel>
                                        </styled.LocationTypeContainer>
                                    </>

                                    {MiRMapEnabled &&
                                        <>

                                            {/* <styled.LocationTypeContainer>
                                        <LocationTypeButton type='human' selected={selectedLocation.type} />
                                        <styled.LocationTypeLabel>Human Station</styled.LocationTypeLabel>
                                    </styled.LocationTypeContainer> */}

                                            <styled.LocationTypeContainer>
                                                <LocationTypeButton type='cart_position' selected={selectedLocation.type} />
                                                <styled.LocationTypeLabel>Cart Position</styled.LocationTypeLabel>
                                            </styled.LocationTypeContainer>

                                            <styled.LocationTypeContainer>
                                                <LocationTypeButton type='shelf_position' selected={selectedLocation.type} />
                                                <styled.LocationTypeLabel>Shelf Position</styled.LocationTypeLabel>
                                            </styled.LocationTypeContainer>
                                        </>
                                    }
                                </>

                                :
                                <styled.LocationTypeContainer>
                                    <LocationTypeButton type={selectedLocation.type} selected={selectedLocation.type} />
                                    <styled.LocationTypeLabel>{locationTypeName}</styled.LocationTypeLabel>
                                </styled.LocationTypeContainer>
                            }
                        </>
                    }

                </styled.DefaultTypesContainer>
                {/* Will be used later for custom types (Lathe, Cut'it, etc.) */}
                <styled.CustomTypesContainer>
                    {/* <LocationTypeButton></LocationTypeButton>
                    <LocationTypeButton></LocationTypeButton>
                    <LocationTypeButton></LocationTypeButton>
                    <LocationTypeButton></LocationTypeButton> */}
                </styled.CustomTypesContainer>

                {!!selectedLocation &&
                    <>
                        {selectedLocation.schema === 'station' ?
                            <>

                                <Positions handleSetChildPositionToCartCoords={handleSetChildPositionToCartCoords} />

                                {/* {MiRMapEnabled ?
                            <>
                                <Positions type='cart_position' handleSetChildPositionToCartCoords={handleSetChildPositionToCartCoords} />
                                <Positions type='shelf_position' handleSetChildPositionToCartCoords={handleSetChildPositionToCartCoords} />
                            </>
                            :
                            <Positions type='human_position' handleSetChildPositionToCartCoords={handleSetChildPositionToCartCoords} />
                        } */}


                            </>
                            :
                            selectedLocation.type === 'cart_position' || selectedLocation.type === 'shelf_position' ?
                                <>
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

                                    {/* <Button
                                schema={'locations'}
                                secondary
                                onClick={() => {
                                    setMergeStation(true)
                                }}
                                style={{ marginBottom: '.5rem' }}

                            >
                                Merge Position to Station
                            </Button> */}

                                    {/* Commented out for now. Moving merging to inside stations vs inside of positions */}
                                    {/* <styled.Label
                                schema={'locations'}
                            >
                                Merge Position To Station
                            </styled.Label>

                            <DropDownSearch
                                placeholder="Select Station"
                                label="Merge Station"
                                labelField="name"
                                valueField="_id"
                                options={Object.values(stations)}
                                // values={locations ? [locations] : []}
                                dropdownGap={5}
                                noDataLabel="No matches found"
                                closeOnSelect="true"
                                onChange={values => {
                                    setMergeStation(values[0]._id)
                                }}
                                className="w-100"
                            />

                            {!!mergeStation &&

                                <Button
                                    schema={'locations'}
                                    secondary
                                    onClick={() => {
                                        handleMergeToStation()
                                    }}
                                    style={{ marginBottom: '.5rem' }}

                                >
                                    Merge
                                </Button>

                            } */}


                                    <div style={{ height: "100%" }}></div>
                                </>

                                :
                                <div style={{ height: "100%" }}></div>
                        }
                    </>
                }

                {/* Delete Location Button */}
                <Button schema={'locations'} secondary onClick={() => setConfirmDeleteModal(true)} >Delete</Button>
            </styled.ContentContainer>
        )
    } else if (locations === null || locations === undefined) {
        return (
            <></>
        )
    }


    else {    // List Mode
        return (
            <ContentList
                title={'Locations'}
                schema={'locations'}
                // Filters out devices from being displayed in locations
                elements={
                    locationsSortedAlphabetically(Object.values(locations))
                        // Filters out devices, entry positions, other positions and right click to move positions
                        .filter(location => !location.parent && location.type !== 'device' && location.type !== 'cart_entry_position' && location.type !== 'shelf_entry_position' && location.type !== 'charger_entry_position' && location.type !== 'other' && location.name !== 'TempRightClickMovePosition' && (location.map_id === currentMap._id))
                }
                // elements={Object.values(locations)}
                onMouseEnter={(location) => dispatch(locationActions.selectLocation(location._id))}
                onMouseLeave={(location) => dispatch(locationActions.deselectLocation())}
                onClick={(location) => {
                    // If location button is clicked, start editing it
                    onSetSelectedLocationCopy(deepCopy(selectedLocation))
                    if (selectedLocation.children != null && selectedLocation.children != undefined) {
                        dispatchSetSelectedStationChildrenCopy(selectedLocation.children.map(positionID => deepCopy(positions[positionID])))
                    }
                    onEditing(true)
                }}
                onPlus={() => {
                    //// When a new location is created, set the selected location to be a placeholder
                    //// that will be further filled out when the type is selected.
                    dispatch(locationActions.setSelectedLocation({
                        name: '',
                        schema: null,
                        type: null,
                        pos_x: 0,
                        pos_y: 0,
                        rotation: 0,
                        x: 0,
                        y: 0,
                        _id: uuid.v4(),
                        map_id: currentMap._id
                    }))

                    onEditing(true)
                }}
            />
        )
    }
}
