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

// get
// ******************************
export const getPositions = () => {
    return async dispatch => {

        function onStart() {
            dispatch({ type: GET_POSITIONS_STARTED });
        }
        function onSuccess(positions) {
            dispatch({ type: GET_POSITIONS_SUCCESS, payload: { positions } });
            return positions;
        }
        function onError(error) {
            dispatch({ type: GET_POSITIONS_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            const positions = await api.getPositions();

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
            dispatch({ type: POST_POSITION_SUCCESS, payload: { position } });
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
            dispatch({ type: PUT_POSITION_SUCCESS, payload: { position } });
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
            positionCopy.change_key = 'changed'
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
export const deletePosition = (position, ID) => {
    return async dispatch => {
        function onStart() {
            dispatch({ type: DELETE_POSITION_STARTED });
        }
        function onSuccess(id) {
            dispatch({ type: DELETE_POSITION_SUCCESS, payload: { id } });
            return id;
        }
        function onError(error) {
            dispatch({ type: DELETE_POSITION_FAILURE, payload: error });
            return error;
        }

        try {
            onStart();
            // const removePosition = await api.deletePosition(ID);

            // IMPORTANT!: Putting with change_key as deleted instead of deleting because it was causing back end issues
            let positionCopy = deepCopy(position)
            delete positionCopy._id
            delete positionCopy.temp
            // Tells the backend that a position has been deleted
            positionCopy.change_key = 'deleted'
            const updatePosition = await api.putPosition(positionCopy, ID);
            return onSuccess(ID)
        } catch (error) {
            return onError(error)
        }
    }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const addPosition = (position) => {
    return { type: ADD_POSITION, payload: { position } }
}

export const updatePosition = (position) => {
    return { type: UPDATE_POSITION, payload: { position } }
}

export const revertChildren = (position) => {
    return { type: REVERT_CHILDREN, payload: { position } }
}

export const updatePositions = (positions) => {
    return { type: UPDATE_POSITIONS, payload: { positions } }
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

export const editingPosition = (bool) => {
    return { type: EDITING_POSITION, payload: bool }
}