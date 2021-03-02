import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ls from 'local-storage'
import * as styled from './settings.style'

import ContentHeader from '../content_header/content_header'

// Import Components
import Textbox from '../../../basic/textbox/textbox'
import Switch from 'react-ios-switch';

import TimezonePicker, { timezones } from 'react-timezone';

import Button from "../../../basic/button/button";

import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

// Import Actions
import { postSettings, getSettings } from '../../../../redux/actions/settings_actions'
import { postLocalSettings } from '../../../../redux/actions/local_actions'
import { deviceEnabled } from '../../../../redux/actions/settings_actions'
import { getStatus } from '../../../../redux/actions/status_actions'
import { setCurrentMap } from '../../../../redux/actions/map_actions'

// Import Utils
import { isEquivalent } from '../../../../methods/utils/utils'
import DropDownSearch from "../../../basic/drop_down_search_v2/drop_down_search";

import config from '../../../../settings/config'

const Settings = () => {

    const dispatch = useDispatch()
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))

    // onPostLocalSettings
    const onPostLocalSettings = (settings) => dispatch(postSettings(settings))
    
    const dispatchGetSettings = () => dispatch(getSettings())
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchSetCurrentMap = (map) => dispatch(setCurrentMap(map))
    const dispatchGetStatus = () => dispatch(getStatus())
    const dispatchDeviceEnabled = (bool) => dispatch(deviceEnabled(bool))

    const mapReducer = useSelector(state => state.mapReducer)
    const serverSettings = useSelector(state => state.settingsReducer.settings)
    const localSettings = useSelector(state => state.localReducer.localSettings)
    const devices = useSelector(state =>state.devicesReducer.devices)
    const deviceEnabledSetting = serverSettings.deviceEnabled
    const {
        currentMap,
        maps
    } = mapReducer

    const [serverSettingsState, setServerSettingsState] = useState({})
    const [localSettingsState, setLocalSettingsState] = useState({})
    const [mapSettingsState, setMapSettingsState] = useState(currentMap)
    const [mirUpdated, setMirUpdated] = useState(false)
    const [devicesEnabled, setDevicesEnabled] = useState(!!deviceEnabledSetting)

    const [mapViewEnabled, setMapViewEnabled] = useState({})
    const [developerSettingsEnabled, setDeveloperSettingsEnabled] = useState({})
    const [nonLocalAPIEnabled, setNonLocalAPIEnabled] = useState({})
    const [nonLocalAPIAddress, setNonLocalAPIAddress] = useState({})
    const [mapID, setMapID] = useState({})

    /**
     *  Sets current settings to state so that changes can be discarded or saved
     * */
    useEffect(() => {
        setServerSettingsState(serverSettings)
        setLocalSettingsState(localSettings)

        setMapViewEnabled(ls.get('MapViewEnabled') || false)
        setDeveloperSettingsEnabled(ls.get('DeveloperSettingsEnabled') || false)
        setNonLocalAPIEnabled(ls.get('NonLocalAPIAddressEnabled') || false)
        setNonLocalAPIAddress(ls.get('NonLocalAPIAddress') || null)
        setMapID(ls.get('MapID') || null)
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

        console.log(updatedSettings)
        
        setLocalSettingsState(updatedSettings)
    }



    // Submits settings to the backend
    const handleSumbitSettings = async () => {
        // Sees if either settings have changed. If the state settigns and redux settings are different, then they've changed
        ls.set('MapViewEnabled', mapViewEnabled)
        ls.set('DeveloperSettingsEnabled', developerSettingsEnabled)
        ls.set('NonLocalAPIAddressEnabled', nonLocalAPIEnabled)
        ls.set('NonLocalAPIAddress', nonLocalAPIAddress)
        ls.set('MapID', mapID)

        const localChange = isEquivalent(localSettingsState, localSettings)
        const serverChange = isEquivalent(serverSettingsState, serverSettings)
        const mapChange = !isEquivalent(mapSettingsState, currentMap)
        const deviceChange = isEquivalent(deviceEnabled, deviceEnabledSetting)

        if (!localChange) {
            await dispatchPostLocalSettings(localSettingsState)
            if(localSettingsState.mapViewEnabled){
              //const hamburger = document.querySelector('.hamburger')
              //hamburger.classList.toggle('is-active')
            }

        }

        if (!serverChange) {
            delete serverSettingsState._id
            await dispatchPostSettings(serverSettingsState)
        }

        if (mapChange) {
            // await dispatchPostLocalSettings(localSettingsState)
            await dispatchSetCurrentMap(mapSettingsState)
        }

        if(!deviceChange) {
          await dispatchDeviceEnabled(devicesEnabled)
          await dispatchPostSettings(serverSettingsState)
        }

        await dispatchGetSettings()
        await dispatchGetStatus()

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



    const APIAddress = () => {
        //  if(MiRMapEnabled){
        return (
            <styled.SettingContainer>



                <styled.RowContainer>
                    <styled.Header>Show Developer Settings</styled.Header>
`                  <Switch
                        checked={!!developerSettingsEnabled}
                        onChange={() => {
                            handleUpdateLocalSettings({ toggleDevOptions: !localSettingsState.toggleDevOptions })
                            setDeveloperSettingsEnabled(!developerSettingsEnabled)
                        }}
                        onColor='red'
                        style={{ marginRight: '1rem' }}
                    />

                </styled.RowContainer>

                {!!developerSettingsEnabled ?
                    <>

                        <styled.Header style = {{fontSize: '1.2rem'}}>Non Local API IP Address</styled.Header>

                        <styled.RowContainer>
                            <Switch
                                checked={!!nonLocalAPIEnabled}
                                onChange={() => {
                                    handleUpdateLocalSettings({ non_local_api: !localSettingsState.non_local_api })
                                    setNonLocalAPIEnabled(!nonLocalAPIEnabled)
                                }}
                                onColor='red'
                                style={{ marginRight: '1rem' }}
                            />
                            {!!nonLocalAPIEnabled &&
                              <Textbox
                                  placeholder="API IP Address"
                                  value={!!nonLocalAPIAddress ? nonLocalAPIAddress:""}
                                  onChange={(event) => {
                                      setNonLocalAPIAddress(event.target.value)
                                      handleUpdateLocalSettings({ non_local_api_ip: event.target.value })
                                  }}
                                  style={{ width: '100%' }}
                              // type = 'number'
                              />
                            }

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
                        checked={!!mapViewEnabled}
                        onChange={() => {
                            handleUpdateLocalSettings({ mapViewEnabled: !localSettingsState.mapViewEnabled })
                            setMapViewEnabled(!mapViewEnabled)
                        }}
                        style={{ margin: "0 2rem 0 2rem" }}
                    />
                    <styled.SwitchContainerLabel>Show Map View</styled.SwitchContainerLabel>
                </styled.RowContainer>

            </styled.SettingContainer>
        )
    }

    const CurrentMap = () => {
        const selectedMap = maps.find((map) => map._id === mapID)
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
                            console.log(values[0])
                            // update current map in local storage
                            handleUpdateLocalSettings({ currentMapId: values[0]._id })
                            setMapID(values[0]._id)
                        }}
                        className="w-100"
                    />
                </styled.RowContainer>

            </styled.SettingContainer>
        )
    }

    const SignOut = () => {

        const localReducer = useSelector(state => state.localReducer.localSettings)

        const signOut = async () => {

            var poolData = {
                UserPoolId: config.UserPoolId,
                ClientId: config.ClientId,
            };
    
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
            var cognitoUser = userPool.getCurrentUser();
            cognitoUser.signOut();

            await onPostLocalSettings({
                ...localReducer,
                authenticated: false
            })

            window.location.reload();

         }
        return (
            <styled.SettingContainer>

                <Button onClick={signOut}> Sign Out </Button>

            </styled.SettingContainer>
        )
    }

    return (
        <styled.SettingsContainer>
            <ContentHeader content={'settings'} mode={'title'} saveEnabled={true} onClickSave={handleSumbitSettings} />
            {MapViewEnabled()}
            {CurrentMap()}
            {SignOut()}
            {APIAddress()}

            {/* {TimeZone()} */}
        </styled.SettingsContainer>
    )
}

export default Settings
