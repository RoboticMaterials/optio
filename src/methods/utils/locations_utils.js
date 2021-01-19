import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

// Import utils
import { deepCopy } from './utils'
import { convertRealToD3 } from './map_utils'


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

        if (aName < bName) return -1
        if (aName > bName) return 1
        return 0
    })

    return locationsCopy
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
            Object.assign(incomingLocations[existingLocation._id], { x: existingLocation.x, y: existingLocation.y })
        }

        // This was an attempt to fix incoming locations that had their position changed
        // Didn't work
        // But that should be obvious
        // Cause if it did
        // It wouldnt be commented
        // Duh.
        // if (existingLocation._id in incomingLocations && (incomingLocations[existingLocation._id].pos_x !== existingLocation.pos_x || incomingLocations[existingLocation._id].pos_y !== existingLocation.pos_y)) {
        //     let x, y
        //     [x, y] = convertRealToD3([incomingLocations[existingLocation._id].pos_x, incomingLocations[existingLocation._id].pos_y], d3)

        //     Object.assign(incomingLocations[existingLocation._id], { x: x, y: y })
        // }


        // If the existing location is  new then make sure to pass it in
        else if (existingLocation.new == true) {
            incomingLocations[existingLocation._id] = existingLocation
        }
        
    })

    // Compare incoming vs existing
    Object.values(incomingLocations).forEach(incomingLocation => {

        // If the incoming location is not in existing location, its a new location
        if (!incomingLocation._id in existingLocations) {
            let x, y
            // If it's a new station, make sure to update it's coords to d3 coords on the local map
            [x, y] = convertRealToD3([incomingLocation.pos_x, incomingLocation.pos_y], d3)
            incomingLocation = {
                ...incomingLocation,
                x: x,
                y: y,
            }

        }
    })

    return incomingLocations
}