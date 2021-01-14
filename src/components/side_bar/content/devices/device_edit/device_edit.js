import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import uuid from 'uuid'

// Import Style
import * as styled from './device_edit.style'

// Import basic components
import { deepCopy } from '../../../../../methods/utils/utils'
import Textbox from '../../../../basic/textbox/textbox'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'
import Button from '../../../../basic/button/button'

// Import componenets
import Positions from '../../locations/positions/positions'

// Import actions
import { addStation, setSelectedStation } from '../../../../../redux/actions/stations_actions'
import * as deviceActions from '../../../../../redux/actions/devices_actions'
import * as positionActions from '../../../../../redux/actions/positions_actions'

// Import templates
import * as templates from '../devices_templates/device_templates'

// Import Utils
import { DeviceItemTypes } from '../../../../../methods/utils/device_utils'
import { locationsSortedAlphabetically } from '../../../../../methods/utils/locations_utils'

/**
 * This handles editing device informaton
 * This also handles adding devices to the map
 * Currently using 'location' vs 'device' nominclature to match adding a location to the map and because devices really are just locations to the map
 * 
 * @param {*} props 
 */
const DeviceEdit = (props) => {

    const {
        deviceLocationDelete
    } = props

    const [connectionText, setConnectionText] = useState('Not Connected')
    const [connectionIcon, setConnectionIcon] = useState('fas fa-question')
    const [deviceType, setDeviceType] = useState('')
    const [showPositions, setShowPositions] = useState(false)

    const dispatch = useDispatch()
    const dispatchAddStation = (selectedStation) => dispatch(addStation(selectedStation))
    const dispatchSetSelectedStation = (selectedStation) => dispatch(setSelectedStation(selectedStation))
    const onSetSelectedDevice = (selectedDevice) => dispatch(deviceActions.setSelectedDevice(selectedDevice))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const selectedDevice = useSelector(state => state.devicesReducer.selectedDevice)
    const devices = useSelector(state => state.devicesReducer.devices)
    const positions = useSelector(state => state.locationsReducer.positions)

    // On page load, see if the device is a new device or existing device
    // TODO: This is going to fundementally change with how devices 'connect' to the cloud.
    useEffect(() => {

        // If the selected device is not a AMR then set a location. If an AMR, it does not need a location
        if (selectedDevice.device_model !== 'MiR100') {
            // If the selected device does not have a location, then give it a temp one
            if (!selectedLocation) {
                dispatchSetSelectedStation({
                    name: selectedDevice.device_name,
                    device_id: selectedDevice._id,
                    schema: null,
                    type: null,
                    pos_x: 0,
                    pos_y: 0,
                    rotation: 0,
                    x: 0,
                    y: 0,
                    _id: uuid.v4(),
                })
            } else {
                // If selected device has children then it has positions to show
                if (!!selectedLocation.children) {
                    setShowPositions(true)
                }

            }
        }

        // Sets the type of device, unknown devic defaults to an RM logo while known devices use their own custom SVGs
        if (selectedDevice.device_model === 'MiR100') setDeviceType('cart')
        else { setDeviceType('unknown') }


    }, [])

    // TODO: Not sure this is needed with IOT Implementation
    const handleDeviceConnection = () => {

        // Need to see how the device is connecting

        // if (device.status.connection === 'connected') {
        //     setConnectionIcon('fas fa-check')
        //     setConnectionText('Connected')
        // } else if (device.status.connection === 'connecting') {
        //     setConnectionIcon('fas fa-circle-notch fa-spin')
        //     setConnectionText = 'Connecting'
        // }
        // else if (device.status.connection === 'failed') {
        //     setConnectionIcon('fas fa-times')
        //     setConnectionText('Failed')
        // }
        // else {
        //     setConnectionIcon('fas fa-question')
        //     setConnectionText('Not Connected')
        // }

    }

    /**
     * This will appear if a new device has been found with the inputed IP address
     */
    const handleDeviceAdd = () => {

        return (
            <>
                <p>Connected!</p>
            </>
        )
    }

    /**
     * This is used to place the device onto the map
     * Mir cart or AGV do not need to show this because they will already be on the map
     */
    const handleDeviceMapLocation = () => {

        let template = templates.defaultAttriutes

        // Sets the device logo type
        let deviceType = DeviceItemTypes['generic']
        if (!!DeviceItemTypes[selectedDevice.device_model]) deviceType = DeviceItemTypes[selectedDevice.device_model]
        else if (selectedDevice.device_model === 'MiR100') deviceType = DeviceItemTypes['cart']


        return (
            <styled.SectionsContainer style={{ alignItems: 'center', textAlign: 'center', }}>

                <styled.ConnectionText>To add the device to the screen, grab the device with your mouse and drag onto the screen</styled.ConnectionText>

                <styled.DeviceIcon
                    className={deviceType.icon}
                    style={{ color: !!showPositions ? deviceType.primaryColor : 'white' }}
                    onMouseDown={async e => {
                        if (selectedLocation.type !== null) { return }
                        await Object.assign(selectedLocation, { ...template, temp: true })
                        await dispatchAddStation(selectedLocation)
                        await dispatchSetSelectedStation(selectedLocation)
                        setShowPositions(true)
                    }}
                />

            </styled.SectionsContainer>

        )

    }

    /**
     * This is used to set the idle location of the AMR when not in use.
     * This should only show up if th
     */
    const handleAMRIdleLocation = () => {

        return (
            <styled.SectionsContainer>

                <styled.Label schema={'devices'} >Idle Location</styled.Label>
                <DropDownSearch
                    placeholder="Select Location"
                    label="Idle Location for MiR Cart"
                    labelField="name"
                    valueField="name"
                    options={locationsSortedAlphabetically(Object.values(positions))}
                    values={!!selectedDevice.idle_location ? [positions[selectedDevice.idle_location]] : []}
                    dropdownGap={5}
                    noDataLabel="No matches found"
                    closeOnSelect="true"
                    onChange={values => {

                        const idleLocation = values[0]._id
                        onSetSelectedDevice({
                            ...selectedDevice,
                            idle_location: idleLocation,
                        })
                    }}
                    className="w-100"
                    schema="tasks"
                />
            </styled.SectionsContainer>
        )
    }

    const handleSetChildPositionToCartCoords = (position) => {
        Object.values(devices).map(async (device, ind) => {
            if (device.device_model === 'MiR100') {

                const devicePosition = device.position

                const updatedPosition = {
                    ...position,
                    pos_x: devicePosition.pos_x,
                    pos_y: devicePosition.pos_y,
                    x: devicePosition.x,
                    y: devicePosition.y,
                    rotation: devicePosition.orientation,
                }

                dispatch(positionActions.addPosition(updatedPosition))

            }
        })
    }

    // Handles adding positions to the device
    const handlePositions = () => {

        return (
            <>
                <styled.SectionsContainer style={{ alignItems: 'center', textAlign: 'center', userSelect: 'none' }}>

                    <styled.ConnectionText>Add Cart Position associated with this device</styled.ConnectionText>
                    <Positions type='cart_position' handleSetChildPositionToCartCoords={handleSetChildPositionToCartCoords} />

                </styled.SectionsContainer>

                <styled.SectionsContainer style={{ alignItems: 'center', textAlign: 'center', userSelect: 'none' }}>

                    <styled.ConnectionText>Add Shelf Positions associated with this device</styled.ConnectionText>
                    <Positions type='shelf_position' handleSetChildPositionToCartCoords={handleSetChildPositionToCartCoords} />
                </styled.SectionsContainer>
            </>
        )
    }

    // This sets both the device name and station name to the same name
    const handleSetDeviceName = (event) => {
        dispatchSetSelectedStation({
            ...selectedLocation,
            name: event.target.value
        })

        onSetSelectedDevice({
            ...selectedDevice,
            device_name: event.target.value
        })

    }

    return (
        <styled.Container>

            {/* Commented Out for now because we dont need to show/connect via IP TODO: Probably delete   */}
            {/* <styled.SectionsContainer>

                <styled.RowContainer style={{ justifyContent: 'space-between' }}>
                    <styled.SettingsLabel schema={'devices'} >Device IP</styled.SettingsLabel>

                    <styled.ConnectionButton onClick={() => handleDeviceConnection()} disabled={(connectionText === 'Connected' || connectionText === 'Connecting')}>
                        {connectionText}
                        <styled.ConnectionIcon className={connectionIcon} />
                    </styled.ConnectionButton>

                </styled.RowContainer>
                <Textbox
                    defaultValue={device.ip}
                    onChange={(event) => {
                        // Sets the IP address of the device to the event target vcalue
                        setDevice({
                            ...device,
                            ip: event.target.value
                        })
                    }}
                    style={{ fontWeight: '600', fontSize: '1.5rem' }}
                    labelStyle={{ color: 'black' }}
                />
            </styled.SectionsContainer> */}

            <styled.SectionsContainer>

                <styled.Label schema={'devices'} >Device Name</styled.Label>

                <Textbox
                    defaultValue={selectedDevice.device_name}
                    onChange={(event) => {
                        // Sets the IP address of the device to the event target vcalue
                        handleSetDeviceName(event)
                    }}
                    style={{ fontWeight: '600', fontSize: '1.5rem' }}
                    labelStyle={{ color: 'black' }}
                />

            </styled.SectionsContainer>


            {selectedDevice.device_model !== 'MiR100' ?
                handleDeviceMapLocation()
                :
                handleAMRIdleLocation()
            }

            {!!showPositions &&

                handlePositions()
            }

            <Button schema={'devices'} secondary style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '25rem', marginTop: '2rem' }}
                onClick={() => {
                    deviceLocationDelete()
                }}
            >
                Delete
                </Button>

        </styled.Container>
    )

}

export default DeviceEdit