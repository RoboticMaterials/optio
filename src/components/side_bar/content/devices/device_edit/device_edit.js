import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { Formik, Form } from 'formik'

// Import Style
import * as styled from './device_edit.style'

// Import basic components
import { deepCopy } from '../../../../../methods/utils/utils'
import Textbox from '../../../../basic/textbox/textbox'
import TextField from '../../../../basic/form/text_field/text_field'
import DropDownSearch from '../../../../basic/drop_down_search_v2/drop_down_search'
import Button from '../../../../basic/button/button'
import Switch from '../../../../basic/form/switch_field/switch_field'
import ContentHeader from '../../content_header/content_header'

// Import Schema
import { deviceSchema } from '../../../../../methods/utils/form_schemas'

// Import Components
import DeviceSchedule from './device_schedule/device_schedule'

// Import actions
import { setSelectedDevice, putDevices } from '../../../../../redux/actions/devices_actions'
import { setSelectedStation } from '../../../../../redux/actions/stations_actions'
import { putDashboard } from '../../../../../redux/actions/dashboards_actions'
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
    const dispatchPutDashboard = (dashboard, id) => dispatch(putDashboard(dashboard, id))
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))

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

    // Submits the Mir Connection to the backend
    const onMirConnection = async () => {
        const mir = { mir_connection: 'connecting' }
        await dispatchPutDevice(selectedDevice)
        await dispatchPostStatus(mir)

        setMirUpdated(false)

    }

    const onBack = () => {
        dispatchSetSelectedDevice(null)
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
                    valueField="_id"
                    options={locationsSortedAlphabetically(Object.values(positions))}
                    values={!!selectedDevice.idle_location ? [positions[selectedDevice.idle_location]] : []}
                    dropdownGap={2}
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

    const renderChargeLevels = () => {

        return (
            <styled.SectionsContainer>
                <styled.RowContainer style={{ justifyContent: 'space-around', alignItems: 'center', marginBottom: '.5rem' }}>
                    <styled.Label schema={'devices'} style={{ marginBottom: '0rem', fontWeight: 'bold' }} >Charge Levels</styled.Label>
                    <Switch
                        name={'chargeLevelSwitch'}
                        onColor='red'
                        checked={selectedDevice?.charge_level?.enabled}
                        onChange={() => {
                            dispatchSetSelectedDevice({
                                ...selectedDevice,
                                charge_level: {
                                    ...selectedDevice.charge_level,
                                    enabled: !selectedDevice?.charge_level?.enabled
                                }
                            })
                        }}
                    />
                </styled.RowContainer>
                <styled.RowContainer style={{ justifyContent: 'space-between' }}>
                    <styled.ColumnContainer>
                        <styled.Label schema={'devices'}>
                            Min Level
                    </styled.Label>
                        <TextField
                            name={"minLevel"}
                            placeholder='Min %'
                            InputComponent={Textbox}
                            ContentContainer={styled.RowContainer}
                            style={{
                                'marginBottom': '.5rem',
                                'marginTop': '0',
                                'width': '5rem',
                            }}
                        />
                    </styled.ColumnContainer>
                    <styled.ColumnContainer>
                        <styled.Label schema={'devices'}>
                            Max Level
                    </styled.Label>
                        <TextField
                            name={"maxLevel"}
                            placeholder='Max %'
                            InputComponent={Textbox}
                            ContentContainer={styled.RowContainer}
                            style={{
                                'marginBottom': '.5rem',
                                'marginTop': '0',
                                'width': '5rem',
                            }}
                        />
                    </styled.ColumnContainer>
                </styled.RowContainer>

            </styled.SectionsContainer>
        )
    }


    // This set the device name
    const onSetDeviceName = (name) => {
        dispatchSetSelectedDevice({
            ...selectedDevice,
            device_name: name,
        })
    }

    // Opens up the device dashboard
    const onEditDeviceDashboard = () => {
        const dashboardID = selectedDevice.dashboards[0]
        const deviceID = selectedDevice._id

        history.push(`/locations/${deviceID}/dashboards/${dashboardID}/editing`)
        dispatchHoverStationInfo({ id: deviceID })

    }

    const onUpdateSchedule = (id, attr) => {
        console.log('QQQQ updating this schedule', id, attr)

        dispatchSetSelectedDevice({
            ...selectedDevice,
            schedules: {
                ...selectedDevice.schedules,
                [id]: {
                    ...selectedDevice.schedules[id],
                    ...attr
                }
            }
        })
    }

    /**
     * This function is called when the save button is pressed.
    * If its a Mir100 and the idle location has changed, then handle the associated device dashboard
    */
    const onSaveDevice = async (values) => {
        console.log('QQQQ values', values)
        // Handle Values Passed in through Formik
        if (Object.values(values).length > 0) {
            let deviceCopy = deepCopy(selectedDevice)

            if (!!values.schedules) {
                const schedules = values.schedules

                schedules.forEach((schedule, ind) => {
                    let matchingSchedule = deepCopy(Object.values(selectedDevice.schedules)[ind])
                    // matchingSchedule = {
                    //     ...matchingSchedule,
                    //     ...schedule
                    // }
                    onUpdateSchedule(matchingSchedule.id, schedule)

                })
            }

        }

        console.log('QQQQ device', selectedDevice)

        return

        // If a AMR, then just put device, no need to save locaiton since it does not need one
        if (selectedDevice.device_model === 'MiR100') {

            // Handle Idle Location changes
            // If the idle location of selected device and the unedited version of selected device is different, then change the dashboard button
            if (selectedDevice.idle_location !== devices[selectedDevice._id].idle_location) {

                const dashboard = dashboards[selectedDevice.dashboards[0]]

                // If no idle location, then delete dashboard button if need be
                if (!selectedDevice.idle_location || selectedDevice.idle_location.length === 0) {

                    // Map through buttons
                    dashboard.buttons.map((button, ind) => {
                        // If the button uses the old idle location, then delete the button
                        if (!!button.custom_task && button.custom_task.position === devices[selectedDevice._id].idle_location) {

                            // Delete button
                            dashboard.buttons.splice(ind, 1)
                        }
                    })
                }

                // Add/edit the dashboard button
                else {

                    // Used to see if an idleButton alread exists
                    let idleButtonExists = false

                    dashboard.buttons.map((button, ind) => {
                        // If the button uses the old idle location, then update
                        if (!!button.custom_task && button.custom_task.position === devices[selectedDevice._id].idle_location) {
                            // button exists so dont add a new on
                            idleButtonExists = true

                            // Edit the existing button to use the new idle location
                            button = {
                                ...button,
                                custom_task: {
                                    ...button.custom_task,
                                    position: selectedDevice.idle_location
                                }
                            }
                            // Splice in the new button
                            dashboard.buttons.splice(ind, 1, button)
                        }
                    })

                    // If the button doesnt exist then add the button to the dashbaord
                    if (!idleButtonExists) {
                        const newButton = {
                            'name': 'Send to Idle Location',
                            'color': '#FF4B4B',
                            'task_id': 'custom_task',
                            'custom_task': {
                                'type': 'position_move',
                                'position': selectedDevice.idle_location,
                                'device_type': 'MiR_100',
                            },
                            'deviceType': 'MiR_100',
                            'id': 'custom_task_idle'
                        }
                        dashboard.buttons.push(newButton)
                    }
                }



                // Put the dashboard
                await dispatchPutDashboard(dashboard, dashboard._id.$oid)
            }



            await dispatchPutDevice(selectedDevice, selectedDevice._id)
        }


        dispatchSetSelectedStation(null)
        dispatchSetSelectedDevice(null)
    }

    return (
        <styled.Container>
            <ContentHeader
                content={'devices'}
                mode={!!selectedDevice ? 'create' : 'title'}
                onClickBack={onBack}

                backEnabled={!!selectedDevice ? true : false}

                onClickSave={() => {
                    onSaveDevice()
                }}

            />

            <Formik
                initialValues={{

                }}

                // validation control
                validationSchema={deviceSchema}
                validateOnChange={true}
                validateOnMount={true}
                validateOnBlur={true}

                onSubmit={async (values, { setSubmitting, setTouched, validateForm }) => {
                    validateForm()
                    setSubmitting(true)
                    onSaveDevice(values)
                    setSubmitting(false)
                }}
            >
                {formikProps => {

                    const {
                        submitForm,
                        setValidationSchema,
                        values,
                        errors,
                    } = formikProps
                    // console.log('QQQQ errors', errors)
                    return (
                        <Form>

                            <styled.SectionsContainer>

                                {renderMIRIP()}

                                <styled.Label schema={'devices'} >Device Name</styled.Label>

                                <Textbox
                                    defaultValue={selectedDevice.device_name}
                                    onChange={(event) => {
                                        onSetDeviceName(event.target.value)
                                    }}
                                    style={{ fontWeight: '600', fontSize: '1.5rem' }}
                                    labelStyle={{ color: 'black' }}
                                />

                            </styled.SectionsContainer>


                            {selectedDevice.device_model !== 'MiR100' ?
                                renderDeviceMapLocation()
                                :
                                <styled.ColumnContainer>
                                    {renderAMRIdleLocation()}
                                    {renderChargeLevels()}
                                    <DeviceSchedule selectedDevice={selectedDevice} />
                                </styled.ColumnContainer>

                            }


                            <Button schema={'devices'} style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '25rem', marginTop: '2rem', boxSizing: 'border-box' }}
                                onClick={() => {
                                    onEditDeviceDashboard()
                                }}
                            >
                                Edit Dashboard
                            </Button>

                            <Button schema={'devices'} secondary style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '25rem', marginTop: '2rem', boxSizing: 'border-box' }}
                            // onClick={() => {
                            //     submitForm()
                            // }}
                            >
                                Save Device
                            </Button>
                        </Form>
                    )
                }}
            </Formik>

        </styled.Container>
    )

}

export default DeviceEdit
