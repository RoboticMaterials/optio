import React from 'react'

import { DeviceTypes } from '../../../../constants/device_constants'

const MiR100 = (props) => {

    const {
        device,
        d3
    } = props

    const shouldGlow = false


    let type = 'cart'

    if (device['shelf_attached'] > 0) {
        type = 'shelf'
    }

    let color = DeviceTypes[type].primaryColor

    if (device.state_text === 'EmergencyStop') {
        color = 'red'
    }



    return (
        <g
            style={{ fill: color, stroke: color, strokeWidth: '0', opacity: '0.8' }}
            transform={`translate(${device.position.x},${device.position.y}) rotate(${360 - device.position.orientation - 90}) scale(${d3.scale / d3.imgResolution},${-d3.scale / d3.imgResolution})`}
        >

            <svg x="-10" y="-10" width="20" height="20" viewBox="0 0 400 400">

                {DeviceTypes[type].svgPath}

            </svg>


        </g>
    )

}

export default MiR100