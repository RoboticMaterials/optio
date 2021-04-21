// Import utils
import { deepCopy } from './utils'
import { convertRealToD3 } from './map_utils'

// Import Store
import store from '../../redux/store/index'


/**
 * All of these coordinates have been calc by adjusting them on map with chrome dev tools
 * @param {*} location
 * @param {*} rd3tClassName
 * @param {*} d3
 */


export const locationsSortedAlphabetically = (locations) => {

    const locationsCopy = deepCopy(locations)

    locationsCopy.sort((a, b) => {
        const aName = a.name
        const bName = b.name
        const length = Math.max(a.name.length, b.name.length)
        for(let i = 0; i<length; i=i+1){
          if(a.name[i] == undefined) {
            return -1
            break
          }
          if(b.name[i] == undefined) {
            return 1
            break
          }
          if(a.name[i]<b.name[i]){
            return -1
            break
          }
          if(a.name[i]>b.name[i]){
            return 1
            break
          }
    }})

    return locationsCopy
}

export const editing = () => {
    const editingPosition = store.getState().positionsReducer.editingPosition
    const editingStation = store.getState().stationsReducer.editingStation

    return !!editingStation ? editingStation : editingPosition

}


/**
 * This function compares existing vs incoming locations
 *
 * If the incoming location exists in existing locations then use the incoming location info but update the x and y from existing
 * Using x and y from existing because those values correlate with the local map's d3 state
 *
 * If an incoming location is not in existing locations that means it was added by another client
 * Make sure to update the new locations x and y values to match the local map's d3
 *
 * @param {object} existingStations
 * @param {object} incomingStations
 */
export const compareExistingVsIncomingLocations = (incomingLocations, existingLocations, d3) => {

    Object.values(existingLocations).forEach(existingLocation => {

        // If the location exists in the backend and frontend, take the new locations, but assign local x and y
        if (existingLocation._id in incomingLocations) {

            const incomingLocation = incomingLocations[existingLocation._id]
            if ((incomingLocation.pos_x !== existingLocation.pos_x) || (incomingLocation.pos_y !== existingLocation.pos_y)) {
                let [x, y] = convertRealToD3([incomingLocation.pos_x, incomingLocation.pos_y], d3)
                Object.assign(incomingLocations[existingLocation._id], { x: x, y: y })

            } else {
                Object.assign(incomingLocations[existingLocation._id], { x: existingLocation.x, y: existingLocation.y })
            }

        }

        // If the existing location is  new then make sure to pass it in
        else if (existingLocation.new == true) {
            incomingLocations[existingLocation._id] = existingLocation
        }

    })

    // Compare incoming vs existing
    Object.values(incomingLocations).forEach(incomingLocation => {

        // Handles deleted Positions on the backend
        if (!!incomingLocation.change_key && incomingLocation.change_key === 'deleted') {
            delete incomingLocations[incomingLocation._id]
        }

        // If the incoming location is not in existing location, its a new location so convert its pos into local d3 state
        if (Object.values(existingLocations).length > 0 && !(incomingLocation._id in existingLocations) && incomingLocation.change_key !== 'deleted') {
            let x, y
            // If it's a new station, make sure to update it's coords to d3 coords on the local map
            [x, y] = convertRealToD3([incomingLocation.pos_x, incomingLocation.pos_y], d3)
            Object.assign(incomingLocations[incomingLocation._id], { x: x, y: y })
        }
    })

    return incomingLocations
}
