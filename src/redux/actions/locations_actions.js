import { useDispatch, useSelector } from 'react-redux'

import {
    SELECT_LOCATION,
    SET_SELECTED_LOCATION,
    DESELECT_LOCATION,
  } from '../types/locations_types'

  import * as stationActions from './stations_actions.js'
  import * as positionActions from './positions_actions.js'
  
  import { deepCopy } from '../../methods/utils/utils';
  import uuid from 'uuid';
  
  
  // get
  // ******************************
  export const getLocations = () => {
    return async dispatch => {
        dispatch(stationActions.getStations())
        dispatch(positionActions.getPositions())
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
      return { type: SELECT_LOCATION, payload: { id }}
  }

  export const setSelectedLocation = (location) => {
      return { type: SET_SELECTED_LOCATION, payload: { location }}
  }

  export const deselectLocation = () => {
      return { type: DESELECT_LOCATION }
  }
  