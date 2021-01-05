import React, { useState, useEffect, useMemo } from 'react'
import * as styled from './locations_content.style'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

// Import components
import ContentHeader from '../content_header/content_header'
import Textbox from '../../../basic/textbox/textbox.js'
import Button from '../../../basic/button/button'
import DropDownSearch from '../../../basic/drop_down_search_v2/drop_down_search'
import ConfirmDeleteModal from '../../../basic/modals/confirm_delete_modal/confirm_delete_modal'

// Import components
import ContentList from '../content_list/content_list'
import Positions from './positions/positions'

import { convertD3ToReal } from '../../../../methods/utils/map_utils'

// Import actions
import { setSelectedLocation, setSelectedLocationCopy, setSelectedLocationChildrenCopy, sideBarBack, deleteLocationProcess, editing, deselectLocation } from '../../../../redux/actions/locations_actions'
import { addPosition, removePosition, deletePosition, updatePosition } from '../../../../redux/actions/positions_actions'

import * as locationActions from '../../../../redux/actions/locations_actions'
import * as stationActions from '../../../../redux/actions/stations_actions'
import * as positionActions from '../../../../redux/actions/positions_actions'
import * as dashboardActions from '../../../../redux/actions/dashboards_actions'
import * as taskActions from '../../../../redux/actions/tasks_actions'

// Import Utils
import { setAction } from '../../../../redux/actions/sidebar_actions'
import { deepCopy } from '../../../../methods/utils/utils'
import { LocationTypes, locationsSortedAlphabetically } from '../../../../methods/utils/locations_utils'

import uuid from 'uuid'

function locationTypeGraphic(type, isNotSelected) {
    switch (type) {
        case 'shelf_position':
            return (<styled.LocationTypeGraphic fill={LocationTypes['shelf_position'].color} stroke={LocationTypes['shelf_position'].color} isNotSelected={isNotSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                {LocationTypes['shelf_position'].svgPath}
            </styled.LocationTypeGraphic>
            )

        case 'workstation':
            return (
                <styled.LocationTypeGraphic fill={LocationTypes['workstation'].color} stroke={LocationTypes['workstation'].color} isNotSelected={isNotSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                    {LocationTypes['workstation'].svgPath}
                </styled.LocationTypeGraphic>
            )

        case 'warehouse':
            return (
                <styled.LocationTypeGraphic fill={LocationTypes['warehouse'].color} stroke={LocationTypes['warehouse'].color} isNotSelected={isNotSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                    {LocationTypes['warehouse'].svgPath}
                </styled.LocationTypeGraphic>
            )

        case 'human':
            return (
                <styled.LocationTypeGraphic fill={LocationTypes['human'].color} stroke={LocationTypes['human'].color} isNotSelected={isNotSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                    {LocationTypes['human'].svgPath}
                </styled.LocationTypeGraphic>
            )

        case 'cart_position':
            return (
                <styled.LocationTypeGraphic fill={LocationTypes['cart_position'].color} stroke={LocationTypes['cart_position'].color} isNotSelected={isNotSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                    {LocationTypes['cart_position'].svgPath}
                </styled.LocationTypeGraphic>

            )

        case 'human_position':
            return (
                <styled.LocationTypeGraphic fill={LocationTypes['human_position'].color} stroke={LocationTypes['human_position'].color} isNotSelected={isNotSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                    {LocationTypes['human_position'].svgPath}
                </styled.LocationTypeGraphic>

            )
    }
}

// This adds a location selected info to the reducer
export default function LocationContent() {

    const dispatch = useDispatch()
    const onSetSelectedLocationCopy = (location) => dispatch(setSelectedLocationCopy(location))
    const onSetSelectedLocationChildrenCopy = (locationChildren) => dispatch(setSelectedLocationChildrenCopy(locationChildren))
    const onSetSelectedLocation = (loc) => dispatch(setSelectedLocation(loc))
    const onSideBarBack = (props) => dispatch(sideBarBack(props))
    const onDeleteLocationProcess = (props) => dispatch(deleteLocationProcess(props))
    const onAddPosition = (pos) => dispatch(addPosition(pos))
    const onEditing = (props) => dispatch(locationActions.editing(props))

    const locations = useSelector(state => state.locationsReducer.locations)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const positions = useSelector(state => state.locationsReducer.positions)
    const stations = useSelector(state => state.locationsReducer.stations)
    const tasks = useSelector(state => state.tasksReducer.tasks)
    const selectedLocationCopy = useSelector(state => state.locationsReducer.selectedLocationCopy)
    const selectedLocationChildrenCopy = useSelector(state => state.locationsReducer.selectedLocationChildrenCopy)
    const devices = useSelector(state => state.devicesReducer.devices)
    const currentMap = useSelector(state => state.mapReducer.currentMap)
    const editing = useSelector(state => state.locationsReducer.editingLocation)
    console.log(selectedLocation)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)

    const [mergeStation, setMergeStation] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    function LocationTypeButton({ type, selected }) {

        let template
        switch (type) {
            case 'workstation':
                template = LocationTypes['workstation'].attributes
                break

            case 'cart_position':
                template = LocationTypes['cart_position'].attributes
                break

            case 'human_position':
                template = LocationTypes['human_position'].attributes
                break

            case 'shelf_position':
                template = LocationTypes['shelf_position'].attributes
                break

            case 'warehouse':
                template = LocationTypes['warehouse'].attributes
                break

            case 'human':
                template = LocationTypes['human'].attributes
                break

        }

        // If there is a type selected and its not the button type, that means this type has not been selected so gray everything out
        const isNotSelected = selectedLocation.type !== null && selectedLocation.type !== type ? true : false;

        return (
            <styled.LocationTypeButton
                isNotSelected={isNotSelected}
                id={`location-type-button-${type}`}
                draggable={false}

                onMouseDown={async e => {
                    if (selectedLocation.type !== null) { return }
                    await Object.assign(selectedLocation, { ...template, temp: true, map_id: currentMap._id })
                    await dispatch(locationActions.addLocation(selectedLocation))
                    await dispatch(locationActions.setSelectedLocation(selectedLocation))
                }}

                isSelected={type === selected}
                style={{ cursor: 'grab' }}
            >
                {locationTypeGraphic(type, isNotSelected)}
            </styled.LocationTypeButton>
        )
    }

    useEffect(() => {
        return () => {

        }
    }, [])

    useEffect(() => {

        if (selectedLocationCopy === null) {

            //onEditing(false)
            onSetSelectedLocationCopy(null)                   // Reset the local copy to null
            onSetSelectedLocationChildrenCopy(null)
        }

    }, [selectedLocationCopy])

    /**
     * This function is called when the back button is pressed. If the location is new, it is deleted;
     * otherwise, it is reverted to the state it was when editing begun.
     * TODO: FIX THIS JUNKY JUNK (redo location logic, it sucks)
     */
    const onBack = () => {


        onSideBarBack({ selectedLocation, selectedLocationCopy, selectedLocationChildrenCopy, positions, locations })

        onEditing(false)
    }

    /**
     * This function is called when the save button is pressed. The location is POSTED or PUT to the backend.
     * If the location is new and is a station, this function also handles posting the default dashboard and
     * tieing it to this location. Each child position for a station is also either POSTED or PUT.
     */
    const onSave = () => {
        const saveChildren = (locationID) => {
            //// Function to save the children of a posted station
            // Since the child has a .parent attribute, this function needs to be given the station's id
            let postPositionPromise, child
            selectedLocation.children.forEach((childID, ind) => {
                child = positions[childID]
                child.parent = locationID
                if (child.new) { // If the position is new, post it and update its id in the location.children array
                    dispatch(positionActions.postPosition(child))
                    selectedLocation.children[ind] = child._id
                    dispatch(locationActions.putLocation(selectedLocation, selectedLocation._id))

                } else { //  If the position is not new, just update it
                    dispatch(positionActions.putPosition(child, child._id))
                }
            })
        }

        //// Post the location
        if (selectedLocation.new == true) {
            const locationPostPromise = dispatch(locationActions.postLocation(selectedLocation))
            locationPostPromise.then(postedLocation => {
                //// On return of the posted location, if it is a station we also need to assign it a default dashboard
                if (postedLocation.schema == 'station') {
                    let defaultDashboard = {
                        name: postedLocation.name + ' Dashboard',
                        buttons: [],
                        station: postedLocation._id
                    }

                    //// Now post the dashboard, and on return tie that dashboard to location.dashboards and put the location
                    const postDashboardPromise = dispatch(dashboardActions.postDashboard(defaultDashboard))
                    postDashboardPromise.then(postedDashboard => {
                        postedLocation.dashboards = [postedDashboard._id.$oid]
                        dispatch(stationActions.putStation(postedLocation, postedLocation._id))
                    })

                    saveChildren(postedLocation._id)

                }
            })
        } else { // If the location is not new, PUT it and update it's children
            dispatch(locationActions.putLocation(selectedLocation, selectedLocation._id))
            if (selectedLocation.schema === 'station') {
                saveChildren(selectedLocation._id)
            }
        }

        dispatch(locationActions.deselectLocation())    // Deselect
        onSetSelectedLocationCopy(null)                 // Reset the local copy to null
        onSetSelectedLocationChildrenCopy(null)         // Reset the local children copy to null
        onEditing(false)                            // No longer editing

    }

    const onDelete = () => {

        onDeleteLocationProcess({ selectedLocation, locations, positions, tasks })
        onEditing(false)

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
                // onSetSelectedLocation({newSelectedLocation})
                await dispatch(locationActions.addLocation(updatedSelectedLocation))
                await dispatch(locationActions.setSelectedLocation(updatedSelectedLocation))
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

                dispatch(positionActions.addPosition(updatedPosition))

            }
        })
    }

    const handleMergeToStation = () => {

        let station = stations[mergeStation]

        station.children.push(selectedLocation._id)
        selectedLocation.parent = mergeStation

    }

    // TODO: Probably can get rid of editing state, just see if there's a selectedLocation, if there is, you're editing
    if (editing) { // Editing Mode

        let locationTypeName = ''
        if (!!selectedLocation) {
            switch (selectedLocation.type) {
                case 'workstation':
                    locationTypeName = 'Station'
                    break;

                case 'human_position':
                    locationTypeName = 'Position'
                    break;

                case 'cart_position':
                    locationTypeName = 'Cart Position'
                    break;

                case 'human_position':
                    locationTypeName = 'Position'
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
                isOpen = {!!confirmDeleteModal}
                title={"Are you sure you want to delete this Location?"}
                button_1_text={"Yes"}
                handleOnClick1 = {()=>{
                  onDelete()
                  setConfirmDeleteModal(null)
                }}
                button_2_text={"No"}
                handleOnClick2 = {()=> setConfirmDeleteModal(null)}
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
                        if (selectedLocation.type !== null) {
                            dispatch(locationActions.setLocationAttributes(selectedLocation._id, { name: e.target.value }))
                        } else { // If the type has not been selected, this location does not exist in the reducer and needs to be changed directly
                            Object.assign(selectedLocation, { name: e.target.value })
                            dispatch(locationActions.setSelectedLocation(selectedLocation))
                        }
                    }}
                    style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                </Textbox>
                {/* Location Type */}
                <styled.DefaultTypesContainer>


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

                </styled.DefaultTypesContainer>
                {/* Will be used later for custom types (Lathe, Cut'it, etc.) */}
                <styled.CustomTypesContainer>
                    {/* <LocationTypeButton></LocationTypeButton>
                    <LocationTypeButton></LocationTypeButton>
                    <LocationTypeButton></LocationTypeButton>
                    <LocationTypeButton></LocationTypeButton> */}
                </styled.CustomTypesContainer>

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
                        .filter(location => !location.parent && location.type !== 'device' && location.type !== 'cart_entry_position' && location.type !== 'shelf_entry_position' && location.type !== 'charger_entry_position' && location.type !== 'other' && location.name !== 'TempRightClickMoveLocation' && (location.map_id === currentMap._id))
                }
                // elements={Object.values(locations)}
                onMouseEnter={(location) => dispatch(locationActions.selectLocation(location._id))}
                onMouseLeave={(location) => dispatch(locationActions.deselectLocation())}
                onClick={(location) => {
                    // If location button is clicked, start editing it
                    onSetSelectedLocationCopy(deepCopy(selectedLocation))
                    if (selectedLocation.children != null && selectedLocation.children != undefined) {
                        onSetSelectedLocationChildrenCopy(selectedLocation.children.map(positionID => deepCopy(positions[positionID])))
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
