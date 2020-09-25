import React from 'react'


export const LocationTypes = {
    shelfPosition: {
        svgPath:
            <>
                {/* <rect fill='none' strokeMiterLimit='10' strokeWidth='10px' x="363.42" y="5" width="28" height="71" rx="10" />
                <rect fill='none' strokeMiterLimit='10' strokeWidth='10px' x="5.42" y="5" width="28" height="71" rx="10" />
                <rect fill='none' strokeMiterLimit='10' strokeWidth='10px' x="5" y="221.99" width="28" height="71" rx="10" />
                <rect fill='none' strokeMiterLimit='10' strokeWidth='10px' x="363.42" y="222" width="28" height="71" rx="10" />
                <path fill='none' strokeMiterLimit='10' strokeWidth='10px' d="M370.83,90.5a20.71,20.71,0,0,1-20.71-20.7V41.7A10.7,10.7,0,0,0,339.42,31H57.84a10.7,10.7,0,0,0-10.7,10.7V69.8A20.71,20.71,0,0,1,26.43,90.5H20.12a10.7,10.7,0,0,0-10.7,10.7v95.58a10.7,10.7,0,0,0,10.7,10.71H26a20.71,20.71,0,0,1,20.71,20.7V256.3A10.7,10.7,0,0,0,57.42,267H339a10.7,10.7,0,0,0,10.7-10.7V228.2a20.71,20.71,0,0,1,20.71-20.7h6.31a10.7,10.7,0,0,0,10.7-10.7V101.2a10.7,10.7,0,0,0-10.7-10.7Z" />
                <path d="M267,119.75l33,47a10,10,0,0,1-8.19,15.74h-66a10,10,0,0,1-8.18-15.74l33-47A10,10,0,0,1,267,119.75Z" />
                <path d="M146.19,119.75l33,47A10,10,0,0,1,171,182.5H105a10,10,0,0,1-8.19-15.74l33-47A10,10,0,0,1,146.19,119.75Z" /> */}

                <path d="M263.53,56.31l33,47a10,10,0,0,1-8.18,15.74h-66a10,10,0,0,1-8.19-15.74l33-47A10,10,0,0,1,263.53,56.31Z"/>
                <path d="M142.71,56.31l33,47a10,10,0,0,1-8.19,15.74h-66a10,10,0,0,1-8.18-15.74l33-47A10,10,0,0,1,142.71,56.31Z"/>
                <circle cx="255.44" cy="146.56" r="12.5"/>
                <circle cx="255.44" cy="181.56" r="7.5"/>
                <circle cx="134.44" cy="146.56" r="12.5"/>
                <circle cx="134.44" cy="181.56" r="7.5"/>
                <rect fill='none' strokeMiterLimit='10' strokeWidth='20px' x="10" y="10" width="378" height="236" rx="30"/>
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