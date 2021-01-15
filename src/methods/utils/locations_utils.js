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
export const handleWidgetHoverCoord = (location, rd3tClassName, d3) => {

    let widgetInfo = {}
    widgetInfo.id = location._id

    widgetInfo.heightWidth = '1'

    // Initial Ratios
    widgetInfo.yPosition = location.y - 66 * d3.scale
    widgetInfo.xPosition = location.x - 2
    widgetInfo.scale = d3.scale

    // Sets real scale to be used with the widget hover area
    widgetInfo.realScale = d3.scale

    // If type is a device
    if (location.type === 'device') {
        // Gets the height of the device
        const el = document.getElementById(`${rd3tClassName}-device`)
        let bBox = null


        // Try catch for when page refreshses when in a widget. When refreshing in a widget, the elements is unmounted and cant get the bounding because of an unmounted element
        try {
            bBox = el.getBoundingClientRect()
        } catch (error) {
            return widgetInfo
        }

        // Stops the widget from getting to0 small and keeping the widget relative to the location size
        if (d3.scale < .8) {
            widgetInfo.scale = .8
            widgetInfo.yPosition = location.y + bBox.height / 2 - 71
            widgetInfo.xPosition = location.x - 12


        }

        // Stops the widget from getting to0 large and keeping the widget relative to the location size
        else if (d3.scale > 1.3) {
            widgetInfo.scale = 1.3
            widgetInfo.yPosition = location.y + bBox.height / 2 - 86
            widgetInfo.xPosition = location.x + 30

        }
    }

    // Else its a postion/station
    else {
        // Gets the element based on whether its a station or not
        const el = location.schema === 'station' ? document.getElementById(`${rd3tClassName}-station`) : document.getElementById(`${rd3tClassName}-trans`)
        let bBox = null

        // Try catch for when page refreshses when in a widget. When refreshing in a widget, the elements is unmounted and cant get the bounding because of an unmounted element
        try {
            bBox = el.getBoundingClientRect()
        } catch (error) {
            return widgetInfo
        }

        widgetInfo.scale = 1.3
        widgetInfo.yPosition = location.y + bBox.height / 2 - 75
        widgetInfo.xPosition = location.schema === 'station' ? location.x + 25 : location.x + 12

        // Stops the widget from getting to small and keeping the widget relative to the location size
        if (d3.scale < .8) {
            widgetInfo.scale = .8
            widgetInfo.yPosition = location.y + bBox.height / 2 - 68
            widgetInfo.xPosition = location.x - 15
        }

        // Stops the widget from getting to large and keeping the widget relatice to the location size
        else if (d3.scale > 1.3) {
            widgetInfo.scale = 1.3
            widgetInfo.yPosition = location.y + bBox.height / 2 - 75
            widgetInfo.xPosition = location.schema === 'station' ? location.x + 25 : location.x + 12

        }
    }



    return widgetInfo

}

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

    Object.values(existingLocations).forEach(existngLocation => {
        // If the location exists in the backend and frontend, take the new locations, but assign local x and y
        if (existngLocation._id in incomingLocations) {
            Object.assign(incomingLocations[existngLocation._id], { x: existngLocation.x, y: existngLocation.y })
        }

        // If the ex
        else if (existngLocation.new == true) {
            incomingLocations[existngLocation._id] = existngLocation
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