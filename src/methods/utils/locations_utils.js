import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

// Import Actions
import { putDevices, postDevices, getDevices, deleteDevices } from '../../redux/actions/devices_actions'
import * as locationActions from '../../redux/actions/locations_actions'
import * as positionActions from '../../redux/actions/positions_actions'
import * as dashboardActions from '../../redux/actions/dashboards_actions'
import * as stationActions from '../../redux/actions/stations_actions'
import * as taskActions from '../../redux/actions/tasks_actions'
import * as deviceActions from '../../redux/actions/devices_actions'

export const LocationTypes = {
    shelfPosition: {
        svgPath:
            <svg y="70">
                <path d="M263.53,56.31l33,47a10,10,0,0,1-8.18,15.74h-66a10,10,0,0,1-8.19-15.74l33-47A10,10,0,0,1,263.53,56.31Z" />
                <path d="M142.71,56.31l33,47a10,10,0,0,1-8.19,15.74h-66a10,10,0,0,1-8.18-15.74l33-47A10,10,0,0,1,142.71,56.31Z" />
                <circle cx="255.44" cy="146.56" r="12.5" />
                <circle cx="255.44" cy="181.56" r="7.5" />
                <circle stroke='none' cx="134.44" cy="146.56" r="12.5" />
                <circle cx="134.44" cy="181.56" r="7.5" />
                <rect fill='transparent' strokeMiterlimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30" />
            </svg>,
        attributes:
        {
            schema: 'position',
            type: 'shelf_position',
            parent: null,
            new: true,
        },
        color: '#fb7c4e',

    },

    chargePosition: {
        svgPath:
            <svg y="70">
                <path d="M344.75,131.18l-47,33A10,10,0,0,1,282,156V90a10,10,0,0,1,15.75-8.18l47,33A10,10,0,0,1,344.75,131.18Z" />
                <rect fill='none' strokeMiterlimit='10' strokeWidth='20px' x="5" y="5" width="378" height="236" rx="30" />
                <path d="M251,171.13c-2.45,3.47-4.09,3.9-8.1,2.12l-73.27-32.63c-.72-.32-1.45-.61-2.47-1v3.15q0,12.9,0,25.81c0,4.89-3,6.91-7.46,5L31.14,118.34c-2.83-1.22-4.08-3.12-3.65-5.47s2.19-3.61,5.09-3.91q29.51-3,59-6c9-.91,17.93-1.86,26.91-2.63,1.81-.15,2.1-.82,2.06-2.38-.09-3.65,0-7.29,0-10.94,0-4.26,1.43-5.77,5.64-6.1q32.61-2.53,65.23-5.1c17.69-1.36,35.38-2.65,53.06-4.08,2.93-.23,5.1.52,6.54,3.12Z" />
                <rect fill='transparent' strokeMiterlimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30" />
            </svg>,
        color: '#fbd34e',

    },

    workstation: {
        svgPath:
            <>
                <rect x="100" y="40" width="200" height="320" rx="10" transform="translate(400) rotate(90)" fill="none" strokeMiterlimit="10" strokeWidth="20" />
                <rect x="120" y="60" width="160" height="280" rx="2" transform="translate(400) rotate(90)" />
            </>,
        attributes:
        {
            schema: 'station',
            type: 'workstation',
            children: [],
            dashboards: [],
            new: true,
        },
        color: '#6283f0'
    },

    cartPosition: {
        svgPath:
            <>
                <rect fill='transparent' x="100" y="40" width="200" height="320" rx="30" transform="translate(400 0) rotate(90)" strokeMiterlimit="10" strokeWidth="20" />
                <path d="M315.5,200.87l-64,36.95A1,1,0,0,1,250,237v-73.9a1,1,0,0,1,1.5-.87l64,36.95A1,1,0,0,1,315.5,200.87Z" strokeMiterlimit="10" strokeWidth="10" />
                <circle cx="200" cy="200" r="15" />
                <circle cx="150" cy="200" r="10" />
                <circle cx="102.5" cy="200" r="7.5" />
            </>,
        attributes:
        {
            schema: 'position',
            type: 'cart_position',
            parent: null,
            new: true,
        },
        color: '#6283f0',
    },
}

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
    // If schema is a station, else it's a position
    if (location.schema === 'station') {
        // If the type is a device
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

        // If the type is not a device it's a workstation.
        else {
            // Gets the height of the workstation
            const el = document.getElementById(`${rd3tClassName}-rectQ`)
            let bBox = null

            // Try catch for when page refreshses when in a widget. When refreshing in a widget, the elements is unmounted and cant get the bounding because of an unmounted element
            try {
                bBox = el.getBoundingClientRect()
            } catch (error) {
                return widgetInfo
            }

            // Stops the widget from getting to small and keeping the widget relative to the location size
            if (d3.scale < .8) {
                widgetInfo.scale = .8
                widgetInfo.yPosition = location.y + bBox.height / 2 - 68
                widgetInfo.xPosition = location.x - 19

            }

            // Stops the widget from getting to large and keeping the widget relatice to the location size
            else if (d3.scale > 1.3) {
                widgetInfo.scale = 1.3
                widgetInfo.yPosition = location.y + bBox.height / 2 - 75
                widgetInfo.xPosition = location.x + 30

            }

        }
    }

    else {
        // Gets the height of the workstation
        const el = document.getElementById(`${rd3tClassName}-trans`)
        let bBox = null

        // Try catch for when page refreshses when in a widget. When refreshing in a widget, the elements is unmounted and cant get the bounding because of an unmounted element
        try {
            bBox = el.getBoundingClientRect()
        } catch (error) {
            return widgetInfo
        }

        widgetInfo.scale = 1.3
        widgetInfo.yPosition = location.y + bBox.height / 2 - 75
        widgetInfo.xPosition = location.x + 12

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
            widgetInfo.xPosition = location.x + 12

        }
    }



    return widgetInfo

}
