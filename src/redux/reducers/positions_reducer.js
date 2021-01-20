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
    EDITING_POSITION,
    SET_SELECTED_STATION_CHILDREN_COPY

} from '../types/positions_types'

// Import Utils
import { deepCopy, isEquivalent } from '../../methods/utils/utils';
import { compareExistingVsIncomingLocations } from '../../methods/utils/locations_utils'

const defaultState = {
    positions: {},

    selectedPosition: null,

    editingPosition: false,
    selectedStationChildrenCopy: null,

    d3: {},

    error: {},
    pending: false,
}

const positionsReducer = (state = defaultState, action) => {
    let positionsCopy

    /**
     * Updates the state of positions to include the incoming payload position.
     * If the payload is the current selected Position, then update that as well
     * @param {object} position 
     */
    const onUpdatePosition = (position) => {
        console.log('QQQQ position', position)
        return {
            ...state,
            positions: {
                ...state.positions,
                [position._id]: position
            },
            // If the post position is the selectedPosition, then update selected position
            selectedPosition: state.selectedPosition !== null && state.selectedPosition._id === position._id && position,
            pending: false,
        }
    }

    switch (action.type) {

        // ========== UTILS ========== //

        // Adds position to front-end without adding it to the backend
        case ADD_POSITION:
            return onUpdatePosition(action.payload)

        // Sets Positions Attributes
        case SET_POSITION_ATTRIBUTES:

            // If editing a child position then update the position in the childrencopy
            if (!!state.selectedStationChildrenCopy && action.payload.id in state.selectedStationChildrenCopy) {
                return {
                    ...state,
                    selectedStationChildrenCopy: {
                        ...state.selectedStationChildrenCopy,
                        [action.payload.id]: {
                            ...state.selectedStationChildrenCopy[action.payload.id],
                            ...action.payload.attr,
                        }
                    },
                }
            }

            // If there is a selected station and the payload is that station, then edit the selected station and dont edit the station in state
            else if (!!state.selectedPosition && action.payload.id === state.selectedPosition._id) {
                let updatedPosition = state.selectedPosition
                Object.assign(updatedPosition, action.payload.attr)
                return {
                    ...state,
                    selectedPosition: updatedPosition
                }
            }

            else {
                let updatedPosition = state.positions[action.payload.id]
                Object.assign(updatedPosition, action.payload.attr)
                return onUpdatePosition(updatedPosition)
            }

        // Sets a selected Position
        case SET_SELECTED_POSITION:
            return {
                ...state,
                selectedPosition: action.payload
            }

        // Updates a position locally on the front-end
        case UPDATE_POSITION:
            return onUpdatePosition(action.payload)

        // Upates positions locally on the front-end
        case UPDATE_POSITIONS:
            return {
                ...state,
                positions: action.payload.positions,
                selectedPosition: !!action.payload.selectedPosition && action.payload.selectedPosition,
                d3: action.payload.d3
            }

        case EDITING_POSITION:
            return {
                ...state,
                editingPosition: action.payload
            }

        case SET_SELECTED_STATION_CHILDREN_COPY:
            console.log('QQQQ Setting children', action.payload)
            return {
                ...state,
                selectedStationChildrenCopy: action.payload
            }

        case REMOVE_POSITION:
            positionsCopy = deepCopy(state.positions)
            positionsCopy.delete(action.payload)
            return {
                ...state,
                positions: positionsCopy
            }

        // ========== GET ========== //
        case GET_POSITIONS_STARTED:
            return Object.assign({}, state, {
                pending: true
            });

        case GET_POSITIONS_SUCCESS:

            const parsedPositions = compareExistingVsIncomingLocations(deepCopy(action.payload), deepCopy(state.positions), state.d3)

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
            return onUpdatePosition(action.payload)

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
            return onUpdatePosition(action.payload)

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
            positionsCopy = deepCopy(state.positions)
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

        default:
            return state
    }

}

export default positionsReducer