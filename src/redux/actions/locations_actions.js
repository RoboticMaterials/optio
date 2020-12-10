import { useDispatch, useSelector } from 'react-redux'

import {
    SELECT_LOCATION,
    SET_SELECTED_LOCATION,
    SET_SELECTED_LOCATION_COPY,
    SET_SELECTED_LOCATION_CHILDREN_COPY,
    DESELECT_LOCATION,
    WIDGET_LOADED,
    EDITING_LOCATION,
} from '../types/locations_types'

import * as stationActions from './stations_actions.js'
import { deleteStation } from './stations_actions.js'
import * as positionActions from './positions_actions.js'
import { deletePosition } from './positions_actions.js'
import { setSelectedDevice, putDevices } from './devices_actions'
import { deleteDashboard } from './dashboards_actions'
import { deleteTask } from './tasks_actions'

import { deepCopy } from '../../methods/utils/utils';
import uuid from 'uuid';


// get
// ******************************
export const getLocations = () => {
    return async dispatch => {
        const stations = await dispatch(stationActions.getStations())
        const positions = await dispatch(positionActions.getPositions())
        return ({ stations: stations, positions: positions })
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// post
// ******************************
export const postLocation = (location) => {
    return async dispatch => {
        if (location.schema == 'station') {
            return dispatch(stationActions.postStation(location))
        } else if (location.schema == 'position') {
            return dispatch(positionActions.postPosition(location))
        }
    }
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// put
// ******************************
export const putLocation = (location, ID) => {
    return async dispatch => {
        if (location.schema == 'station') {
            return dispatch(stationActions.putStation(location, ID))
        } else if (location.schema == 'position') {
            return dispatch(positionActions.putPosition(location, ID))
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deleteLocation = (id) => {
    return async dispatch => {
        dispatch(stationActions.deleteStation(id))
        // TODO: Why is this here? Is this a catch because it may either be a position or location?
        // dispatch(positionActions.deletePosition(id))
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const addLocation = (location) => {
    return async dispatch => {
        if (location.schema == 'station') {
            dispatch(stationActions.addStation(location))
        } else if (location.schema == 'position') {
            dispatch(positionActions.addPosition(location))
        }
    }
}

export const updateLocation = (location) => {
    return async dispatch => {
        if (location.schema == 'station') {
            dispatch(stationActions.updateStation(location))
        } else if (location.schema == 'position') {
            dispatch(positionActions.updatePosition(location))
        }

    }
}

export const updateChildren = (location) => {
    return async dispatch => {



        dispatch(stationActions.updateStation(location))
        dispatch(positionActions.updatePosition(location))

    }
}


export const updateLocations = (locations) => {
    return async dispatch => {
        Object.values(locations).forEach(location => {
            if (location.schema == 'station') {
                dispatch(stationActions.updateStation(location))
            } else if (location.schema == 'position') {
                dispatch(positionActions.updatePosition(location))
            }
        })
    }
}

export const removeLocation = (location) => {

    const {
        _id,
        children
    } = location

    if (location.schema === 'station') {

        return async dispatch => {
            dispatch(stationActions.removeStation(_id))

            children.forEach((child) => {
                dispatch(positionActions.removePosition(child))
            })
        }
    }

    else if (location.schema === 'position') {
        return async dispatch => {
            dispatch(positionActions.removePosition(_id))
        }
    }
}

export const setLocationAttributes = (id, attr) => {
    return async dispatch => {
        dispatch(stationActions.setStationAttributes(id, attr))
        dispatch(positionActions.setPositionAttributes(id, attr))
    }
}

export const selectLocation = (id) => {
    return { type: SELECT_LOCATION, payload: { id } }
}

export const setSelectedLocation = (location) => {
    return { type: SET_SELECTED_LOCATION, payload: { location } }
}

export const deselectLocation = () => {
    return { type: DESELECT_LOCATION }
}

export const setSelectedLocationCopy = (location) => {
    return { type: SET_SELECTED_LOCATION_COPY, payload: location }
}

export const setSelectedLocationChildrenCopy = (locationChildren) => {
    return { type: SET_SELECTED_LOCATION_CHILDREN_COPY, payload: locationChildren }
}

export const widgetLoaded = (bool) => {
    return { type: WIDGET_LOADED, payload: bool }
}

export const editing = (bool) => {
    return { type: EDITING_LOCATION, payload: bool }
}


// ======================================== //
//                                          //
//  Back, Delete, Save Location Functions   //
//                                          //
// ======================================== //


/**
 * This handles when the back button is pressed on either devices or locations
 * If the location is new, it is deleted;
 * otherwise, it is reverted to the state it was when editing begun.
 * @param {*} props
 */

export const sideBarBack = (props) => {
    // Does a quick check to make sure there is a location, if not then just return an arbitrary dispatch
    // Redux requires a dispatch here (I think...) so I just use setselectedDevice since it wont have any side effects (again... I think...)
    if (props.selectedLocation === null || props.selectedLocation.schema === null) {
        return async dispatch => {
            dispatch(deselectLocation())
            dispatch(setSelectedDevice(null))
        }
    }

    const {
        selectedLocation,
        selectedLocationCopy,
        selectedLocationChildrenCopy,
        positions,
        locations
    } = props
    return async dispatch => {
        //// Revert location
        if (selectedLocation.new == true) { // If the location was new, simply delete it
            dispatch(removeLocation(selectedLocation))

        } else { // If the location is not new, revert it to the old copy, and do the same to its children
            let upatedChildren = []
            if (selectedLocationChildrenCopy != null) {

                selectedLocation.children.map((child, ind) => {
                    if( !!positions[child].new ){
                        dispatch(positionActions.removePosition(child))
                    }
                })

                selectedLocationChildrenCopy.forEach(async (child, ind) => {

                    // If a child in the copy is udnefined (It's undefined because its been deleted from the backend)
                    // then delete the location from the copy
                    if (positions[child._id] === undefined) {
                        selectedLocationChildrenCopy.splice(ind, 1)
                        dispatch(positionActions.removePosition(child._id))


                    }




                    // Else keep the child
                    else {
                        upatedChildren.push(child._id)
                    }


                })
            }

            // TODO: This is just sloppy... 
            // The original copy should be stored in stations in the stations reducer
            // And the edited copy should be the 'selectedLocation'
            // For some reason, the station in stations is being edited as well
            const selectedLocationCopyUpdated = {
                ...selectedLocationCopy,
                children: upatedChildren,
            }
            dispatch(deselectLocation())    // Deselect
            dispatch(updateLocation(selectedLocationCopyUpdated))

            // The old copy of the location should still be in redux since the edited location is the selectedLocation
            // dispatch(updateLocation(locations[selectedLocation._id]))
        }

        dispatch(setSelectedLocationCopy(null))
        dispatch(setSelectedLocationChildrenCopy(null))

        dispatch(deselectLocation())    // Deselect

        dispatch(setSelectedDevice(null))
    }
}





/**
* Called when the delete button is pressed. Deletes the location, its children, its dashboards,
* and any tasks associated with the location
*/
export const deleteLocationProcess = (props) => {

    const {
        selectedLocation,
        locations,
        selectedDevice,
        positions,
        tasks,
    } = props

    let locationToDelete = {}

    // Id device, Grabs location to delete by finding the station_id corresponding with the device
    if (selectedLocation.type === 'device') {
        locationToDelete = locations[selectedDevice.station_id]

    } else {
        locationToDelete = deepCopy(selectedLocation)
    }

    return async dispatch => {

        dispatch(deselectLocation())

        // If locationToDelete is undefined, that means it's not in the backend so it must not have been posted yet. So just remove location from front end, set selected device to null and return
        if (locationToDelete === undefined) {
            dispatch(removeLocation(selectedLocation))
            dispatch(setSelectedDevice(null))
            return
        }

        if (locationToDelete.schema == 'station') {

            //// Delete children
            locationToDelete.children.forEach(async childID => {
                await dispatch(deletePosition(positions[childID], childID))
            })

            //// Delete dashboards
            locationToDelete.dashboards.forEach(async dashboardID => {
                await dispatch(deleteDashboard(dashboardID))
            })

            //// Delete relevant tasks
            Object.values(tasks)
                .filter(task => task.load.station == locationToDelete._id || task.unload.station == locationToDelete._id)
                .forEach(async task => await dispatch(deleteTask(task._id)))

            // Delete Station
            await dispatch(deleteStation(locationToDelete._id))

        } else {

            // dispatch(positionActions.deletePosition(locationToDelete))
            dispatch(deletePosition(locationToDelete, locationToDelete._id))

            //// Delete Relevant tasks
            Object.values(tasks)
                .filter(task => task.load.position == locationToDelete._id || task.unload.position == locationToDelete._id)
                .forEach(task => dispatch(deleteTask(task._id)))
        }

        // If Device, delete the station_id attatched to the device as well
        if (!!selectedDevice) {
            delete selectedDevice.station_id
            dispatch(putDevices(selectedDevice, selectedDevice._id))
        }

        dispatch(setSelectedDevice(null))
    }
}


// export const saveLocationProcess = (props) => {

//     const saveChildren = (locationID) => {

//         //// Function to save the children of a posted station
//         // Since the child has a .parent attribute, this function needs to be given the station's id
//         let postPositionPromise, child
//         selectedLocation.children.forEach((childID, ind) => {
//             child = positions[childID]
//             child.parent = locationID
//             if (child.new) { // If the position is new, post it and update its id in the location.children array
//                 postPositionPromise = dispatch(positionActions.postPosition(child))
//                 postPositionPromise.then(postedPosition => {
//                     selectedLocation.children[ind] = postedPosition._id
//                     dispatch(putLocation(selectedLocation, selectedLocation._id))
//                 })
//             } else { //  If the position is not new, just update it
//                 dispatch(positionActions.putPosition(child, child._id))
//             }
//         })
//     }

//     //// Post the location
//     if (selectedLocation.new == true) {
//         const locationPostPromise = dispatch(postLocation(selectedLocation))
//         locationPostPromise.then(postedLocation => {
//             //// On return of the posted location, if it is a station we also need to assign it a default dashboard
//             // TODO: Aren't devices always stations??
//             // TODO: Should devices have dashboards?? Yes?
//             if (postedLocation.schema == 'station') {
//                 let defaultDashboard = {
//                     name: postedLocation.name + ' Dashboard',
//                     buttons: [],
//                     station: postedLocation._id
//                 }

//                 //// Now post the dashboard, and on return tie that dashboard to location.dashboards and put the location
//                 const postDashboardPromise = dispatch(dashboardActions.postDashboard(defaultDashboard))
//                 postDashboardPromise.then(postedDashboard => {
//                     postedLocation.dashboards = [postedDashboard._id.$oid]
//                     dispatch(stationActions.putStation(postedLocation, postedLocation._id))
//                 })

//                 const device = {
//                     ...selectedDevice,
//                     station_id: postedLocation._id
//                 }
//                 onDeviceChange(device, selectedDevice._id)



//                 saveChildren(postedLocation._id)

//             }
//         })
//     } else { // If the location is not new, PUT it and update it's children
//         dispatch(putLocation(selectedLocation, selectedLocation._id))
//         if (selectedLocation.schema == 'station') {
//             saveChildren(selectedLocation._id)
//         }
//     }

//     dispatch(deselectLocation())    // Deselect
//     // setSelectedLocationCopy(null)                   // Reset the local copy to null
//     // setSelectedLocationChildrenCopy(null)           // Reset the local children copy to null
//     onSetSelectedDevice(null)
// }
