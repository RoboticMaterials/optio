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

export const LocationTypes = {

    /**
     * Heads up, currently there are 2 different svg rectangles being used
     * One thats width is 200 and height is 320
     * One thats width is 378 and height 236
     * 
     * Need to unify this and make all of them standard
     * Probably use the 200 by 320 since you don't need to add a 'y' offset to the svg
     * 
     *  */

    shelf_position: {
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

    charger_position: {
        svgPath:
            <svg y="70">
                <path d="M344.75,131.18l-47,33A10,10,0,0,1,282,156V90a10,10,0,0,1,15.75-8.18l47,33A10,10,0,0,1,344.75,131.18Z" />
                <rect fill='none' strokeMiterlimit='10' strokeWidth='20px' x="5" y="5" width="378" height="236" rx="30" />
                <path d="M251,171.13c-2.45,3.47-4.09,3.9-8.1,2.12l-73.27-32.63c-.72-.32-1.45-.61-2.47-1v3.15q0,12.9,0,25.81c0,4.89-3,6.91-7.46,5L31.14,118.34c-2.83-1.22-4.08-3.12-3.65-5.47s2.19-3.61,5.09-3.91q29.51-3,59-6c9-.91,17.93-1.86,26.91-2.63,1.81-.15,2.1-.82,2.06-2.38-.09-3.65,0-7.29,0-10.94,0-4.26,1.43-5.77,5.64-6.1q32.61-2.53,65.23-5.1c17.69-1.36,35.38-2.65,53.06-4.08,2.93-.23,5.1.52,6.54,3.12Z" />
                <rect fill='transparent' strokeMiterlimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30" />
            </svg>,
        color: '#fbd34e',

    },

    // charger_position: charge_position,

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

    cart_position: {
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

    human_position: {
        svgPath:
            <svg y="70">
                <rect fill='transparent' strokeMiterlimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30" />
                <path d="M194,123a49.63,49.63,0,1,0-49.62-49.63A49.62,49.62,0,0,0,194,123Zm34.74,12.41h-6.48a67.51,67.51,0,0,1-56.52,0h-6.48a52.12,52.12,0,0,0-52.1,52.1v16.13a18.61,18.61,0,0,0,18.61,18.61H262.23a18.61,18.61,0,0,0,18.61-18.61V187.51A52.12,52.12,0,0,0,228.74,135.41Z" />
            </svg>,
        attributes:
        {
            schema: 'position',
            type: 'human_position',
            parent: null,
            new: true,
        },
        color: '#5eec33',
    },

    warehouse_position: {
        // < defs >
        // <style>.cls-1{fill:#4d4d4d;}.cls-2{fill:url(#linear-gradient);}
        // </style>
        // <linearGradient id="linear-gradient" x1="97.76" y1="120.43" x2="262.84" y2="120.43" gradientUnits="userSpaceOnUse">
        //     <stop offset="0" stop-color="#c69c6d"/>
        //     <stop offset="1" stop-color="#a67c52"/>
        // </linearGradient></defs> 
        // <g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1">
        svgPath:
            <>
                <rect class="cls-1" width="360" height="240" rx="30" />
                <path class="cls-2" d="M253.79,24.62h3c4.49,1.52,6,4.71,6,9.34q-.13,67,0,134,0,22.26,0,44.52c0,2.72-1,3.78-3.7,3.8s-5.12,0-7.69,0-3.58-1.09-3.6-3.68c0-1.73,0-3.46,0-5.2h-135c0,1.93,0,3.73,0,5.53,0,2.21-1.14,3.31-3.37,3.35s-4.62,0-6.93,0c-3.91,0-4.66-.77-4.66-4.73q0-88.87-.07-177.73c0-4.59,1.65-7.67,6-9.16h3c4.39,1.48,6.09,4.55,6,9.14-.13,14.15,0,28.31,0,42.46v2.15h9V37.82c0-3.29.92-4.2,4.24-4.2h45.55c3.29,0,4.2.91,4.2,4.23q0,19.26,0,38.54v2h9V76.2q0-19.17,0-38.35c0-3.32.91-4.23,4.2-4.23h45.55c3.32,0,4.24.91,4.24,4.2V78.38h9V76.22c0-14.15.08-28.31,0-42.46C247.69,29.16,249.39,26.1,253.79,24.62Zm-63,80.85c0,1.9,0,3.63,0,5.36,0,2.44-1.12,3.56-3.56,3.57q-6.93,0-13.87,0c-2.45,0-3.53-1.13-3.56-3.56,0-1.78,0-3.56,0-5.3H128v29.7h104.7V105.47Zm-69,86.71V166.25c0-2.94,1-3.91,3.94-3.91h52.11c3,0,4,1,4,3.89q0,12,0,23.95v2h9V190q0-16.28,0-32.55c0-3.18.91-4.09,4.13-4.09h39.74c3.21,0,4.12.91,4.12,4.1q0,16.27,0,32.56v2.12h8.85V150.43H113v41.75Zm6-113.8H169.7V39.73H157.79c0,1.86,0,3.59,0,5.33,0,2.45-1.09,3.52-3.56,3.53q-5.43,0-10.87,0c-2.47,0-3.53-1.07-3.56-3.52,0-1.78,0-3.57,0-5.31h-12Zm63.08-38.73V78.42h41.74V39.75H220.79c0,1.83,0,3.51,0,5.19,0,2.59-1,3.64-3.63,3.65-3.56,0-7.12,0-10.68,0-2.68,0-3.67-1.05-3.69-3.78,0-1.72,0-3.43,0-5.17ZM121.8,135.29v-2.2q0-14.79,0-29.56c0-3.18.91-4.09,4.13-4.09H234.66c3.21,0,4.13.91,4.13,4.09q0,14.88,0,29.75v2h8.85V93.59H113v41.7Zm110.86,56.9V159.42h-8.59c-.13.14-.21.19-.21.23,0,1.75,0,3.49-.07,5.23,0,2.32-1.14,3.41-3.49,3.43-3.68,0-7.37,0-11.05,0-2.33,0-3.41-1.13-3.45-3.46,0-1.79,0-3.58,0-5.4H197v32.74ZM127.93,168.4v23.75h47.75V168.47H160.79c0,1.9,0,3.64,0,5.38,0,2.33-1.14,3.43-3.48,3.44-3.69,0-7.38,0-11.06,0-2.33,0-3.41-1.13-3.45-3.47,0-1.79,0-3.58,0-5.42ZM106.8,210.2V208q0-87.19,0-174.38c0-1.23.44-3-1.55-3-1.8,0-1.43,1.72-1.43,2.91q0,87.29,0,174.57v2Zm150,0v-2.1q0-87.19,0-174.39c0-1.24.41-3-1.56-3-1.81,0-1.43,1.72-1.43,2.91q0,87.3,0,174.58v2ZM247.7,84.62H112.88v2.77H247.7Zm0,56.86H112.91v2.71H247.74ZM112.85,201.07H247.68v-2.7H112.85Zm71.86-95.51h-8.83v2.76h8.83Zm-38.83-63h5.79V39.74h-5.79Zm68.88-2.79h-5.84v2.75h5.84Zm-2.89,122.52h5.82v-2.79h-5.82Zm-57.15,6.18h-5.81v2.77h5.81Z" />
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
    }
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
