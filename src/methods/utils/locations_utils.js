import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

// Import Actions
import { putDevices, postDevices, getDevices, deleteDevices } from '../../redux/actions/devices_actions'
import * as locationActions from '../../redux/actions/locations_actions'
import * as positionActions from '../../redux/actions/positions_actions'
import * as dashboardActions from '../../redux/actions/dashboards_actions'
import * as stationActions from '../../redux/actions/stations_actions'
import * as taskActions from '../../redux/actions/tasks_actions'
import * as deviceActions from '../../redux/actions/devices_actions'

export const LocationTypes = {
    shelfPosition: {
        svgPath:
            <svg y="70">
                <path d="M263.53,56.31l33,47a10,10,0,0,1-8.18,15.74h-66a10,10,0,0,1-8.19-15.74l33-47A10,10,0,0,1,263.53,56.31Z" />
                <path d="M142.71,56.31l33,47a10,10,0,0,1-8.19,15.74h-66a10,10,0,0,1-8.18-15.74l33-47A10,10,0,0,1,142.71,56.31Z" />
                <circle cx="255.44" cy="146.56" r="12.5" />
                <circle cx="255.44" cy="181.56" r="7.5" />
                <circle stroke='none' cx="134.44" cy="146.56" r="12.5" />
                <circle cx="134.44" cy="181.56" r="7.5" />
                <rect fill='transparent' strokeMiterLimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30" />
            </svg>,

    },

    workstation: {
        svgPath:
            <>
                <rect x="100" y="40" width="200" height="320" rx="10" transform="translate(400) rotate(90)" fill="none" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="20" />
                <rect x="120" y="60" width="160" height="280" rx="2" transform="translate(400) rotate(90)" fill="#6283f0" />
            </>,
        attributes:
        {
            schema: 'station',
            type: 'workstation',
            children: [],
            dashboards: [],
            new: true,
        },
    },

    cartPosition: {
        svgPath:
            <>
                <rect x="100" y="40" width="200" height="320" rx="30" transform="translate(400 0) rotate(90)" fill="none" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="20" />
                <path d="M315.5,200.87l-64,36.95A1,1,0,0,1,250,237v-73.9a1,1,0,0,1,1.5-.87l64,36.95A1,1,0,0,1,315.5,200.87Z" fill="#6283f0" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="10" />
                <circle cx="200" cy="200" r="15" fill="#6283f0" />
                <circle cx="150" cy="200" r="10" fill="#6283f0" />
                <circle cx="102.5" cy="200" r="7.5" fill="#6283f0" />
            </>,
        attributes:
        {
            schema: 'position',
            type: 'cart_position',
            parent: null,
            new: true,
        },
    }
}

/**
 * TODO: NOT WORKING
 * This function is called when the save button is pressed. The location is POSTED or PUT to the backend. 
 * If the location is new and is a station, this function also handles posting the default dashboard and
 * tieing it to this location. Each child position for a station is also either POSTED or PUT. 
 */
export const useSaveLocation = (selectedLocation, positions, selectedDevice) => {

    const dispatch = useDispatch()
    const onDeviceChange = (device, ID) => dispatch(putDevices(device, ID))
    const onSetSelectedDevice = (selectedDevice) => dispatch(deviceActions.setSelectedDevice(selectedDevice))

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
            // TODO: Aren't devices always stations??
            // TODO: Should devices have dashboards?? Yes?
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

                const device = {
                    ...selectedDevice,
                    station_id: postedLocation._id
                }
                onDeviceChange(device, selectedDevice._id)



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
    // setSelectedLocationCopy(null)                   // Reset the local copy to null
    // setSelectedLocationChildrenCopy(null)           // Reset the local children copy to null
    onSetSelectedDevice(null)

    return true
}