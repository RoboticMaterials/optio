import {
    GET_POSITIONS_STARTED,
    GET_POSITIONS_SUCCESS,
    GET_POSITIONS_FAILURE,

    POST_POSITION_STARTED,
    POST_POSITION_SUCCESS,
    POST_POSITION_FAILURE,

    PUT_POSITION_STARTED,
    PUT_POSITION_SUCCESS,
    PUT_POSITION_FAILURE,

    DELETE_POSITION_STARTED,
    DELETE_POSITION_SUCCESS,
    DELETE_POSITION_FAILURE,

    ADD_POSITION,
    UPDATE_POSITION,
    UPDATE_POSITIONS,
    REMOVE_POSITION,
    SET_POSITION_ATTRIBUTES,
    REVERT_CHILDREN,
    SET_SELECTED_POSITION,
    EDITING_POSITION,
} from '../types/positions_types'

import { deepCopy } from '../../methods/utils/utils';
import uuid from 'uuid';

import * as api from '../../api/positions_api'
import { SET_SELECTED_OBJECT } from '../types/objects_types';

// Import External Actions
import { setStationAttributes } from './stations_actions'
import { deleteTask } from './tasks_actions'

// Import Store
import store from '../store/index'

// get
// ******************************
export const getPositions = () => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: GET_POSITIONS_STARTED });
        }
        function onSuccess(positions) {
            dispatch({ type: GET_POSITIONS_SUCCESS, payload: positions });
            return positions;
        }
        function onError(error) {
            dispatch({ type: GET_POSITIONS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const positions = await api.getPositions();

            // TODO: Add to normalizer
            const normalizedPositions = {}
            positions.map((position) => {
                normalizedPositions[position._id] = position
            })

            return onSuccess(normalizedPositions);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// post
// ******************************
export const postPosition = (position) => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: POST_POSITION_STARTED });
        }
        function onSuccess(position) {
            dispatch({ type: POST_POSITION_SUCCESS, payload: position });
            return position;
        }
        function onError(error) {
            dispatch({ type: POST_POSITION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            if (!('_id' in position)) {
                position._id = uuid.v4()
            }

            // Was used for a bug that didnt exit
            // if (position.rotation > 180) {
            //     position.rotation = position.rotation - 360
            // }

            // else if (position.rotation < -180) {
            //     position.rotation = position.rotation + 360
            // }

            delete position.temp
            delete position.new
            position.change_key = 'new'
            const postedPosition = await api.postPosition(position);
            return onSuccess(postedPosition);
        } catch (error) {
            return onError(error);
        }
    };
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// put
// ******************************
export const putPosition = (position) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: PUT_POSITION_STARTED });
        }
        function onSuccess(position) {
            dispatch({ type: PUT_POSITION_SUCCESS, payload: position });
            return position;
        }
        function onError(error) {
            dispatch({ type: PUT_POSITION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            let positionCopy = deepCopy(position)
            delete positionCopy.temp

            // Was used for a bug that didnt exit
            // if (position.rotation > 180) {
            //     position.rotation = position.rotation - 360
            // }

            // else if (position.rotation < -180) {
            //     position.rotation = position.rotation + 360
            // }


            // Tells the backend that a position has changed
            console.log('QQQQ Position Copy', positionCopy)
            if (positionCopy.change_key !== 'deleted') positionCopy.change_key = 'changed'
            const updatePosition = await api.putPosition(positionCopy, positionCopy._id);
            return onSuccess(updatePosition)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// delete
// ******************************
export const deletePosition = (position) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_POSITION_STARTED });
        }
        function onSuccess(id) {
            dispatch({ type: DELETE_POSITION_SUCCESS, payload: id });
            return id;
        }
        function onError(error) {
            dispatch({ type: DELETE_POSITION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            let positionCopy = deepCopy(onDeletePosition(position))

            // If theres a position copy then tell the backend is deleted
            // There wouldnt be a position copy because the position did not exist on the backend
            if (!!positionCopy) {
                delete positionCopy.temp
                // IMPORTANT!: Putting with change_key as deleted instead of deleting because it was causing back end issues
                // Tells the backend that a position has been deleted
                positionCopy.change_key = 'deleted'
                const updatePosition = await api.putPosition(positionCopy, positionCopy._id);
                return onSuccess(positionCopy._id)
            }
            else {
                return
            }

        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const addPosition = (position) => {
    return { type: ADD_POSITION, payload: position }
}

export const updatePosition = (position) => {
    return { type: UPDATE_POSITION, payload: position }
}

export const revertChildren = (position) => {
    return { type: REVERT_CHILDREN, payload: position }
}

export const updatePositions = (positions, selectedPosition, d3) => {
    return { type: UPDATE_POSITIONS, payload: { positions, selectedPosition, d3 } }
}

export const removePosition = (id) => {
    return { type: REMOVE_POSITION, payload: { id } }
}

export const setPositionAttributes = (id, attr) => {
    return { type: SET_POSITION_ATTRIBUTES, payload: { id, attr } }
}

export const setSelectedPosition = (position) => {
    return { type: SET_SELECTED_POSITION, payload: position }
}

export const setEditingPosition = (bool) => {
    return { type: EDITING_POSITION, payload: bool }
}


const onDeletePosition = (position) => {

    const stationsState = store.getState().stationsReducer
    const tasksState = store.getState().tasksReducer

    // If the position has a parent then remove from parent
    if (!!position.parent) {

        let selectedStation = deepCopy(stationsState.selectedStation)

        // Remove the position from the list of children
        const positionIndex = selectedStation.children.findIndex(p => p._id === position._id)

        selectedStation.children.splice(positionIndex, 1)
        setStationAttributes(selectedStation._id, { children: selectedStation.children })
    }


    // If the position is new, just remove it from the local station
    // Since the position is new, it does not exist in the backend and there can't be any associated tasks
    if (!!position.new) {
        removePosition(position._id)
        return null
    }

    // Else delete in backend and delete any associated tasks
    else {
        const tasks = tasksState.tasks

        // Sees if any tasks are associated with the position and delete them
        Object.values(tasks).filter(task => {
            return task.load.position == position._id || task.unload.position == position._id
        }).forEach(relevantTask => {
            deleteTask(relevantTask._id)
        })

        return position

    }
}