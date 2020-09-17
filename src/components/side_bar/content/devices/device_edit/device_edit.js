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

// Import actions
import * as locationActions from '../../../../../redux/actions/locations_actions'
import * as deviceActions from '../../../../../redux/actions/devices_actions'

// Import templates
import * as templates from '../devices_templates/device_templates'

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

    const dispatch = useDispatch()
    const onAddLocation = (selectedLocation) => dispatch(locationActions.addLocation(selectedLocation))
    const onSetSelectedLocation = (selectedLocation) => dispatch(locationActions.setSelectedLocation(selectedLocation))
    const onSetSelectedDevice = (selectedDevice) => dispatch(deviceActions.setSelectedDevice(selectedDevice))

    const selectedLocation = useSelector(state => state.locationsReducer.selectedLocation)
    const selectedDevice = useSelector(state => state.devicesReducer.selectedDevice)

    // On page load, see if the device is a new device or existing device
    // TODO: This is going to fundementally change with how devices 'connect'.
    useEffect(() => {

        // If the selected device does not have a location, then give it a temp one
        if (!selectedLocation) {
            onSetSelectedLocation({
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
        }

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
     * This will appear if the device being edited is an existing device
     */
    const handleExistingDevice = () => {

        let template = null
        let deviceIcon = 'icon-rmLogo'

        if (selectedDevice.device_model === 'MiR100') {
            template = templates.armAttriutes
        } else {
            template = templates.armAttriutes
        }

        return (
            <styled.SettingsSectionsContainer style={{ alignItems: 'center', textAlign: 'center', }}>

                <styled.ConnectionText>To add the device to the screen, grab the device with your mouse and drag onto the screen</styled.ConnectionText>

                <styled.DeviceIcon
                    className={deviceIcon}
                    onMouseDown={async e => {
                        if (selectedLocation.type !== null) { return }
                        await Object.assign(selectedLocation, { ...template, temp: true })
                        await onAddLocation(selectedLocation)
                        await onSetSelectedLocation(selectedLocation)
                    }

                    }
                />


            </styled.SettingsSectionsContainer>

        )

    }

    const handleAddDeviceToMap = () => {

    }

    // This sets both the device name and station name to the same name
    const handleSetDeviceName = (event) => {
        onSetSelectedLocation({
            ...selectedLocation,
            name: event.target.value
        })

        onSetSelectedDevice({
            ...selectedDevice,
            device_name: event.target.value
        })

    }

    return (
        <styled.SettingsContainer>

            {/* Commented Out for now because we dont need to show/connect via IP TODO: Probably delete   */}
            {/* <styled.SettingsSectionsContainer>

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
            </styled.SettingsSectionsContainer> */}

            <styled.SettingsSectionsContainer>

                <styled.SettingsLabel schema={'devices'} >Device Name</styled.SettingsLabel>

                <Textbox
                    defaultValue={selectedDevice.device_name}
                    onChange={(event) => {
                        // Sets the IP address of the device to the event target vcalue
                        handleSetDeviceName(event)
                    }}
                    style={{ fontWeight: '600', fontSize: '1.5rem' }}
                    labelStyle={{ color: 'black' }}
                />

            </styled.SettingsSectionsContainer>


            {handleExistingDevice()}


            {/* <styled.SettingsSectionsContainer>
                <styled.SettingsLabel schema={'devices'}>Device Type</styled.SettingsLabel>
                <DropDownSearch
                    options={availableDevices}
                    valuefield={'type'}
                    searchBy={'type'}
                    labelField={'type'}
                    style={{ width: '100%', fontSize: '1rem' }}
                    values={!!device.type ? availableDevices.filter(d => d.type === device.type) : []}
                    onChange={(values) => {
                        device.type = values[0].type
                    }}
                    label='Select Device Type'
                    key={2}
                    closeOnSelect={true}
                    dropdownGap={5}
                    backspaceDelete={true}
                    noDataLabel={"No matches found"}

                />
            </styled.SettingsSectionsContainer> */}

            <Button schema={'devices'} secondary style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '25rem', marginTop: '2rem' }}
                onClick={() => {
                    deviceLocationDelete()
                }}
            >
                Delete
                </Button>

        </styled.SettingsContainer>
    )

}

export default DeviceEdit