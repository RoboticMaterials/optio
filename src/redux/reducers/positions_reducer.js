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
    SET_SELECTED_POSITION,
    UPDATE_POSITION,
    SET_POSITION_ATTRIBUTES,
    UPDATE_POSITIONS,
    REMOVE_POSITION,

} from '../types/positions_types'

// Import Utils
import { deepCopy, isEquivalent } from '../../methods/utils/utils';
import { convertD3ToReal, convertRealToD3, getRelativeOffset } from '../../methods/utils/map_utils'
import * as d3 from 'd3'



const defaultState = {
    positions: {},

    selectedPosition: {},

    editingPosition: {},

    error: {},
    pending: false,
}

export default function locationsReducer(state = defaultState, action) {
    // ======================================== //
    //                                          //
    //         POSITION UTILITY FUNCTIONS        //
    //                                          //
    // ======================================== //

    /**
     * This function compares existing vs incoming position
     * 
     * If the incoming position exists in existing positions then use the incoming position info but update the x and y from existing
     * Using x and y from existing because it those values correlate with the local map
     * 
     * If an incoming position is not in existing positions that means it was added by another client
     * Make sure to update the new positions x and y values to match the local map's d3
     * 
     * @param {object} existingPositions 
     * @param {object} incomingPositions 
     */
    const onCompareExistingVsIncomingPositions = (incomingPositions) => {

        existingPositions = state.positions

        Object.values(existingPositions).forEach(existingPosition => {
            // If the position exists in the backend and frontend, take the new positions, but assign local x and y
            if (existingPosition._id in incomingPositions) {
                Object.assign(incomingPositions[existingPosition._id], { x: existingPosition.x, y: existingPosition.y })
            }

            // If the ex
            else if (existingPosition.new == true) {
                incomingPositions[existingPosition._id] = existingPosition
            }
        })

        // Compare incoming vs existing
        Object.values(incomingPositions).forEach(incomingPosition => {

            // If the incoming position is not in existing position, its a new position
            if (!incomingPosition._id in existingPositions) {

                // If it's a new position, make sure to update it's coords to d3 coords on the local map
                [x, y] = convertRealToD3([incomingPosition.pos_x, incomingPosition.pos_y], d3)
                incomingPosition = {
                    ...incomingPosition,
                    x: x,
                    y: y,
                }

            }
        })

        return incomingPositions
    }

    /**
     * Updates the state of positions to include the incoming payload.
     * If the payload is the current selected Position, then update that as well
     * @param {object} payload 
     */
    const onUpdatePositions = (payload) => {
        return {
            ...state,
            positions: {
                ...state.positions,
                [payload._id]: payload
            },
            // If the post position is the selectedPosition, then update selected position
            selectedPosition: state.selectedLocation !== null && state.selectedLocation._id === payload._id && payload,
            pending: false,
        }
    }

    switch (action.type) {

        // ========== UTILS ========== //

        // Adds position to front-end without adding it to the backend
        case ADD_POSITION:
            return onUpdatePositions(action.payload)

        case SET_POSITION_ATTRIBUTES:
            Object.assign(action.payload.position, action.payload.attr)
            return onUpdatePositions(action.payload)

        case SET_SELECTED_POSITION:
            return {
                ...state,
                selectedPosition: action.payload
            }

        // ========== GET ========== //
        case GET_POSITIONS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_POSITIONS_SUCCESS:

            const parsedPositions = onCompareExistingVsIncomingPositions(deepCopy(action.payload))

            return {
                ...state,
                positions: parsedPositions,
                pending: false
            }

        case GET_POSITIONS_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ========== POST ========== //
        case POST_POSITION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case POST_POSITION_SUCCESS:
            return onUpdatePositions(action.payload)

        case POST_POSITION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ========== PUT ========== //
        case PUT_POSITION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case PUT_POSITION_SUCCESS:
            return onUpdatePositions(action.payload)

        case PUT_POSITION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });

        // ========== DELETE ========== //
        case DELETE_POSITION_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case DELETE_POSITION_SUCCESS:
            const positionsCopy = deepCopy(state.positions)
            delete positionsCopy[action.payload]
            return {
                ...state,
                positions: positionsCopy,
                selectedPosition: null,
                pending: false,
            }

        case DELETE_POSITION_FAILURE:
            return Object.assign({}, state, {
                error: action.payload,
                pending: false
            });
    }

}