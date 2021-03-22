import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import * as styled from './settings.style'

// Import Components
import Textbox from '../../../basic/textbox/textbox'
import Switch from 'react-ios-switch';
import Button from "../../../basic/button/button";
import DropDownSearch from "../../../basic/drop_down_search_v2/drop_down_search";
import ContentHeader from '../content_header/content_header'
import {Timezones} from '../../../../constants/timezone_constants'

// Get Auth from amplify
import { Auth } from "aws-amplify";

// Import Actions
import { postSettings, getSettings } from '../../../../redux/actions/settings_actions'
import { postLocalSettings, getLocalSettings } from '../../../../redux/actions/local_actions'

import { deviceEnabled } from '../../../../redux/actions/settings_actions'
import { getStatus } from '../../../../redux/actions/status_actions'
import { setCurrentMap } from '../../../../redux/actions/map_actions'

// Import Utils
import { isEquivalent } from '../../../../methods/utils/utils'

const Settings = () => {

    const history = useHistory()

    const dispatch = useDispatch()
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))
    const dispatchGetSettings = () => dispatch(getSettings())
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = () => dispatch(getLocalSettings())

    const dispatchSetCurrentMap = (map) => dispatch(setCurrentMap(map))
    const dispatchGetStatus = () => dispatch(getStatus())
    const dispatchDeviceEnabled = (bool) => dispatch(deviceEnabled(bool))

    const mapReducer = useSelector(state => state.mapReducer)
    const serverSettings = useSelector(state => state.settingsReducer.settings)
    const localSettings = useSelector(state => state.localReducer.localSettings)
    const mapViewEnabled = useSelector(state => state.localReducer.localSettings.mapViewEnabled)
    const deviceEnabledSetting = serverSettings.deviceEnabled
    const localReducer = useSelector(state => state.localReducer.localSettings)
    const {
        currentMap,
        maps
    } = mapReducer

    const [serverSettingsState, setServerSettingsState] = useState({})
    const [localSettingsState, setLocalSettingsState] = useState({})
    const [mapSettingsState, setMapSettingsState] = useState(currentMap)
    const [mirUpdated, setMirUpdated] = useState(false)
    const [devicesEnabled, setDevicesEnabled] = useState(!!deviceEnabledSetting)
    const [selectedTimezone, setSelectedTimezone] = useState({})
    /**
     *  Sets current settings to state so that changes can be discarded or saved
     * */
    useEffect(() => {
        setServerSettingsState(serverSettings)
        dispatchGetLocalSettings()

    }, [])

    useEffect(() => {
      setLocalSettingsState(localSettings)
    }, [localSettings])

    const handleLoadLocalData = async () => {
      await dispatchGetLocalSettings()
      setLocalSettingsState(localSettings)
    }
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



    // Submits settings to the backend
    const handleSumbitSettings = async () => {
        // Sees if either settings have changed. If the state settigns and redux settings are different, then they've changed
        await dispatchPostLocalSettings(localSettingsState)
        const serverChange = isEquivalent(serverSettingsState, serverSettings)
        const mapChange = !isEquivalent(mapSettingsState, currentMap)
        const deviceChange = isEquivalent(deviceEnabled, deviceEnabledSetting)

        if (!serverChange) {
            delete serverSettingsState._id
            await dispatchPostSettings(serverSettingsState)
        }

        if (mapChange) {
            await dispatchSetCurrentMap(mapSettingsState)
        }

        if (!deviceChange) {
            await dispatchDeviceEnabled(devicesEnabled)
            await dispatchPostSettings(serverSettingsState)
        }

        await dispatchGetSettings()
        await dispatchGetStatus()
        await dispatchGetLocalSettings()


    }

    // Handles Time zone (NOT WORKING)
    const TimeZone = () => {
      const selectedMap = maps.find((map) => map._id === mapReducer.currentMap?._id)

        return (
          <styled.SettingContainer>


              <styled.SwitchContainerLabel>Select a Timezone</styled.SwitchContainerLabel>


              <styled.RowContainer style = {{borderColor: 'transparent'}}>
                  <DropDownSearch
                      placeholder="Select Timezone"
                      label="Select your timezone"
                      labelField="name"
                      valueField="label"
                      options={Timezones}
                      values={!!serverSettingsState.timezone ? [serverSettingsState.timezone] : []}
                      dropdownGap={5}
                      noDataLabel="No matches found"
                      closeOnSelect="true"
                      onChange={values => {
                        handleUpdateServerSettings({timezone: values[0]})
                      }}

                      className="w-100"
                  />
              </styled.RowContainer>

          </styled.SettingContainer>
        )
    }

    const APIAddress = () => {
        //  if(MiRMapEnabled){
        return (
            <styled.SettingContainer >

                <styled.RowContainer style = {{justifyContent: 'start', borderColor: localSettingsState.toggleDevOptions ? "transparent" : "white"}}>
                    <styled.SwitchContainerLabel>Show Developer Settings</styled.SwitchContainerLabel>

                    <styled.ChevronIcon
                        className={!!localSettingsState.toggleDevOptions ? 'fas fa-chevron-up':'fas fa-chevron-down'}
                        style={{ color: 'black' }}
                        onClick={() => {
                          handleUpdateLocalSettings({ toggleDevOptions: !localSettingsState.toggleDevOptions })
                        }}
                    />

                </styled.RowContainer>

                {!!localSettingsState.toggleDevOptions ?
                    <>
                        <styled.RowContainer style = {{borderColor: localSettingsState.non_local_api ? "transparent" : "white" }}>

                          <styled.SwitchContainerLabel>Enable Non Local API</styled.SwitchContainerLabel>

                            <Switch
                                checked={localSettingsState.non_local_api}
                                onChange={() => {
                                    handleUpdateLocalSettings({ non_local_api: !localSettingsState.non_local_api })
                                }}
                                onColor='red'
                                style={{ marginRight: '1rem' }}
                            />

                        </styled.RowContainer>

                        {!!localSettingsState.non_local_api &&
                          <styled.RowContainer style = {{marginTop: '0rem'}}>
                                <Textbox
                                    placeholder="Enter a Non Local IP..."
                                    value={!!localSettingsState.non_local_api_ip? localSettingsState.non_local_api_ip: ""}
                                    onChange={(event) => {
                                        handleUpdateLocalSettings({ non_local_api_ip: event.target.value })
                                    }}
                                    style={{ width: '100%' }}
                                />
                          </styled.RowContainer>
                      }


                        <styled.RowContainer>
                            <styled.SwitchContainerLabel>Enable Devices</styled.SwitchContainerLabel>
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
                        </styled.RowContainer>
                    </>
                    :
                    <></>
                }

            </styled.SettingContainer>
        )
        //  }Choose a Map
    }


    const MapViewEnabled = () => {
        return (
            <styled.SettingContainer>

                <styled.RowContainer style = {{marginTop: '2rem'}}>
                    <styled.SwitchContainerLabel>Enable Map View</styled.SwitchContainerLabel>
                    <Switch
                        onColor='red'
                        checked={!!localSettingsState.mapViewEnabled}
                        onChange={() => {
                            handleUpdateLocalSettings({ mapViewEnabled: !localSettingsState.mapViewEnabled })
                        }}
                    />
                </styled.RowContainer>

            </styled.SettingContainer>
        )
    }

    const CurrentMap = () => {
        const selectedMap = maps.find((map) => map._id === mapReducer.currentMap?._id)
        return (
            <styled.SettingContainer>


                <styled.SwitchContainerLabel>Select a Map</styled.SwitchContainerLabel>


                <styled.RowContainer style = {{borderColor: 'transparent'}}>
                    <DropDownSearch
                        placeholder="Select Map"
                        label="Select the map you would like to use for RMStudio"
                        labelField="name"
                        valueField="_id"
                        options={maps}
                        values={selectedMap ? [selectedMap] : []}
                        dropdownGap={2}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {
                            // update current map
                            setMapSettingsState(values[0])
                            // update current map in local storage
                            handleUpdateLocalSettings({ currentMap: values[0]._id })
                        }}
                        className="w-100"
                    />
                </styled.RowContainer>

            </styled.SettingContainer>
        )
    }

    const SignOut = () => {
        const localReducer = useSelector(
          (state) => state.localReducer.localSettings
        );
    
        const signOut = async () => {
          try {
            await Auth.signOut({ global: true });
          } catch (error) {
            console.log("error signing out: ", error);
          }
    
          await dispatchPostLocalSettings({
            ...localReducer,
            authenticated: false,
          });
    
          history.push('/login')

          window.location.reload()

        };

        return (
            <styled.SettingContainer style={{display: 'flex', justifyContent: 'center'}}>

                <Button onClick={signOut}> Sign Out </Button>

            </styled.SettingContainer>
        )
    }

    return (
        <styled.SettingsContainer>
            <ContentHeader content={'settings'} mode={'title'} saveEnabled={true} onClickSave={handleSumbitSettings} />
            {MapViewEnabled()}
            {CurrentMap()}
            {TimeZone()}
            {SignOut()}
            {APIAddress()}

            {/* {TimeZone()} */}
        </styled.SettingsContainer>
    )
}

export default Settings
