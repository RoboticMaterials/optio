import React from 'react'

const GenericDevice = (props) => {

    const {
        customClassName
    } = props

    return (
        <>
            <linearGradient id="linear-gradient3" x1="72.95" y1="153" x2="287.05" y2="153" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#d7a31e" />
                <stop offset="1" stop-color="#d7841e" />
            </linearGradient>
            <svg id={`${customClassName}-device`} xmlns="http://www.w3.org/2000/svg" >

                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                        <rect fill='#4d4d4d' y="33" width="360" height="240" rx="30" />
                    </g>
                    <g id="RMLogo">
                        <path fill='url(#linear-gradient3)' d="M195.33,232.27c1.06,1.43.51,2.6-1.24,2.6H172a7.18,7.18,0,0,1-5.09-2.6l-58.8-79.35h35.12a29.27,29.27,0,1,0,0-58.53H96.36V234.87H73V71h70.24a52.68,52.68,0,0,1,10,104.4ZM263.64,71.13,214.18,120.6l-14-14a1.35,1.35,0,0,0-.83-.29l-.21,0a1.29,1.29,0,0,0-1.09,1.28,1.1,1.1,0,0,0,0,.26s0,.09,0,.13a57.16,57.16,0,0,1,.65,28.85l0,.13a1.1,1.1,0,0,0,0,.26,1.33,1.33,0,0,0,.29.83,1.45,1.45,0,0,0,.18.17l.6.6,8.15,8.16h0l6.27,6.27,16.32-16.31,33.15-33.15V235h23.41V71.13Z" />
                    </g>
                </g>
            </svg>
        </>

    )
}

export default GenericDevice