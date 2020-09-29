import { useDispatch, useSelector } from 'react-redux'

import {
    SELECT_LOCATION,
    SET_SELECTED_LOCATION,
    SET_SELECTED_LOCATION_COPY,
    SET_SELECTED_LOCATION_CHILDREN_COPY,
    DESELECT_LOCATION,
} from '../types/locations_types'

import * as stationActions from './stations_actions.js'
import * as positionActions from './positions_actions.js'
import { setSelectedDevice } from './devices_actions'

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

export const removeLocation = (id) => {
    return async dispatch => {
        dispatch(stationActions.removeStation(id))
        dispatch(positionActions.removePosition(id))
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
    return { type: SET_SELECTED_LOCATION_COPY, payload: location}
}

export const setSelectedLocationChildrenCopy = (locationChildren) => {
    return { type: SET_SELECTED_LOCATION_CHILDREN_COPY, payload: locationChildren}
}


export const sideBarBack = (props) => {

    // Does a quick check to make sure there is a location, if not then just return an arbitrary dispatch
    // Redux requires a dispatch here (I think...) so I just use setselectedDevice since it wont have nay side effects (again... I think...)
    if (props.selectedLocation === null) return async dispatch => dispatch(setSelectedDevice(null))

    const {
        selectedLocation,
        selectedLocationCopy,
        selectedLocationChildrenCopy
    } = props

    return async dispatch => {

        console.log('QQQQ selected location', selectedLocation, selectedLocationCopy, )

        if (!!selectedLocation.type && selectedLocation.type === 'device') {
            //// Revert location
            if (selectedLocation.new == true) { // If the location was new, simply delete it 
                dispatch(removeLocation(selectedLocation._id))
            }
        }

        // 
        else {
            //// Revert location
            if (selectedLocation.new == true) { // If the location was new, simply delete it 
                dispatch(removeLocation(selectedLocation._id))
            } else { // If the location is not new, revert it to the old copy, and do the same to its children
                dispatch(updateLocation(selectedLocationCopy))
                selectedLocationChildrenCopy.forEach(child => dispatch(positionActions.updatePosition(child)))
            }
        }

        dispatch(setSelectedLocationCopy(null))
        dispatch(setSelectedLocationChildrenCopy(null))

        dispatch(deselectLocation())    // Deselect

        dispatch(setSelectedDevice(null))
    }
}