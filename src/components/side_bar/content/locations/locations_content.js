import React, { useState } from 'react'
import * as styled from './locations_content.style'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import ContentHeader from '../content_header/content_header'
import Textbox from '../../../basic/textbox/textbox.js'
import Button from '../../../basic/button/button'

import ContentList from '../content_list/content_list'
import Positions from './positions/positions'

import { convertD3ToReal } from '../../../../methods/utils/map_utils'

import * as locationActions from '../../../../redux/actions/locations_actions'
import * as stationActions from '../../../../redux/actions/stations_actions'
import * as positionActions from '../../../../redux/actions/positions_actions'
import * as dashboardActions from '../../../../redux/actions/dashboards_actions'
import * as taskActions from '../../../../redux/actions/tasks_actions'

import * as locationTemplates from './location_templates'

import { setAction } from '../../../../redux/actions/sidebar_actions'
import { deepCopy } from '../../../../methods/utils/utils'

import uuid from 'uuid'

function locationTypeGraphic(type, isSelected) {
    switch (type) {
        case 'shelf_position':
            return (
                <styled.LocationTypeGraphic isSelected={isSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect x="90" y="40" width="15" height="320" rx="5" fill="#6283f0" /><rect x="295" y="40" width="15" height="320" rx="5" fill="#6283f0" /><rect x="80" y="40" width="240" height="20" rx="10" fill="#6283f0" /><rect x="80" y="160" width="240" height="20" rx="10" fill="#6283f0" /><rect x="80" y="280" width="240" height="20" rx="10" fill="#6283f0" /></styled.LocationTypeGraphic>
            )

        case 'workstation':
            return (
                <styled.LocationTypeGraphic isSelected={isSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                    <rect x="100" y="40" width="200" height="320" rx="10" transform="translate(400) rotate(90)" fill="none" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="20" />
                    <rect x="120" y="60" width="160" height="280" rx="2" transform="translate(400) rotate(90)" fill="#6283f0" />
                </styled.LocationTypeGraphic>
            )

        case 'cart_position':
            return (
                <styled.LocationTypeGraphic isSelected={isSelected} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                    <rect x="100" y="40" width="200" height="320" rx="30" transform="translate(400 0) rotate(90)" fill="none" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="20" />
                    <path d="M315.5,200.87l-64,36.95A1,1,0,0,1,250,237v-73.9a1,1,0,0,1,1.5-.87l64,36.95A1,1,0,0,1,315.5,200.87Z" fill="#6283f0" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="10" />
                    <circle cx="200" cy="200" r="15" fill="#6283f0" />
                    <circle cx="150" cy="200" r="10" fill="#6283f0" />
                    <circle cx="102.5" cy="200" r="7.5" fill="#6283f0" />
                </styled.LocationTypeGraphic>

            )
    }
}

// This adds a location selected info to the reducer
export default function LocationContent(props) {

    const dispatch = useDispatch()
    const locations = useSelector(state => state.locationsReducer.locations)
    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const positions = useSelector(state => state.locationsReducer.positions)
    const tasks = useSelector(state => state.tasksReducer.tasks)

    const [editing, toggleEditing] = useState(false)
    const [selectedLocationCopy, setSelectedLocationCopy] = useState(null)
    const [selectedLocationChildrenCopy, setSelectedLocationChildrenCopy] = useState(null)

    function LocationTypeButton({ type, selected }) {

        let template
        switch (type) {
            case 'workstation':
                template = locationTemplates.workstationAttributes
                break
            case 'cart_position':
                template = locationTemplates.cartPositionAttributes
                break
        }

        return (
            <styled.LocationTypeButton
                id={`location-type-button-${type}`}
                draggable={false}

                onMouseDown={async e => {
                    if (selectedLocation.type !== null) { return }
                    await Object.assign(selectedLocation, { ...template, temp: true })
                    await dispatch(locationActions.addLocation(selectedLocation))
                    await dispatch(locationActions.setSelectedLocation(selectedLocation))
                }}

                isSelected={type == selected}
                style={{ cursor: 'grab' }}
            >
                {locationTypeGraphic(type, type == selected)}
            </styled.LocationTypeButton>
        )
    }

    /**
     * This function is called when the back button is pressed. If the location is new, it is deleted;
     * otherwise, it is reverted to the state it was when editing begun.
     */
    const onBack = () => {
        toggleEditing(false)

        //// Revert location
        if (selectedLocation.new == true) { // If the location was new, simply delete it 
            dispatch(locationActions.removeLocation(selectedLocation._id))
        } else { // If the location is not new, revert it to the old copy, and do the same to its children
            dispatch(locationActions.updateLocation(selectedLocationCopy))
            selectedLocationChildrenCopy.forEach(child => dispatch(positionActions.updatePosition(child)))
        }

        dispatch(locationActions.deselectLocation())    // Deselect
        setSelectedLocationCopy(null)                   // Reset the local copy to null
        setSelectedLocationChildrenCopy(null)           // Reset the local children copy to null
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
                    postPositionPromise = dispatch(positionActions.postPosition(child))
                    postPositionPromise.then(postedPosition => {
                        selectedLocation.children[ind] = postedPosition._id
                        dispatch(locationActions.putLocation(selectedLocation, selectedLocation._id))
                    })
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
            if (selectedLocation.schema == 'station') {
                saveChildren(selectedLocation._id)
            }
        }

        dispatch(locationActions.deselectLocation())    // Deselect
        setSelectedLocationCopy(null)                   // Reset the local copy to null
        setSelectedLocationChildrenCopy(null)           // Reset the local children copy to null
        toggleEditing(false)                            // No longer editing

    }

    /**
     * Called when the delete button is pressed. Deletes the location, its children, its dashboards, 
     * and any tasks associated with the location
     */
    const onDelete = () => {
        const locationToDelete = JSON.parse(JSON.stringify(selectedLocation))

        toggleEditing(false)
        dispatch(locationActions.deselectLocation())

        if (locationToDelete.schema == 'station') {
            dispatch(stationActions.deleteStation(locationToDelete._id))

            //// Delete children
            locationToDelete.children.forEach(childID => {
                dispatch(positionActions.deletePosition(positions[childID], childID))
            })

            //// Delete dashboards
            locationToDelete.dashboards.forEach(dashboardID => {
                dispatch(dashboardActions.deleteDashboard(dashboardID))
            })

            //// Delete relevant tasks
            Object.values(tasks)
                .filter(task => task.load.station == locationToDelete._id || task.unload.station == locationToDelete._id)
                .forEach(task => dispatch(taskActions.deleteTask(task._id.$oid)))
        } else {
            dispatch(positionActions.deletePosition(locationToDelete, locationToDelete._id))

            //// Delete Relevant tasks
            Object.values(tasks)
                .filter(task => task.load.position == locationToDelete._id || task.unload.position == locationToDelete._id)
                .forEach(task => dispatch(taskActions.deleteTask(task._id.$oid)))
        }
    }

    if (editing) { // Editing Mode
        return (
            <styled.ContentContainer
                // Delete any new positions that were never dragged onto the map
                onMouseUp={e => {

                }}
            >
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
                    <LocationTypeButton type='workstation' selected={selectedLocation.type}></LocationTypeButton>
                    <LocationTypeButton type='cart_position' selected={selectedLocation.type}></LocationTypeButton>
                </styled.DefaultTypesContainer>
                {/* Will be used later for custom types (Lathe, Cut'it, etc.) */}
                <styled.CustomTypesContainer>
                    {/* <LocationTypeButton></LocationTypeButton>
                    <LocationTypeButton></LocationTypeButton>
                    <LocationTypeButton></LocationTypeButton>
                    <LocationTypeButton></LocationTypeButton> */}
                </styled.CustomTypesContainer>

                {selectedLocation.schema == 'station' ?
                    <Positions />
                    :
                    <div style={{ height: "100%" }}></div>
                }
                {/* Delete Location Button */}
                <Button schema={'locations'} secondary onClick={onDelete}>Delete</Button>
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
                // elements={Object.values(locations).filter(location => location.type !== 'device' )}
                elements={Object.values(locations)}
                onMouseEnter={(location) => dispatch(locationActions.selectLocation(location._id))}
                onMouseLeave={(location) => dispatch(locationActions.deselectLocation())}
                onClick={(location) => {
                    // If location button is clicked, start editing it
                    setSelectedLocationCopy(deepCopy(selectedLocation))
                    if (!!selectedLocation.children) {
                        setSelectedLocationChildrenCopy(selectedLocation.children.map(positionID => deepCopy(positions[positionID])))
                    }
                    toggleEditing(true)
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
                        _id: uuid.v4()
                    }))

                    toggleEditing(true)
                }}
            />
        )
    }
}

