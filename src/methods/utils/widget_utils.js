import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

// Import utils
import { deepCopy } from './utils'

// Import Actions
import { putDevices, postDevices, getDevices, deleteDevices } from '../../redux/actions/devices_actions'
import * as locationActions from '../../redux/actions/locations_actions'
import * as positionActions from '../../redux/actions/positions_actions'
import * as dashboardActions from '../../redux/actions/dashboards_actions'
import * as stationActions from '../../redux/actions/stations_actions'
import * as taskActions from '../../redux/actions/tasks_actions'
import * as deviceActions from '../../redux/actions/devices_actions'

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
        const el = location.schema === 'station' ? document.getElementById(`${rd3tClassName}-station`) : document.getElementById(`${rd3tClassName}-position`)
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
