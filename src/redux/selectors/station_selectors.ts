import store, {RootState} from '../store'
import stationsReducer, {stationsAdapter} from "../reducers/stations_reducer";
import {Station} from "../../api/stations/station";
// Can create a set of memoized selectors based on the location of this entity state

export const stationSelectors = stationsAdapter.getSelectors<RootState>(
    (state) => state.stations
);

// And then use the selectors to retrieve values
export const allBooks = stationSelectors.selectAll(store.getState())

console.log('allBooks',allBooks)
console.log('booksSelectors',stationSelectors)