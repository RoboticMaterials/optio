import { useDispatch, useSelector } from 'react-redux'

import {
    SELECT_LOCATION,
    SET_SELECTED_LOCATION,
    SET_SELECTED_LOCATION_COPY,
    SET_SELECTED_LOCATION_CHILDREN_COPY,
    DESELECT_LOCATION,
    EDITING_LOCATION,
} from '../types/locations_types'

import * as stationActions from './stations_actions'
import { deleteStation } from './stations_actions'
import * as positionActions from './positions_actions.js'
import { deletePosition } from './positions_actions.js'
import { setSelectedDevice, putDevices } from './devices_actions'
import { deleteDashboard } from './dashboards_actions'
import { deleteTask } from './tasks_actions'
import { putProcesses } from './processes_actions'

import { deepCopy } from '../../methods/utils/utils';
import uuid from 'uuid';


// // get
// // ******************************
// export const getLocations = () => {
//     return async dispatch => {
//         const stations = await dispatch(stationActions.getStations())
//         const positions = await dispatch(positionActions.getPositions())
//         return ({ stations: stations, positions: positions })
//     }
// }
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// // post
// // ******************************
// export const postLocation = (location) => {
//     return async dispatch => {
//         if (location.schema == 'station') {
//             return dispatch(stationActions.postStation(location))
//         } else if (location.schema == 'position') {
//             return dispatch(positionActions.postPosition(location))
//         }
//     }
// };
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// // put
// // ******************************
// export const putLocation = (location, ID) => {
//     return async dispatch => {
//         if (location.schema == 'station') {
//             return dispatch(stationActions.putStation(location, ID))
//         } else if (location.schema == 'position') {
//             return dispatch(positionActions.putPosition(location, ID))
//         }
//     }
// }
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// // delete
// // ******************************
// export const deleteLocation = (id) => {
//     return async dispatch => {
//         dispatch(stationActions.deleteStation(id))
//         // TODO: Why is this here? Is this a catch because it may either be a position or location?
//         // dispatch(positionActions.deletePosition(id))
//     }
// }
// // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// export const addLocation = (location) => {
//     return async dispatch => {
//         if (location.schema == 'station') {
//             dispatch(stationActions.addStation(location))
//         } else if (location.schema == 'position') {
//             dispatch(positionActions.addPosition(location))
//         }
//     }
// }

// export const updateLocation = (location) => {
//     return async dispatch => {
//         if (location.schema == 'station') {
//             dispatch(stationActions.updateStation(location))
//         } else if (location.schema == 'position') {
//             dispatch(positionActions.updatePosition(location))
//         }

//     }
// }

// export const updateChildren = (location) => {
//     return async dispatch => {



//         dispatch(stationActions.updateStation(location))
//         dispatch(positionActions.updatePosition(location))

//     }
// }


// export const updateLocations = (locations) => {
//     return async dispatch => {
//         Object.values(locations).forEach(location => {
//             if (location.schema == 'station') {
//                 dispatch(stationActions.updateStation(location))
//             } else if (location.schema == 'position') {
//                 dispatch(positionActions.updatePosition(location))
//             }
//         })
//     }
// }

// export const removeLocation = (location) => {

//     const {
//         _id,
//         children
//     } = location

//     if (location.schema === 'station') {

//         return async dispatch => {
//             dispatch(stationActions.removeStation(_id))

//             children.forEach((child) => {
//                 dispatch(positionActions.removePosition(child))
//             })
//         }
//     }

//     else if (location.schema === 'position') {
//         return async dispatch => {
//             dispatch(positionActions.removePosition(_id))
//         }
//     }
// }

// export const setLocationAttributes = (id, attr) => {
//     return async dispatch => {
//         dispatch(stationActions.setStationAttributes(id, attr))
//         dispatch(positionActions.setPositionAttributes(id, attr))
//     }
// }

// export const selectLocation = (id) => {
//     return { type: SELECT_LOCATION, payload: { id } }
// }

// export const setSelectedLocation = (location) => {
//     return { type: SET_SELECTED_LOCATION, payload: { location } }
// }

// export const deselectLocation = () => {
//     return { type: DESELECT_LOCATION }
// }

// export const setSelectedLocationCopy = (location) => {
//     return { type: SET_SELECTED_LOCATION_COPY, payload: location }
// }

// export const setSelectedLocationChildrenCopy = (locationChildren) => {
//     return { type: SET_SELECTED_LOCATION_CHILDREN_COPY, payload: locationChildren }
// }


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
    
}





/**
* Called when the delete button is pressed. Deletes the location, its children, its dashboards,
* and any tasks associated with the location
*/
export const deleteLocationProcess = (props) => {

}
