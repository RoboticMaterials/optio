import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as styled from './settings.style'

import ContentHeader from '../content_header/content_header'

// Import Components
import Textbox from '../../../basic/textbox/textbox'
import Header from '../../../basic/header/header'
import SmallButton from '../../../basic/small_button/small_button'
import Switch from 'react-ios-switch';

import TimezonePicker, { timezones } from 'react-timezone';

// Import Actions
import { postSettings, getSettings } from '../../../../redux/actions/settings_actions'
import { postLocalSettings } from '../../../../redux/actions/local_actions'
import { deviceEnabled } from '../../../../redux/actions/settings_actions'
import { getStatus } from '../../../../redux/actions/status_actions'
import { postStatus } from '../../../../api/status_api'
import { setCurrentMap } from '../../../../redux/actions/map_actions'

// Import Utils
import { isEquivalent } from '../../../../methods/utils/utils'
import DropDownSearch from "../../../basic/drop_down_search_v2/drop_down_search";
import * as taskActions from "../../../../redux/actions/tasks_actions";

const Settings = () => {

    const dispatch = useDispatch()
    const onPostSettings = (settings) => dispatch(postSettings(settings))
    const onGetSettings = () => dispatch(getSettings())
    const onPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const onSetCurrentMap = (map) => dispatch(setCurrentMap(map))
    const onGetStatus = () => dispatch(getStatus())
    const onDeviceEnabled = (bool) => dispatch(deviceEnabled(bool))

    const mapReducer = useSelector(state => state.mapReducer)
    const serverSettings = useSelector(state => state.settingsReducer.settings)
    const localSettings = useSelector(state => state.localReducer.localSettings)
    const status = useSelector(state => state.statusReducer.status)
    const MiRMapEnabled = useSelector(state => state.localReducer.localSettings.MiRMapEnabled)
    const devices = useSelector(state =>state.devicesReducer.devices)
    const deviceeee = serverSettings.deviceEnabled
    const deviceEnabledSetting = serverSettings.deviceEnabled
    const {
        currentMap,
        maps
    } = mapReducer

    const [serverSettingsState, setServerSettingsState] = useState({})
    const [deviceEnabledState, setDevicesEnabledState] = useState({})
    const [localSettingsState, setLocalSettingsState] = useState({})
    const [mapSettingsState, setMapSettingsState] = useState(currentMap)
    const [mirUpdated, setMirUpdated] = useState(false)
    const [devicesEnabled, setDevicesEnabled] = useState(!!deviceEnabledSetting)

    /**
     *  Sets current settings to state so that changes can be discarded or saved
     * */
    useEffect(() => {
        setServerSettingsState(serverSettings)
        setLocalSettingsState(localSettings)
    }, [])


    /**
     * Handles updating settings on the server
     * All devices that are connected to the server will have these settings
     */
    const handleUpdateServerSettings = (setting) => {

        const key = Object.keys(setting)[0]
        const value = Object.values(setting)[0]

        const updatedSettings = {
            ...serverSettingsState,
            [key]: value,
        }

        setServerSettingsState(updatedSettings)

    }

    /**
     * Handles updating settings on the device
     * These are device specific settings,
     * Changing these will only effect the current device
     */
    const handleUpdateLocalSettings = (setting) => {

        const key = Object.keys(setting)[0]
        const value = Object.values(setting)[0]

        const updatedSettings = {
            ...localSettingsState,
            [key]: value,
        }
        setLocalSettingsState(updatedSettings)

    }

    // Submits the Mir Connection to the backend
    const handleMirConnection = async () => {
        // Tells the backend that a new mir ip has been entered
        const mir = { mir_connection: 'connecting' }

        // post both settiings and status because the IP address is in settings but the backend knows it was updated from the status
        await onPostSettings(serverSettingsState)
        await postStatus(mir)

        setMirUpdated(false)

    }

    // Submits settings to the backend
    const handleSumbitSettings = async () => {
        // Sees if either settings have changed. If the state settigns and redux settings are different, then they've changed
        const localChange = isEquivalent(localSettingsState, localSettings)
        const serverChange = isEquivalent(serverSettingsState, serverSettings)
        const mapChange = !isEquivalent(mapSettingsState, currentMap)
        const deviceChange = isEquivalent(deviceEnabled, deviceEnabledSetting)

        if (!localChange) {
            await onPostLocalSettings(localSettingsState)
            if(localSettingsState.mapViewEnabled){
              //const hamburger = document.querySelector('.hamburger')
              //hamburger.classList.toggle('is-active')
            }

        }

        if (!serverChange) {
            delete serverSettingsState._id
            await onPostSettings(serverSettingsState)
        }

        if (mapChange) {
            // await onPostLocalSettings(localSettingsState)
            await onSetCurrentMap(mapSettingsState)
        }

        if(!deviceChange) {
          await onDeviceEnabled(devicesEnabled)
          await onPostSettings(serverSettingsState)
        }

        await onGetSettings()
        await onGetStatus()

    }

    // Handles Time zone (NOT WORKING)
    const TimeZone = () => {


        return (
            <styled.SettingContainer>

                <styled.Header>Time Zone (NOT WORKING)</styled.Header>

                <TimezonePicker
                    value='Pacific/Honolulu'
                    onChange={() => {}}
                    inputProps={{
                        placeholder: 'Select Timezone ...',
                        name: 'timezone',
                    }}
                    style={{ width: '100%' }}

                />
            </styled.SettingContainer>

        )
    }

    // Handles the MIR IP connectiong
    const MirIp = () => {

        let connectionIcon = ''
        let connectionText = ''

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

        if (MiRMapEnabled) {
            return (
                <styled.SettingContainer style={{ marginTop: '1rem' }}>

                    <styled.RowContainer style={{ position: 'relative', justifyContent: 'space-between' }}>
                        <styled.Header>MIR IP</styled.Header>
                        <styled.ConnectionButton onClick={() => handleMirConnection()} disabled={(connectionText === 'Connected' || connectionText === 'Connecting')}>
                            {connectionText}
                            <styled.ConnectionIcon className={connectionIcon} />
                        </styled.ConnectionButton>

                    </styled.RowContainer>

                    <Textbox
                        placeholder="MiR IP Address"
                        value={serverSettingsState.mir_ip}
                        onChange={(event) => {
                            setServerSettingsState({
                                ...serverSettingsState,
                                mir_ip: event.target.value
                            })
                        }}
                        style={{ width: '100%' }}

                    />

                </styled.SettingContainer>
            )
        }
    }

    const APIAddress = () => {
        //  if(MiRMapEnabled){
        return (
            <styled.SettingContainer>



                <styled.RowContainer>
                    <styled.Header>Show Developer Settings</styled.Header>
`                  <Switch
                        checked={localSettingsState.toggleDevOptions}
                        onChange={() => {
                            handleUpdateLocalSettings({ toggleDevOptions: !localSettingsState.toggleDevOptions })
                        }}
                        onColor='red'
                        style={{ marginRight: '1rem' }}
                    />

                </styled.RowContainer>

                {localSettingsState.toggleDevOptions ?
                    <>

                        <styled.Header style = {{fontSize: '1.2rem'}}>Non Local API IP Address</styled.Header>

                        <styled.RowContainer>
                            <Switch
                                checked={localSettingsState.non_local_api}
                                onChange={() => {
                                    handleUpdateLocalSettings({ non_local_api: !localSettings.non_local_api })
                                }}
                                onColor='red'
                                style={{ marginRight: '1rem' }}
                            />
                            <Textbox
                                placeholder="API IP Address"
                                value={localSettingsState.non_local_api_ip}
                                onChange={(event) => {
                                    handleUpdateLocalSettings({ non_local_api_ip: event.target.value })
                                }}
                                style={{ width: '100%' }}
                            // type = 'number'
                            />
                        </styled.RowContainer>

                        <styled.Header style = {{fontSize: '1.2rem', paddingTop: '2rem'}}>Devices Enabled</styled.Header>

                        <styled.RowContainer>
                            <styled.Header style = {{fontSize: '.8rem', paddingTop: '1rem', paddingRight: '1rem'}}>Disabled</styled.Header>
                            <Switch
                                checked={serverSettingsState.deviceEnabled}
                                onChange={() => {
                                    setDevicesEnabled(!devicesEnabled)
                                    setServerSettingsState({
                                        ...serverSettingsState,
                                        deviceEnabled: !devicesEnabled
                                    })
                                }}
                                onColor='red'
                                style={{ marginRight: '1rem' }}
                            />
                            <styled.Header style = {{fontSize: '.8rem', paddingTop: '1rem'}}>Enabled</styled.Header>
                        </styled.RowContainer>
                    </>
                    :
                    <></>
                }

            </styled.SettingContainer>
        )
        //  }
    }


    const MapViewEnabled = () => {
        return (
            <styled.SettingContainer>


                <styled.Header>Show Map View</styled.Header>


                <styled.RowContainer>
                    <styled.SwitchContainerLabel>Show List View</styled.SwitchContainerLabel>
                    <Switch
                        onColor='red'
                        checked={localSettingsState.mapViewEnabled}
                        onChange={() => {
                            handleUpdateLocalSettings({ mapViewEnabled: !localSettingsState.mapViewEnabled })
                        }}
                        style={{ margin: "0 2rem 0 2rem" }}
                    />
                    <styled.SwitchContainerLabel>Show Map View</styled.SwitchContainerLabel>
                </styled.RowContainer>

            </styled.SettingContainer>
        )
    }

    const CurrentMap = () => {
        const selectedMap = maps.find((map) => map._id === localSettings.currentMapId)
        return (
            <styled.SettingContainer>


                <styled.Header>Current Map</styled.Header>


                <styled.RowContainer>
                    <DropDownSearch
                        placeholder="Select Map"
                        label="Select the map you would like to use for RMStudio"
                        labelField="name"
                        valueField="_id"
                        options={maps}
                        values={selectedMap ? [selectedMap] : []}
                        dropdownGap={5}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {
                            // update current map
                            setMapSettingsState(values[0])
                            // update current map in local storage
                            handleUpdateLocalSettings({ currentMapId: values[0]._id })
                        }}
                        className="w-100"
                    />
                </styled.RowContainer>

            </styled.SettingContainer>
        )
    }

    return (
        <styled.SettingsContainer>
            <ContentHeader content={'settings'} mode={'title'} saveEnabled={true} onClickSave={handleSumbitSettings} />
            {MirIp()}
            {MapViewEnabled()}
            {CurrentMap()}
            {APIAddress()}

            {/* {TimeZone()} */}
        </styled.SettingsContainer>
    )
}

export default Settings
