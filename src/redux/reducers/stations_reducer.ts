import {EDITING_STATION} from '../types/stations_types'

// Import Utils
import {deepCopy} from '../../methods/utils/utils';
import {compareExistingVsIncomingLocations} from '../../methods/utils/locations_utils'
import {isEmpty} from "../../methods/utils/object_utils";
import {createSlice, PayloadAction, createEntityAdapter} from '@reduxjs/toolkit'
import {getStations} from "../actions/stations_actions";
import {Station} from "../../api/stations/station";


interface StationState {
    stations: any,
    selectedStation: any,
    editingStation: boolean,
    d3: object,
    error: object,
    pending: boolean,
}



// const initialState = { value: 0 } as CounterState
const defaultState = {
    stations: {},
    selectedStation: null,
    editingStation: false,
    d3: {},
    error: {},
    pending: false,
} as StationState



export const stationsAdapter = createEntityAdapter<Station>({
    // Assume IDs are stored in a field other than `book.id`
    selectId: (book) => book.id,
    // Keep the "all IDs" array sorted based on book titles
    sortComparer: (a, b) => a.name.localeCompare(b.name),
})



const stationSlice: any = createSlice({
    name: 'stations',
    initialState: stationsAdapter.getInitialState(),
    reducers: {
        setEditingStation(state, action: PayloadAction<boolean>) {
            state.editingStation = action.payload
        },
    },
    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        [getStations.fulfilled]: (state: any, action: any) => {
            console.log("getStations.fulfilled action",action)


            // Add user to the state array
            if(isEmpty(state.d3)) {
                stationsAdapter.setAll(state, action.payload)
                // state.stations = action.payload
            }

            else {

                // const parsedStations = compareExistingVsIncomingLocations(deepCopy(action.payload), deepCopy(state.stations), state.d3)
                // booksAdapter.setAll(state, parsedStations)
                stationsAdapter.setAll(state, action.payload)

            }
        }
    }
})


export const { setEditingStation } = stationSlice.actions
export default stationSlice.reducer

// function stationsReducer(state = defaultState, action: any) {
//     let stationsCopy
//     /**
//      * Updates the state of stations to include the incoming payload station.
//      * If the payload is the current selected Station, then update that as well
//      * @param {object} station
//      */
//     const onUpdateStation = (station: any) => {
//         return {
//             ...state,
//             stations: {
//                 ...state.stations,
//                 [station.id]: station
//             },
//             // If the post station is the selectedStation, then update selected station
//             selectedStation: (state.selectedStation !== null && state.selectedStation.id === station.id) && station,
//             pending: false,
//         }
//     }
//
//     switch (action.type) {
//
//         // ======================================== //
//         //                                          //
//         //                UTILS                     //
//         //                                          //
//         // ======================================== //
//
//         // Adds station to front-end without adding it to the backend
//         case ADD_STATION:
//             return onUpdateStation(action.payload)
//
//         // Sets Stations Attributes
//         case SET_STATION_ATTRIBUTES:
//             // If there is a selected station and the payload is that station, then edit the selected station and dont edit the station in state
//             if (!!state.selectedStation && action.payload.id === state.selectedStation.id) {
//                 return {
//                     ...state,
//                     selectedStation: {
//                         ...state.selectedStation,
//                         ...action.payload.attr
//                     }
//                 }
//             }
//
//             else {
//                 let updatedStation = state.stations[action.payload.id]
//                 Object.assign(updatedStation, action.payload.attr)
//                 return onUpdateStation(updatedStation)
//             }
//
//         // Sets a selected Station
//         case SET_SELECTED_STATION:
//             return {
//                 ...state,
//                 selectedStation: action.payload
//             }
//
//         // Updates a station locally on the front-end
//         case UPDATE_STATION:
//             return onUpdateStation(action.payload)
//
//         // Upates stations locally on the front-end
//         case UPDATE_STATIONS:
//             return {
//                 ...state,
//                 stations: action.payload.stations,
//                 selectedStation: !!action.payload.selectedStation ? action.payload.selectedStation : state.selectedStation,
//                 d3: !!action.payload.d3 ? action.payload.d3 : state.d3
//             }
//
//         case EDITING_STATION:
//             return {
//                 ...state,
//                 editingStation: action.payload
//             }
//
//         case REMOVE_STATION:
//             stationsCopy = deepCopy(state.stations)
//             delete stationsCopy[action.payload]
//             return {
//                 ...state,
//                 stations: stationsCopy
//             }
//
//         // ========== GET ========== //
//         case GET_STATIONS_STARTED:
//             return Object.assign({}, state, {
//                 pending: true
//             });
//
//         case GET_STATIONS_SUCCESS:
//             if(isEmpty(state.d3)) {
//                 return {
//                     ...state,
//                     stations: {...action.payload},
//                     pending: false
//                 }
//             }
//
//             else {
//                 const parsedStations = compareExistingVsIncomingLocations(deepCopy(action.payload), deepCopy(state.stations), state.d3)
//
//                 return {
//                     ...state,
//                     stations: parsedStations,
//                     pending: false
//                 }
//             }
//
//
//         case GET_STATIONS_FAILURE:
//             return Object.assign({}, state, {
//                 error: action.payload,
//                 pending: false
//             });
//
//         // ========== POST ========== //
//         case POST_STATION_STARTED:
//             return Object.assign({}, state, {
//                 pending: true
//             });
//
//         case POST_STATION_SUCCESS:
//             return onUpdateStation(action.payload)
//
//         case POST_STATION_FAILURE:
//             return Object.assign({}, state, {
//                 error: action.payload,
//                 pending: false
//             });
//
//         // ========== PUT ========== //
//         case PUT_STATION_STARTED:
//             return Object.assign({}, state, {
//                 pending: true
//             });
//
//         case PUT_STATION_SUCCESS:
//             return onUpdateStation(action.payload)
//
//         case PUT_STATION_FAILURE:
//             return Object.assign({}, state, {
//                 error: action.payload,
//                 pending: false
//             });
//
//         // ========== DELETE ========== //
//         case DELETE_STATION_STARTED:
//             return Object.assign({}, state, {
//                 pending: true
//             });
//
//         case DELETE_STATION_SUCCESS:
//             stationsCopy = deepCopy(state.stations)
//             delete stationsCopy[action.payload]
//             return {
//                 ...state,
//                 stations: stationsCopy,
//                 selectedStation: null,
//                 pending: false,
//                 hello: true,
//             }
//
//         case DELETE_STATION_FAILURE:
//             return Object.assign({}, state, {
//                 error: action.payload,
//                 pending: false
//             });
//
//         default:
//             return state
//     }
//
// }
// export const setEditingStation = (bool) => {
//     return {type: EDITING_STATION, payload: bool}
// }