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

    warehouse: {
        svgPath:
            <svg y="50" x='50'>

                {/* <path d="M63.74,128.08v43.71H236.26V128h-69c0,2.79,0,5.34,0,7.89-.06,3.58-1.85,5.23-5.86,5.25q-11.43.07-22.86,0c-4,0-5.81-1.66-5.87-5.24,0-2.62,0-5.25,0-7.8Z" />
                <path d="M261.06,97.3H38.92v4.08H261.06Z" />
                <path d="M261,171.79v-61.3H39.05v61.38H53.61v-3.25q0-21.75,0-43.5c0-4.68,1.51-6,6.82-6H239.57c5.3,0,6.81,1.34,6.81,6q0,21.9,0,43.78v2.89Z" />
                <path d="M157.27,128.11H142.73v4.06h14.54Z" />
                <path d="M26.33,18C23.36,18,24,20.48,24,22.24q0,128.43,0,256.88v3h4.9v-3.18q0-128.31,0-256.61C28.88,20.5,29.61,17.88,26.33,18Z" />
                <path d="M236.3,31.27H216.73c0,2.69,0,5.16,0,7.63,0,3.82-1.73,5.36-6,5.38q-8.79,0-17.6,0c-4.41,0-6-1.53-6.07-5.56,0-2.52,0-5,0-7.6H167.52V88.17H236.3Z" />
                <path d="M206.78,31.22h-9.61v4h9.61Z" />
                <path d="M38.86,268.67H261v-4H38.86Z" />
                <path d="M132.53,31.23H112.92c0,2.74,0,5.29,0,7.85,0,3.61-1.79,5.18-5.85,5.2q-9,.06-17.92,0c-4.07,0-5.81-1.58-5.87-5.19,0-2.62,0-5.24,0-7.81H63.59V88.11h68.94Z" />
                <path d="M102.84,31.25H93.29v4.07h9.55Z" />
                <path d="M39,185H261.13v-4H39Z" />
                <path d="M261,255.49V194.14H39v61.44H53.62v-3.2q0-17.48,0-35c0-4.33,1.62-5.76,6.48-5.76H146c4.9,0,6.5,1.4,6.51,5.72q0,17.63,0,35.25v2.86H167.3v-3.14q0-24,0-47.91c0-4.68,1.51-6,6.81-6h65.48c5.29,0,6.79,1.34,6.79,6q0,24,0,47.91v3.12Z" />
                <path d="M107.85,220.61H98.28v4.08h9.57Z" />
                <path d="M270,0H30A30,30,0,0,0,0,30V270a30,30,0,0,0,30,30H270a30,30,0,0,0,30-30V30A30,30,0,0,0,270,0Zm15.92,219.88q0,32.76,0,65.52c0,4-1.72,5.55-6.1,5.58q-6.33,0-12.66,0c-4.19,0-5.9-1.62-5.94-5.43,0-2.54,0-5.08,0-7.65H38.79c0,2.84.05,5.49,0,8.14-.07,3.25-1.89,4.87-5.55,4.93s-7.62,0-11.43,0c-6.43,0-7.67-1.12-7.67-7q0-130.77-.12-261.55C14,15.73,16.72,11.2,24,9h4.94c7.25,2.17,10,6.69,10,13.45-.22,20.83-.08,41.66-.08,62.49v3.15H53.62V28.43c0-4.85,1.52-6.19,7-6.19h75.05c5.43,0,6.93,1.35,6.93,6.23V88.11h14.83V28.47c0-4.88,1.5-6.23,6.93-6.23h75c5.47,0,7,1.34,7,6.18v59.7H261.2V84.94c0-20.83.14-41.66-.08-62.49-.07-6.76,2.73-11.28,10-13.45H276c7.39,2.24,10,6.93,10,13.75Q285.79,121.32,285.92,219.88Z" />
                <path d="M273.45,18c-3,.05-2.35,2.53-2.35,4.28q0,128.46,0,256.91V282H276V279q0-128.32,0-256.64C276,20.49,276.71,17.89,273.45,18Z" />
                <path d="M177.45,207.42v48.17h58.83V207.37H222.12c-.22.21-.35.27-.35.34,0,2.57,0,5.13-.11,7.7-.08,3.4-1.88,5-5.74,5.05q-9.1.06-18.21,0c-3.84,0-5.62-1.66-5.69-5.1-.05-2.63,0-5.26,0-7.93Z" />
                <path d="M63.71,220.58v34.95h78.68V220.69H117.87c0,2.79,0,5.36,0,7.92-.07,3.42-1.87,5-5.74,5.06q-9.11.08-18.22,0c-3.83,0-5.62-1.67-5.68-5.11,0-2.63,0-5.26,0-8Z" />
                <path d="M211.61,207.41H202v4.11h9.59Z" /> */}


                <rect width="300" height="300" rx="30" />
                <path fill='#3B3C43' d="M271.1,9H276c7.39,2.24,10,6.93,10,13.75q-.21,98.57-.08,197.12,0,32.77,0,65.53c0,4-1.72,5.55-6.1,5.58q-6.33,0-12.66,0c-4.19,0-5.9-1.62-5.94-5.43,0-2.54,0-5.08,0-7.65H38.79c0,2.84.05,5.49,0,8.14-.07,3.25-1.89,4.87-5.55,4.93s-7.62,0-11.43,0c-6.43,0-7.67-1.12-7.67-7q0-130.77-.12-261.55C14,15.73,16.72,11.2,24,9h4.94c7.25,2.17,10,6.69,10,13.45-.22,20.83-.08,41.66-.08,62.49v3.15H53.62V28.43c0-4.85,1.52-6.19,7-6.19h75.05c5.43,0,6.93,1.35,6.93,6.23V88.11h14.83V28.47c0-4.88,1.5-6.23,6.93-6.23h75c5.47,0,7,1.34,7,6.18v59.7H261.2V84.94c0-20.83.14-41.66-.08-62.49C261.05,15.69,263.85,11.17,271.1,9ZM167.3,128c0,2.79,0,5.34,0,7.89-.06,3.58-1.85,5.23-5.86,5.25q-11.43.07-22.86,0c-4,0-5.81-1.66-5.87-5.24,0-2.62,0-5.25,0-7.8h-69v43.71H236.26V128ZM53.62,255.58v-3.2q0-17.48,0-35c0-4.33,1.62-5.76,6.48-5.76H146c4.9,0,6.5,1.4,6.51,5.72q0,17.63,0,35.25v2.86H167.3v-3.14q0-24,0-47.91c0-4.68,1.51-6,6.81-6h65.48c5.29,0,6.79,1.34,6.79,6q0,24,0,47.91v3.12H261V194.14H39v61.44Zm10-167.47h68.94V31.23H112.92c0,2.74,0,5.29,0,7.85,0,3.61-1.79,5.18-5.85,5.2q-9,.06-17.92,0c-4.07,0-5.81-1.58-5.87-5.19,0-2.62,0-5.24,0-7.81H63.59Zm103.93-57V88.17H236.3V31.27H216.73c0,2.69,0,5.16,0,7.63,0,3.82-1.73,5.36-6,5.38q-8.79,0-17.6,0c-4.41,0-6-1.53-6.07-5.56,0-2.52,0-5,0-7.6ZM53.61,171.87v-3.25q0-21.75,0-43.5c0-4.68,1.51-6,6.82-6H239.57c5.3,0,6.81,1.34,6.81,6q0,21.9,0,43.78v2.89H261v-61.3H39.05v61.38Zm182.67,83.72V207.37H222.12c-.22.21-.35.27-.35.34,0,2.57,0,5.13-.11,7.7-.08,3.4-1.88,5-5.74,5.05q-9.1.06-18.21,0c-3.84,0-5.62-1.66-5.69-5.1-.05-2.63,0-5.26,0-7.93H177.45v48.17Zm-172.57-35v34.95h78.68V220.69H117.87c0,2.79,0,5.36,0,7.92-.07,3.42-1.87,5-5.74,5.06q-9.11.08-18.22,0c-3.83,0-5.62-1.67-5.68-5.11,0-2.63,0-5.26,0-8ZM28.9,282.1v-3.18q0-128.31,0-256.61c0-1.81.73-4.43-2.55-4.36C23.36,18,24,20.48,24,22.24q0,128.43,0,256.88v3ZM276,282V279q0-128.32,0-256.64c0-1.82.7-4.42-2.56-4.36-3,.05-2.35,2.53-2.35,4.28q0,128.46,0,256.91V282Zm-15-184.74H38.92v4.08H261.06Zm.07,83.68H39v4H261.13ZM38.86,268.67H261v-4H38.86ZM157.27,128.11H142.73v4.06h14.54Zm-64-92.79h9.55V31.25H93.29Zm113.49-4.1h-9.61v4h9.61ZM202,211.52h9.59v-4.11H202Zm-94.17,9.09H98.28v4.08h9.57Z" />
            </svg>,

        attributes:
        {
            schema: 'station',
            type: 'warehouse',
            children: [],
            dashboards: [],
            new: true,
        },
        color: '#f4a460'
    },

    // charger_position: charge_position,

    workstation: {
        svgPath:
            <>
                <rect x="100" y="40" width="300" height="300" rx="10" transform="translate(390 -50) rotate(90)" fill="none" strokeMiterlimit="10" strokeWidth="20" />
                <rect x="120" y="60" width="260" height="260" rx="2" transform="translate(390 -50) rotate(90)" />
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

    human: {
        svgPath:
            // <svg y="70">
            //     <rect fill='transparent' strokeMiterlimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30" />
            //     <path d="M194,123a49.63,49.63,0,1,0-49.62-49.63A49.62,49.62,0,0,0,194,123Zm34.74,12.41h-6.48a67.51,67.51,0,0,1-56.52,0h-6.48a52.12,52.12,0,0,0-52.1,52.1v16.13a18.61,18.61,0,0,0,18.61,18.61H262.23a18.61,18.61,0,0,0,18.61-18.61V187.51A52.12,52.12,0,0,0,228.74,135.41Z" />
            // </svg>,
            <svg y="50" x='50'>
                <rect width="300" height="300" rx="30" />
                <path fill='#3B3C43' d="M150,150A56.07,56.07,0,1,0,93.94,93.94,56.05,56.05,0,0,0,150,150Zm39.24,14h-7.31a76.32,76.32,0,0,1-63.86,0h-7.31a58.88,58.88,0,0,0-58.87,58.86V241.1a21,21,0,0,0,21,21H227.09a21,21,0,0,0,21-21V222.88A58.88,58.88,0,0,0,189.24,164Z" />
            </svg>,
        attributes:
        {
            schema: 'station',
            type: 'human',
            children: [],
            dashboards: [],
            new: true,
        },
        color: '#5eec33',
    },

    // human_position: {
    //     svgPath:
    //         // <svg y="70">
    //         //     <rect fill='transparent' strokeMiterlimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30" />
    //         //     <path d="M194,123a49.63,49.63,0,1,0-49.62-49.63A49.62,49.62,0,0,0,194,123Zm34.74,12.41h-6.48a67.51,67.51,0,0,1-56.52,0h-6.48a52.12,52.12,0,0,0-52.1,52.1v16.13a18.61,18.61,0,0,0,18.61,18.61H262.23a18.61,18.61,0,0,0,18.61-18.61V187.51A52.12,52.12,0,0,0,228.74,135.41Z" />
    //         // </svg>,
    //         <svg y="50" x='50'>
    //             <rect width="300" height="300" rx="30" />
    //             <path fill='#3B3C43' d="M150,150A56.07,56.07,0,1,0,93.94,93.94,56.05,56.05,0,0,0,150,150Zm39.24,14h-7.31a76.32,76.32,0,0,1-63.86,0h-7.31a58.88,58.88,0,0,0-58.87,58.86V241.1a21,21,0,0,0,21,21H227.09a21,21,0,0,0,21-21V222.88A58.88,58.88,0,0,0,189.24,164Z" />
    //         </svg>,
    //     attributes:
    //     {
    //         schema: 'station',
    //         type: 'human',
    //         parent: null,
    //         new: true,
    //     },
    //     color: '#5eec33',
    // },

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
