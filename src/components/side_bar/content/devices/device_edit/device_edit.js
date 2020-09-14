import React, { useState, useEffect } from 'react'

// Import Style
import * as styled from './device_edit.style'

// Import basic components
import { deepCopy } from '../../../../../methods/utils/utils'
import Textbox from '../../../../basic/textbox/textbox'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'
import Button from '../../../../basic/button/button'



const DeviceEdit = (props) => {

    const {
        editingDeviceID,
        devices,
        onDeviceDelete,
        setEditingDeviceID,
    } = props

    const [device, setDevice] = useState({})
    const [connectionText, setConnectionText] = useState('Not Connected')
    const [connectionIcon, setConnectionIcon] = useState('fas fa-question')

    // On page load, see if the device is a new device or existing device
    useEffect(() => {

        // If it's a new device then create a device with no name, type or status. Else find the device in the redux store. 
        if (editingDeviceID === 'new') {
            setDevice({ type: '', name: '', status: { task: '', battery: 0 }, ip: '' })
        } else {

            // Deep copy so that edits don't have side effects
            setDevice(deepCopy(devices[editingDeviceID]))
        }

    }, [])

    const handleDeviceConnection = () => {
        console.log('QQQQ Trying to connect to this IP', device.ip)

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

        return (
            <>
                <p>Existing Device</p>
                <styled.DeviceIcon className={'icon-' + device.type} />

            </>
        )

    }

    return (
        <styled.SettingsContainer>
            <styled.SettingsSectionsContainer>

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
            </styled.SettingsSectionsContainer>

            {connectionText === 'Connected' &&

                <styled.SettingsSectionsContainer>
                    {editingDeviceID === 'new' ?
                        handleDeviceAdd()
                        :
                        handleExistingDevice()
                    }
                </styled.SettingsSectionsContainer>

            }



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
                    onDeviceDelete(editingDeviceID)
                    setEditingDeviceID('')
                }}
            >
                Delete
                </Button>

        </styled.SettingsContainer>
    )

}

export default DeviceEdit