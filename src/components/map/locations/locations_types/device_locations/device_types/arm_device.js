import React from 'react'

const ArmDevice = (props) => {

    const {
        customClassName
    } = props

    return (
        <svg xmlns="http://www.w3.org/2000/svg" id={`${customClassName}-device`}>
            <defs>
                <linearGradient id="linear-gradient" x1="82.03" y1="119.98" x2="277.64" y2="119.98" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#1e9cd7" />
                    <stop offset="1" stop-color="#005b97" />
                </linearGradient>
            </defs>
            <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                    <rect  fill='#4d4d4d' width="360" height="240" rx="30" />
                    <path fill='url(#linear-gradient)' d="M173.7,172.2a22.64,22.64,0,1,1-22.64,22.64A22.64,22.64,0,0,1,173.7,172.2Zm.08-4L125.61,65.38A22.53,22.53,0,0,1,103.37,75.8l48.17,102.84a22.53,22.53,0,0,1,22.24-10.42ZM82,49.35a22.64,22.64,0,1,0,22.64-22.63A22.64,22.64,0,0,0,82,49.35ZM240.43,25,127.3,34.91a22.5,22.5,0,0,1,2.14,24.46l113.13-9.9A22.55,22.55,0,0,1,240.43,25Zm1.43,10.68a13.21,13.21,0,1,0,13.21-13.21A13.22,13.22,0,0,0,241.86,35.69ZM250,81.74a57.78,57.78,0,0,0,4.17,13.78,3.78,3.78,0,0,0,.17.35l8.11-1.42-2.61-14.76,6.92-1.22,2.61,14.75,8.1-1.42c0-.14,0-.27,0-.4A57.9,57.9,0,0,0,276.7,77a57.32,57.32,0,0,0-4.18-13.78l-2.61-14.83-23.34,4.12,2.62,14.83A57.43,57.43,0,0,0,250,81.74Zm11.36-.88,5.47,31,2.45,7.46,2.17-.39-.25-7.84-5.46-31Z" />
                </g>
            </g>
        </svg>

    )
}

export default ArmDevice