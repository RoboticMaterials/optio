
import React, { useState, useEffect } from 'react'

import * as styled from './device_item.style'


const DeviceItem = (props) => {

    const {
        device,
        isSmall,
        ind,
        setSelectedDevice,
        tasks,
        taskQueue,
    } = props

    const batteryRectWidth = isSmall ? 20 : 25
    const batteryRectRx = batteryRectWidth / 5
    const deviceID = device._id
    const deviceName = device.device_name

    const [deviceType, setDeviceType] = useState('')

    // Sets the type of device on page laod
    useEffect(() => {

        if (device.device_model === 'MiR100') setDeviceType('cart')
        else { setDeviceType('unknown') }

    }, [])

    // Handles Device status, this might have to be tailord for each device
    const handleDeviceStatus = () => {
        // Sets the current task of the device 

        let deviceStatus = ''

        try {
            if (device.state_text === 'EmergencyStop') {
                deviceStatus = 'Emergency Stoped'
            }
            else if (device.current_task_queue_id === null) {
                deviceStatus = 'No Active Task'
            }
            else if (!!device.current_task_queue_id) {
                try {
                    deviceStatus = taskQueue[device.current_task_queue_id.$oid].mission_status
                } catch (error) {
                    deviceStatus = 'No Active Task'
                }
            }

            else {
                // Map through the task q to find the current task and display the task
                deviceStatus = 'This device status is not set up yet.'
            }
        } catch (error) {
            deviceStatus = 'There was an issue with device status'
        }


        return deviceStatus
    }

    const handleDeviceIcon = () => {
        let deviceIcon = 'icon-rmLogo'
        let deviceFontSize = null

        // Sets the icon to be displayed
        if (deviceType === 'arm' || deviceType === 'cart') {
            deviceIcon = 'icon-' + deviceType
        }

        if (deviceType === 'arm' || deviceType === 'unknown') {
            if (isSmall) {
                deviceFontSize = '3rem';

            } else {
                deviceFontSize = '6rem';

            }
        }

        return (
            <styled.DeviceIcon isSmall={isSmall} className={deviceIcon} style={{ fontSize: !!deviceFontSize && deviceFontSize }} />
        )
    }

    const handleDeviceBattery = () => {

        const deviceBattery = device.battery_percentage

        // This sets the battery SVG colors depending on battery level
        let batteryRectFill = ['lime', 'lime', 'lime', 'lime', 'lime']
        let batteryRectStroke = ['none', 'none', 'none', 'none', 'none']
        let batteryTextColor = 'lime'

        if (deviceBattery > 80) {
            batteryRectFill = ['lime', 'lime', 'lime', 'lime', 'lime']
            batteryRectStroke = ['none', 'none', 'none', 'none', 'none']
            batteryTextColor = 'lime'

        } else if (deviceBattery > 60) {
            batteryRectFill = ['none', 'lime', 'lime', 'lime', 'lime']
            batteryRectStroke = ['lime', 'none', 'none', 'none', 'none']
            batteryTextColor = 'lime'

        } else if (deviceBattery > 40) {
            batteryRectFill = ['none', 'none', 'lime', 'lime', 'lime']
            batteryRectStroke = ['lime', 'lime', 'none', 'none', 'none']
            batteryTextColor = 'lime'

        } else if (deviceBattery > 20) {
            batteryRectFill = ['none', 'none', 'none', 'orange', 'orange']
            batteryRectStroke = ['orange', 'orange', 'orange', 'none', 'none']
            batteryTextColor = 'orange'

        } else if (deviceBattery > 10) {
            batteryRectFill = ['none', 'none', 'none', 'none', 'red']
            batteryRectStroke = ['red', 'red', 'red', 'red', 'none']
            batteryTextColor = 'red'

        } else {
            batteryRectFill = ['none', 'none', 'none', 'none', 'none']
            batteryRectStroke = ['red', 'red', 'red', 'red', 'red']
            batteryTextColor = 'red'

        }

        return (
            <>
                <styled.BatteryText isSmall={isSmall} style={{ color: batteryTextColor }}>{deviceBattery.toFixed(0)}%</styled.BatteryText>

                {/* SVG for the battery percent dots. Uses the above arrays to determine what percentage to show */}
                <styled.BatterySvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.6 218.09">

                    <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                            <rect fill={batteryRectFill[4]} stroke={batteryRectStroke[4]} strokeWidth='.3rem' x="13.86" y="174.04" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} transform="translate(-169.27 153.88) rotate(-69.46)" />
                            <rect fill={batteryRectFill[3]} stroke={batteryRectStroke[3]} strokeWidth='.3rem' x="25.91" y="130.42" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} transform="translate(-121.38 165.29) rotate(-79.65)" />
                            <rect fill={batteryRectFill[2]} stroke={batteryRectStroke[2]} strokeWidth='.3rem' x="17.6" y="96.54" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} />
                            <rect fill={batteryRectFill[1]} stroke={batteryRectStroke[1]} strokeWidth='.3rem' x="13.41" y="50.17" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} transform="translate(-10.63 7.92) rotate(-10.35)" />
                            <rect fill={batteryRectFill[0]} stroke={batteryRectStroke[0]} strokeWidth='.3rem' x="1.36" y="6.54" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} transform="translate(-5.01 10.46) rotate(-20.54)" />
                        </g>
                    </g>

                </styled.BatterySvg>
            </>
        )

    }

    const handleDeviceOEE = () => {
        const deviceOEE = device.OEE

        // This sets the OEE SVG colors depending on OEE level
        let OEERectFill = ['lime', 'lime', 'lime', 'lime', 'lime']
        let OEERectStroke = ['none', 'none', 'none', 'none', 'none']
        let OEETextColor = 'lime'

        if (deviceOEE > 80) {
            OEERectFill = ['lime', 'lime', 'lime', 'lime', 'lime']
            OEERectStroke = ['none', 'none', 'none', 'none', 'none']
            OEETextColor = 'lime'

        } else if (deviceOEE > 60) {
            OEERectFill = ['none', 'lime', 'lime', 'lime', 'lime']
            OEERectStroke = ['lime', 'none', 'none', 'none', 'none']
            OEETextColor = 'lime'

        } else if (deviceOEE > 40) {
            OEERectFill = ['none', 'none', 'lime', 'lime', 'lime']
            OEERectStroke = ['lime', 'lime', 'none', 'none', 'none']
            OEETextColor = 'lime'

        } else if (deviceOEE > 20) {
            OEERectFill = ['none', 'none', 'none', 'orange', 'orange']
            OEERectStroke = ['orange', 'orange', 'orange', 'none', 'none']
            OEETextColor = 'orange'

        } else if (deviceOEE > 10) {
            OEERectFill = ['none', 'none', 'none', 'none', 'red']
            OEERectStroke = ['red', 'red', 'red', 'red', 'none']
            OEETextColor = 'red'

        } else {
            OEERectFill = ['none', 'none', 'none', 'none', 'none']
            OEERectStroke = ['red', 'red', 'red', 'red', 'red']
            OEETextColor = 'red'

        }

        return (
            //  Copy of Battery SVG just rotated 180 degrees
            <styled.OEESvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.6 218.09">

                <g id="Layer_2" data-name="Layer 2" transform="rotate(180)">
                    <g id="Layer_1-2" data-name="Layer 1">
                        <rect fill={OEERectFill[0]} stroke={OEERectStroke[0]} strokeWidth='.3rem' x="13.86" y="174.04" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} transform="translate(-169.27 153.88) rotate(-69.46)" />
                        <rect fill={OEERectFill[1]} stroke={OEERectStroke[1]} strokeWidth='.3rem' x="25.91" y="130.42" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} transform="translate(-121.38 165.29) rotate(-79.65)" />
                        <rect fill={OEERectFill[2]} stroke={OEERectStroke[2]} strokeWidth='.3rem' x="17.6" y="96.54" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} />
                        <rect fill={OEERectFill[3]} stroke={OEERectStroke[3]} strokeWidth='.3rem' x="13.41" y="50.17" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} transform="translate(-10.63 7.92) rotate(-10.35)" />
                        <rect fill={OEERectFill[4]} stroke={OEERectStroke[4]} strokeWidth='.3rem' x="1.36" y="6.54" width={batteryRectWidth} height={batteryRectWidth} rx={batteryRectRx} transform="translate(-5.01 10.46) rotate(-20.54)" />
                    </g>
                </g>

            </styled.OEESvg>
        )
    }



    return (

        <styled.DeviceContainer key={ind}>
            {/* <styled.SettingsIcon className='fas fa-cog'/> */}

            <styled.BigCircle isSmall={isSmall}>

                <styled.DeviceTitle isSmall={isSmall}>{deviceName}</styled.DeviceTitle>

                {handleDeviceIcon()}

                <styled.StatusContainer>
                    <styled.StatusText isSmall={isSmall}>
                        {handleDeviceStatus()}
                    </styled.StatusText>
                </styled.StatusContainer>

                {/* Commented out for now, no need to edit device as of Sep 2, 2020 */}
                <styled.EditDeviceIcon
                    isSmall={isSmall}
                    className='fas fa-cog'
                    onClick={() => setSelectedDevice(deviceID)}
                />

            </styled.BigCircle>

            {/* SVG for Gradient Circle. Has 2 linear gradients and conditional statements based on the deviceType. Had to use 2 gradient elements because they are global. Changing the stopColor just changes the global element making all gradients those colors */}
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 518 518" style={{ position: 'absolute', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="linear-gradient" y1="259" x2="518" y2="259" gradientUnits="userSpaceOnUse">
                        <stop offset="0" style={{ stopColor: '#1e9cd7' }} />
                        <stop offset="0.99" style={{ stopColor: '#005b97' }} />
                    </linearGradient>
                    <linearGradient id="linear-gradient2" y1="259" x2="518" y2="259" gradientUnits="userSpaceOnUse">
                        <stop offset="0" style={{ stopColor: '#03ffa3' }} />
                        <stop offset="0.99" style={{ stopColor: '#00b673' }} />
                    </linearGradient>
                    <linearGradient id="linear-gradient3" y1="259" x2="518" y2="259" gradientUnits="userSpaceOnUse">
                        <stop offset="0" style={{ stopColor: '#d7a31e' }} />
                        <stop offset="0.99" style={{ stopColor: '#d7841e' }} />
                    </linearGradient>
                </defs>
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">

                        {deviceType === 'arm' ?
                            <circle className="cls-1" cx="259" cy="259" r="256.5" style={{ fill: 'none', strokeMiterlimit: '10', strokeWidth: '1rem', stroke: 'url(#linear-gradient)' }} />

                            :
                            deviceType === 'cart' ?
                                <circle className="cls-1" cx="259" cy="259" r="256.5" style={{ fill: 'none', strokeMiterlimit: '10', strokeWidth: '1rem', stroke: 'url(#linear-gradient2)' }} />
                                :
                                <circle className="cls-1" cx="259" cy="259" r="256.5" style={{ fill: 'none', strokeMiterlimit: '10', strokeWidth: '1rem', stroke: 'url(#linear-gradient3)' }} />

                        }

                    </g>
                </g>
            </svg>

            {!!device.battery_percentage &&
                handleDeviceBattery()
            }

            {/* Commented out for now since OEE is not implmented */}
            {/* {handleDeviceOEE()} */}




        </styled.DeviceContainer>

    )

}

export default DeviceItem