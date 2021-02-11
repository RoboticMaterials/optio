import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

// Import Style
import * as styled from './device_edit.style'

// Import basic components
import { deepCopy } from '../../../../../methods/utils/utils'
import Textbox from '../../../../basic/textbox/textbox'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'
import Button from '../../../../basic/button/button'

// Import actions
import { setSelectedDevice, putDevices } from '../../../../../redux/actions/devices_actions'
import { widgetLoaded, hoverStationInfo } from '../../../../../redux/actions/widget_actions'
import { postStatus } from '../../../../../redux/actions/status_actions'

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

    const history = useHistory()

    const [connectionText, setConnectionText] = useState('Not Connected')
    const [connectionIcon, setConnectionIcon] = useState('fas fa-question')
    const [deviceType, setDeviceType] = useState('')
    const [mirUpdated, setMirUpdated] = useState(false)

    const dispatch = useDispatch()
    const dispatchSetSelectedDevice = (selectedDevice) => dispatch(setSelectedDevice(selectedDevice))
    const dispatchHoverStationInfo = (info) => dispatch(hoverStationInfo(info))
    const dispatchPutDevice = (device) => dispatch(putDevices(device, device._id))
    const dispatchPostStatus = (status) => dispatch(postStatus(status))

    const selectedDevice = useSelector(state => state.devicesReducer.selectedDevice)
    const devices = useSelector(state => state.devicesReducer.devices)
    const positions = useSelector(state => state.positionsReducer.positions)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const status = useSelector(state => state.statusReducer.status)

    // On page load, see if the device is a new device or existing device
    // TODO: This is going to fundementally change with how devices 'connect' to the cloud.
    useEffect(() => {

        // Sets the type of device, unknown devic defaults to an RM logo while known devices use their own custom SVGs
        if (selectedDevice.device_model === 'MiR100') setDeviceType('cart')

    }, [])

    // TODO: Not sure this is needed with IOT Implementation
    const onDeviceConnection = () => {

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

    // Submits the Mir Connection to the backend
    const onMirConnection = async () => {
        const mir = { mir_connection: 'connecting' }
        await dispatchPutDevice(selectedDevice)
        await dispatchPostStatus(mir)

        setMirUpdated(false)

    }

    const renderMIRIP = () => {
        // Handles the MIR IP connectiong
        let connectionIcon = ''
        let connectionText = ''

        // Have to use the naked device state since that is the one that is being update by the backend
        const device = devices[selectedDevice._id]


        // Sets the connection variables according to the state of
        if (mirUpdated) {
            connectionIcon = 'fas fa-question'
            connectionText = 'Not Connected'
        }
        else if (status.mir_connection === 'connected') {
            connectionIcon = 'fas fa-check'
            connectionText = 'Connected'
        }
        else if (status.mir_connection === 'connecting') {
            connectionIcon = 'fas fa-circle-notch fa-spin'
            connectionText = 'Connecting'
        }
        else if (status.mir_connection === 'failed') {
            connectionIcon = 'fas fa-times'
            connectionText = 'Failed'
        }
        else {
            connectionIcon = 'fas fa-question'
            connectionText = 'Not Connected'

        }

        return (
            <styled.SectionsContainer style={{ marginTop: '1rem' }}>

                <styled.RowContainer style={{ position: 'relative', justifyContent: 'space-between' }}>
                    <styled.Label schema={'devices'}>MIR IP</styled.Label>
                    <styled.ConnectionButton onClick={() => onMirConnection()} disabled={(connectionText === 'Connecting')}>
                        {connectionText}
                        <styled.ConnectionIcon className={connectionIcon} />
                    </styled.ConnectionButton>

                </styled.RowContainer>

                <Textbox
                    placeholder="MiR IP Address"
                    value={selectedDevice.ip_address}
                    onChange={(event) => {
                        setMirUpdated(true)
                        dispatchSetSelectedDevice({
                            ...selectedDevice,
                            ip_address: event.target.value
                        })

                    }}
                    style={{ width: '100%' }}

                />

            </styled.SectionsContainer>
        )
    }

    /**
     * This is used to place the device onto the map
     * Mir cart or AGV do not need to show this because they will already be on the map
     */
    const renderDeviceMapLocation = () => {

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
                    style={{ color: 'white' }}
                    onMouseDown={async e => {

                    }}
                />

            </styled.SectionsContainer>

        )

    }

    /**
     * This is used to set the idle location of the AMR when not in use.
     * This should only show up if th
     */
    const renderAMRIdleLocation = () => {

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
                        dispatchSetSelectedDevice({
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

    // This sets both the device name and station name to the same name
    const onSetDeviceName = (event) => {
    }

    // Opens up the device dashboard
    const onEditDeviceDashboard = () => {
        const dashboardID = selectedDevice.dashboards[0]
        const deviceID = selectedDevice._id

        // const url = `${deviceID}/dashboards/${dashboardID}/editing`

        history.push(`/locations/${deviceID}/dashboards/${dashboardID}/editing`)
        dispatchHoverStationInfo({ id: deviceID })

    }

    return (
        <styled.Container>

            {/* Commented Out for now because we dont need to show/connect via IP TODO: Probably delete   */}
            {/* <styled.SectionsContainer>

                <styled.RowContainer style={{ justifyContent: 'space-between' }}>
                    <styled.SettingsLabel schema={'devices'} >Device IP</styled.SettingsLabel>

                    <styled.ConnectionButton onClick={() => onDeviceConnection()} disabled={(connectionText === 'Connected' || connectionText === 'Connecting')}>
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

                {renderMIRIP()}

                <styled.Label schema={'devices'} >Device Name</styled.Label>

                <Textbox
                    defaultValue={selectedDevice.device_name}
                    onChange={(event) => {
                        // Sets the IP address of the device to the event target vcalue
                        onSetDeviceName(event)
                    }}
                    style={{ fontWeight: '600', fontSize: '1.5rem' }}
                    labelStyle={{ color: 'black' }}
                />

            </styled.SectionsContainer>


            {selectedDevice.device_model !== 'MiR100' ?
                renderDeviceMapLocation()
                :
                renderAMRIdleLocation()
            }

            <Button schema={'devices'} style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '25rem', marginTop: '2rem', boxSizing: 'border-box' }}
                onClick={() => {
                    onEditDeviceDashboard()
                }}
            >
                Edit Dashboard
            </Button>


            {/* <Button schema={'devices'} secondary style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '25rem', marginTop: '2rem' }}
                onClick={() => {
                    deviceLocationDelete()
                }}
            >
                Delete
                </Button> */}

        </styled.Container>
    )

}

export default DeviceEdit
