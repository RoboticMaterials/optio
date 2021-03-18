import React from 'react'
import uuid from 'uuid'

const positionColor = '#2adba6';

export const PositionTypes = {

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
            <svg>
                <rect fill='transparent' x="100" y="40" width="200" height="320" rx="30" transform="translate(400 0) rotate(90)" strokeMiterlimit="10" strokeWidth="20" />
                <g y="65" transform="scale(0.87) translate(35, 100)">
                    <path d="M263.53,56.31l33,47a10,10,0,0,1-8.18,15.74h-66a10,10,0,0,1-8.19-15.74l33-47A10,10,0,0,1,263.53,56.31Z" />
                    <path d="M142.71,56.31l33,47a10,10,0,0,1-8.19,15.74h-66a10,10,0,0,1-8.18-15.74l33-47A10,10,0,0,1,142.71,56.31Z" />
                
                    <circle cx="255.44" cy="146.56" r="12.5" />
                    <circle cx="255.44" cy="181.56" r="7.5" />
                    <circle cx="134.44" cy="146.56" r="12.5" />
                    <circle cx="134.44" cy="181.56" r="7.5" />
                </g>
            </svg>,
        attributes:
        {
            schema: 'position',
            type: 'shelf_position',
            parent: null,
            new: true,
        },
        color: positionColor,

    },

    charger_position: {
        svgPath:
            <svg>
                <path d="M344.75,131.18l-47,33A10,10,0,0,1,282,156V90a10,10,0,0,1,15.75-8.18l47,33A10,10,0,0,1,344.75,131.18Z" />
                <rect fill='none' strokeMiterlimit='10' strokeWidth='20px' x="5" y="5" width="378" height="236" rx="30" />
                <path d="M251,171.13c-2.45,3.47-4.09,3.9-8.1,2.12l-73.27-32.63c-.72-.32-1.45-.61-2.47-1v3.15q0,12.9,0,25.81c0,4.89-3,6.91-7.46,5L31.14,118.34c-2.83-1.22-4.08-3.12-3.65-5.47s2.19-3.61,5.09-3.91q29.51-3,59-6c9-.91,17.93-1.86,26.91-2.63,1.81-.15,2.1-.82,2.06-2.38-.09-3.65,0-7.29,0-10.94,0-4.26,1.43-5.77,5.64-6.1q32.61-2.53,65.23-5.1c17.69-1.36,35.38-2.65,53.06-4.08,2.93-.23,5.1.52,6.54,3.12Z" />
                <rect fill='transparent' strokeMiterlimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30" />
            </svg>,
        color: '#fbd34e',

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
        color: positionColor,
    },

    temporary_cart_position: {
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
            schema: 'temporary_position',
            type: 'cart_position',
            parent: null,
            new: true,
        },
        color: '#6283f0',
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

export const newPositionTemplate = (name, type, parent, map_id) => {

    return {
        name: name,
        schema: 'position',
        type: type,
        temp: true,
        new: true,
        pos_x: 0,
        pos_y: 0,
        rotation: 0,
        x: 0,
        y: 0,
        parent: parent,
        _id: uuid.v4(),
        map_id: map_id
    }
}
