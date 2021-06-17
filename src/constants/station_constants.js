import React from 'react'

import theme from '../theme';

export const stationColor = theme.main.schema.locations.solid

export const StationTypes = {

    /**
     * Heads up, currently there are 2 different svg rectangles being used
     * One thats width is 200 and height is 320
     * One thats width is 378 and height 236
     * 
     * Need to unify this and make all of them standard
     * Probably use the 200 by 320 since you don't need to add a 'y' offset to the svg
     * 
     *  */

    warehouse: {
        svgPath:
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 400 400">
            <path style={{fill:'none',strokeWidth:15,strokeMiterlimit:10}} d="M334.6,357.6h-260c-16.5,0-30-13.5-30-30v-260c0-16.5,13.5-30,30-30h260c16.5,0,30,13.5,30,30v260
                C364.6,344.1,351.1,357.6,334.6,357.6z"/>
            <g>
                <path d="M224,127c5.1-2.2,9.2-3.9,9.2-3.9s4.1,1.8,9.1,4.1l24.9,11.1c5,2.2,13.3,2.5,18.5,0.6l24.6-9.2
                    c5.1-1.9,5.2-5.1,0-7l-96.5-36.2c-5.1-1.9-13.6-1.9-18.7,0l-96.5,36.2c-5.1,1.9-5.1,5.1,0,7l96.5,36.2c5.1,1.9,13.6,1.9,18.7,0
                    l24.4-9.2c5.1-1.9,5.2-5.2,0.1-7.3l-24.6-10.2c-5.1-2.1-9.2-3.8-9.2-3.8c0,0,4.1-1.8,9.2-3.9L224,127z"/>
            </g>
            <g>
                <path d="M98.5,144c-5.1-1.9-9.4,1-9.4,6.5v109.7c0,5.5,4.2,11.6,9.4,13.5l89.3,33.5c5.1,1.9,9.4-1,9.4-6.5V191
                    c0-5.5-4.2-11.6-9.4-13.5L98.5,144z M146.8,263c0,4.2-4.2,6.1-9.4,4.2l-10.1-3.8c-5.1-1.9-9.4-7-9.4-11.2s4.2-6.1,9.4-4.2
                    l10.1,3.8C142.5,253.7,146.8,258.7,146.8,263z"/>
            </g>
            <g>
                <path d="M285.8,153.2c-5.1,1.9-9.4,8-9.4,13.5v16.1c0,5.5-4.2,11.6-9.4,13.5l-10.1,3.8c-5.1,1.9-9.4-1-9.4-6.5
                    v-16.1c0-5.5-4.2-8.4-9.4-6.5l-17.3,6.5c-5.1,1.9-9.4,8-9.4,13.5v109.7c0,5.5,4.2,8.4,9.4,6.5l89.3-33.5c5.1-1.9,9.4-8,9.4-13.5
                    V150.5c0-5.5-4.2-8.4-9.4-6.5L285.8,153.2z"/>
            </g>
        </svg>,

        attributes:
        {
            schema: 'station',
            type: 'warehouse',
            children: [],
            dashboards: [],
            new: true,
        },
        color: stationColor
    },

    human: {
        svgPath:
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 400 400">
            <path style={{fill:'transparent',strokeWidth:15,strokeMiterlimit:10}} d="M334.6,357.6h-260c-16.5,0-30-13.5-30-30v-260c0-16.5,13.5-30,30-30h260c16.5,0,30,13.5,30,30v260
            C364.6,344.1,351.1,357.6,334.6,357.6z"/>
            <path d="M205.9,200.2c32.7,0,59.3-26.3,59.3-58.7s-26.5-58.7-59.3-58.7s-59.3,26.3-59.3,58.7S173.1,200.2,205.9,200.2z
                M247.4,214.9h-7.7c-10.3,4.7-21.7,7.3-33.8,7.3c-12,0-23.4-2.7-33.8-7.3h-7.7c-34.4,0-62.3,27.6-62.3,61.7v19.1
                c0,12.2,10,22,22.2,22h163c12.3,0,22.2-9.9,22.2-22v-19.1C309.6,242.5,281.7,214.9,247.4,214.9z"/>
        </svg>,
        attributes:
        {
            schema: 'station',
            type: 'human',
            children: [],
            dashboards: [],
            new: true,
        },
        color: stationColor,
    },

}