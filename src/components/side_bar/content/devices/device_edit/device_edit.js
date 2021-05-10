import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { Formik, Form } from 'formik'
import uuid from 'uuid';

// Import Style
import * as styled from './device_edit.style'

// external components
import ReactTooltip from "react-tooltip";

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

// Import Constants
import { deviceSchedule } from '../../../../../constants/scheduler_constants'

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
    const currentMapIndex = useSelector(state => state.settingsReducer.settings.currentMapIndex)
    const maps = useSelector(state => state.mapReducer.maps)
    const currentMap = maps[currentMapIndex]
    
    // On page load, see if the device is a new device or existing device
    // TODO: This is going to fundementally change with how devices 'connect' to the cloud.
    useEffect(() => {
        console.log('QQQQ selected device', selectedDevice)
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

    const renderDeviceName = () => {

        return (
                <styled.Label schema={'devices'} >{selectedDevice.device_name}</styled.Label>

            // <styled.SectionsContainer>

            //     <styled.Label schema={'devices'} >Device Name</styled.Label>

            //     <Textbox
            //         defaultValue={selectedDevice.device_name}
            //         placeholder={'Enter Device Name'}
            //         onChange={(event) => {
            //             onSetDeviceName(event.target.value)
            //         }}
            //         style={{ fontWeight: '600', fontSize: '1.5rem' }}
            //         inputStyle={{ backgroundColor: 'white' }}
            //     />

            // </styled.SectionsContainer>
        )
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
                    <Button
                        style={{ margin: '0', marginBottom: '1rem', height: '1.5rem', width: '10rem', display: 'flex', fontSize: '1rem', alignItems: 'center', justifyContent: 'space-evenly' }}
                        schema={'devices'}
                        onClick={() => onMirConnection()}
                        type='button'
                        disabled={(connectionText === 'Connecting')}
                    >
                        {connectionText}
                        <styled.ConnectionIcon className={connectionIcon} />
                    </Button>

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
                    inputStyle={{ backgroundColor: 'white' }}

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
                    style={{ backgroundColor: 'white' }}
                    labelField="name"
                    valueField="_id"
                    options={locationsSortedAlphabetically(Object.values(positions)).filter(pos => pos.map_id === currentMap._id)}
                    values={(!!selectedDevice.idle_location && !!positions[selectedDevice.idle_location])  ? [positions[selectedDevice.idle_location]] : []}
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
                <styled.RowContainer style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                    <styled.Label schema={'devices'} style={{ marginBottom: '0rem' }} >Charge Levels</styled.Label>
                    <Switch
                        name={'charge_level.chargeEnabled'}
                        schema={'devices'}
                    />
                </styled.RowContainer>
                <styled.RowContainer style={{ justifyContent: 'space-between' }}>
                    <styled.ColumnContainer>
                        <styled.RowContainer>
                            <styled.Label schema={'devices'} style={{ fontSize: '1.2rem' }}>
                                Min Percent
                        </styled.Label>
                            <styled.ToolTip data-for='1q' data-tip="Level the cart will go to the charger" className={'fas fa-info-circle'} />
                            <ReactTooltip effect='solid' multiline={true} id='1q' offset={{'top':60, 'left': 100}}/>
                        </styled.RowContainer>

                        <TextField
                            name={"charge_level.min"}
                            placeholder='Min %'
                            InputComponent={Textbox}
                            inputStyle={{ backgroundColor: 'white' }}
                            ContentContainer={styled.RowContainer}
                            style={{
                                'marginBottom': '.5rem',
                                'marginTop': '0',
                                'width': '5rem',
                            }}
                        />
                    </styled.ColumnContainer>
                    <styled.ColumnContainer>
                        <styled.RowContainer>
                            <styled.Label schema={'devices'} style={{ fontSize: '1.2rem' }}>
                                Max Percent
                        </styled.Label>
                            <styled.ToolTip data-tip="Level the cart will leave the charger" className={'fas fa-info-circle'} />
                            <ReactTooltip effect='solid' offset={{'top':60, 'left': 100}}/>
                        </styled.RowContainer>
                        <TextField
                            name={"charge_level.max"}
                            placeholder='Max %'
                            InputComponent={Textbox}
                            inputStyle={{ backgroundColor: 'white' }}
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

    /**
     * This function is called when the save button is pressed.
    * If its a Mir100 and the idle location has changed, then handle the associated device dashboard
    */
    const onSaveDevice = async (values) => {

        let deviceCopy = deepCopy(selectedDevice)

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
            // Handle Values Passed in through Formik
            if (Object.values(values).length > 0) {
                deviceCopy = {
                    ...deviceCopy,
                    ...values,
                }
            }

            await dispatchPutDevice(deviceCopy, deviceCopy._id)
        }


        dispatchSetSelectedStation(null)
        dispatchSetSelectedDevice(null)
    }

    const onInitialValues = () => {
        let initialValues = {}
        if (!!selectedDevice.schedules && Object.values(selectedDevice.schedules).length > 0) {
            initialValues['schedules'] = Object.values(selectedDevice.schedules)
        }
        if (!!selectedDevice.charge_level) {
            initialValues['charge_level'] = selectedDevice.charge_level

        } else {
            initialValues['charge_level'] = { chargeEnabled: false, min: '10', max: '80' }
        }
        return initialValues
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
                initialValues={onInitialValues()}
                enableReinitialize
                validationSchema={deviceSchema}
                validateOnChange={true}
                validateOnMount={false}
                validateOnBlur={true}

                onSubmit={async (values, { setSubmitting, setTouched, validateForm }) => {
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
                        validateForm,
                    } = formikProps
                    return (
                        <Form style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center' }}>

                            {renderDeviceName()}

                            {renderMIRIP()}


                            {selectedDevice.device_model !== 'MiR100' ?
                                renderDeviceMapLocation()
                                :
                                <styled.ColumnContainer>
                                    {renderAMRIdleLocation()}
                                    {renderChargeLevels()}
                                    <DeviceSchedule values={values} />
                                </styled.ColumnContainer>

                            }

                            <Button type={'button'} schema={'devices'} style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '25rem', marginTop: '2rem', boxSizing: 'border-box' }}
                                onClick={() => {
                                    onEditDeviceDashboard()
                                }}
                            >
                                Edit Dashboard
                            </Button>

                            <Button schema={'devices'} type={'submit'} style={{ display: 'inline-block', float: 'right', width: '100%', maxWidth: '25rem', marginTop: 'auto', boxSizing: 'border-box' }}
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
