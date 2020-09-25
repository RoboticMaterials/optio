import React from 'react'


export const LocationTypes = {
    shelfPosition: {
        svgPath:
            <>
                <path d="M263.53,56.31l33,47a10,10,0,0,1-8.18,15.74h-66a10,10,0,0,1-8.19-15.74l33-47A10,10,0,0,1,263.53,56.31Z" />
                <path d="M142.71,56.31l33,47a10,10,0,0,1-8.19,15.74h-66a10,10,0,0,1-8.18-15.74l33-47A10,10,0,0,1,142.71,56.31Z" />
                <circle cx="255.44" cy="146.56" r="12.5" />
                <circle cx="255.44" cy="181.56" r="7.5" />
                <circle  stroke='none' cx="134.44" cy="146.56" r="12.5" />
                <circle cx="134.44" cy="181.56" r="7.5" />
                <rect fill='transparent' strokeMiterLimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30" />
            </>,

    },

    workstation: {
        svgPath:
            <>
                <rect x="100" y="40" width="200" height="320" rx="10" transform="translate(400) rotate(90)" fill="none" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="20" />
                <rect x="120" y="60" width="160" height="280" rx="2" transform="translate(400) rotate(90)" fill="#6283f0" />
            </>,
        attributes:
        {
            schema: 'station',
            type: 'workstation',
            children: [],
            dashboards: [],
            new: true,
        },
    },

    cartPosition: {
        svgPath:
            <>
                <rect x="100" y="40" width="200" height="320" rx="30" transform="translate(400 0) rotate(90)" fill="none" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="20" />
                <path d="M315.5,200.87l-64,36.95A1,1,0,0,1,250,237v-73.9a1,1,0,0,1,1.5-.87l64,36.95A1,1,0,0,1,315.5,200.87Z" fill="#6283f0" stroke="#6283f0" strokeMiterlimit="10" strokeWidth="10" />
                <circle cx="200" cy="200" r="15" fill="#6283f0" />
                <circle cx="150" cy="200" r="10" fill="#6283f0" />
                <circle cx="102.5" cy="200" r="7.5" fill="#6283f0" />
            </>,
        attributes:
        {
            schema: 'position',
            type: 'cart_position',
            parent: null,
            new: true,
        },
    }
}