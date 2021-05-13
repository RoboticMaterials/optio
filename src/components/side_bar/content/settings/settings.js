import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TimezoneSelect from 'react-timezone-select'

// Import Components
import Textbox from '../../../basic/textbox/textbox'
import Switch from 'react-ios-switch';
import TimezonePicker, { timezones } from 'react-timezone';
import Button from "../../../basic/button/button";
import DropDownSearch from "../../../basic/drop_down_search_v2/drop_down_search";
import ContentHeader from '../content_header/content_header'
import { Timezones } from '../../../../constants/timezone_constants'
import ConfirmDeleteModal from '../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import TaskAddedAlert from "../../../widgets/widget_pages/dashboards_page/dashboard_screen/task_added_alert/task_added_alert";
import { ADD_TASK_ALERT_TYPE } from "../../../../constants/dashboard_constants";

import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import * as styled from './settings.style'

// Import Actions
import {postSettings, getSettings, putSettings} from '../../../../redux/actions/settings_actions'
import { postLocalSettings, getLocalSettings } from '../../../../redux/actions/local_actions'
import { putDashboard } from '../../../../redux/actions/dashboards_actions'


import { deviceEnabled } from '../../../../redux/actions/settings_actions'
import { getStatus } from '../../../../redux/actions/status_actions'
import { setCurrentMap } from '../../../../redux/actions/map_actions'

// Import Utils
import { getIsEquivalent } from '../../../../methods/utils/utils'
import { useHistory } from "react-router-dom";

const Settings = () => {

    const history = useHistory()

    const dispatch = useDispatch()
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))
    const dispatchPutSettings = (settings) => dispatch(putSettings(settings))
    const dispatchGetSettings = () => dispatch(getSettings())
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = () => dispatch(getLocalSettings())
    const dispatchPutDashboard = (dashboard, id) => dispatch(putDashboard(dashboard,id))
    const dispatchGetStatus = () => dispatch(getStatus())
    const dispatchDeviceEnabled = (bool) => dispatch(deviceEnabled(bool))
    const dispatchSetCurrentMap = (mapID) => dispatch(setCurrentMap(mapID))

    const mapReducer = useSelector(state => state.mapReducer)
    const serverSettings = useSelector(state => state.settingsReducer.settings)
    const localSettings = useSelector(state => state.localReducer.localSettings)
    const mapViewEnabled = useSelector(state => state.localReducer.localSettings.mapViewEnabled)
    const deviceEnabledSetting = serverSettings.deviceEnabled
    const localReducer = useSelector(state => state.localReducer.localSettings)
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const {
        currentMap,
        maps
    } = mapReducer
    const [serverSettingsState, setServerSettingsState] = useState(serverSettings)
    const [localSettingsState, setLocalSettingsState] = useState({})
    const [mapSettingsState, setMapSettingsState] = useState(currentMap)
    const [mirUpdated, setMirUpdated] = useState(false)
    const [devicesEnabled, setDevicesEnabled] = useState(!!deviceEnabledSetting)
    const [selectedTimezone, setSelectedTimezone] = useState({})

    const [confirmUnlock, setConfirmUnlock] = useState(false)
    const [confirmLock, setConfirmLock] = useState(false)
    const [addTaskAlert, setAddTaskAlert] = useState(null);

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

    const handleLockUnlockDashboards = (locked) => {

        Object.values(dashboards).forEach((dashboard) => {
            if (dashboard.name !== "MiR_SIM_2 Dashboard") {
                const newDashboard = {
                    ...dashboard,
                    locked: locked
                }
                dispatchPutDashboard(newDashboard, newDashboard.id)
            }
        })

        if (!locked) {
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                label: "All Dashboards have been successfully unlocked!",
            })
        }
        else {
            setAddTaskAlert({
                type: ADD_TASK_ALERT_TYPE.TASK_ADDED,
                label: "All Dashboards have been successfully locked!",
            })
        }


        return setTimeout(() => setAddTaskAlert(null), 2500)

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
        const serverChange = getIsEquivalent(serverSettingsState, serverSettings)
        const mapChange = !getIsEquivalent(mapSettingsState, currentMap)
        const deviceChange = getIsEquivalent(deviceEnabled, deviceEnabledSetting)


        if(serverSettingsState.id) {
            if (!serverChange) {
                await dispatchPutSettings(serverSettingsState)
            }

            if (!deviceChange) {
                await dispatchDeviceEnabled(devicesEnabled)
                await dispatchPutSettings(serverSettingsState)
            }
        }
        else {
            if (!serverChange) {
                await dispatchPostSettings(serverSettingsState)
            }

            if (!deviceChange) {
                await dispatchDeviceEnabled(devicesEnabled)
                await dispatchPostSettings(serverSettingsState)
            }
        }


        await dispatchGetSettings()
        await dispatchGetStatus()
        await dispatchGetLocalSettings()

        if (!localSettingsState.mapViewEnabled) {
            history.push(`/`)
        }

    }

    const TimeZone = () => {

        return (
            <styled.SettingContainer>


                <styled.SwitchContainerLabel>Select a Timezone</styled.SwitchContainerLabel>


                <styled.RowContainer style={{ borderColor: 'transparent' }}>
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
                            handleUpdateServerSettings({ timezone: values[0] })
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

                <styled.RowContainer style={{ justifyContent: 'start', borderColor: localSettingsState.toggleDevOptions ? "transparent" : "white" }}>
                    <styled.SwitchContainerLabel>Show Developer Settings</styled.SwitchContainerLabel>

                    <styled.ChevronIcon
                        className={!!localSettingsState.toggleDevOptions ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}
                        style={{ color: 'black' }}
                        onClick={() => {
                            handleUpdateLocalSettings({ toggleDevOptions: !localSettingsState.toggleDevOptions })
                        }}
                    />

                </styled.RowContainer>

                {!!localSettingsState.toggleDevOptions ?
                    <>
                        <styled.RowContainer style={{ borderColor: localSettingsState.non_local_api ? "transparent" : "white" }}>

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
                            <styled.RowContainer style={{ marginTop: '0rem' }}>
                                <Textbox
                                    placeholder="Enter a Non Local IP..."
                                    value={!!localSettingsState.non_local_api_ip ? localSettingsState.non_local_api_ip : ""}
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

                <styled.RowContainer style={{ marginTop: '2rem' }}>
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

    const LockUnlockAllDashboards = () => {
        return (
            <styled.SettingContainer>
                <styled.SwitchContainerLabel>Lock or Unlock Dashboards</styled.SwitchContainerLabel>
                <styled.RowContainer>
                    <Button
                        style={{ width: '100%', minHeight: '3rem' }}
                        schema={"settings"}
                        onClick={() => setConfirmUnlock(true)}
                    >Unlock All Dashboards
                </Button>

                    <Button
                        style={{ width: '100%', minHeight: '3rem' }}
                        schema={"settings"}
                        onClick={() => setConfirmLock(true)}
                    >Lock All Dashboards
                </Button>
                </styled.RowContainer>

            </styled.SettingContainer>
        )
    }

    const CurrentMap = () => {

        return (
            <styled.SettingContainer>


                <styled.SwitchContainerLabel>Select a Map</styled.SwitchContainerLabel>


                <styled.RowContainer style={{ borderColor: 'transparent' }}>
                    <DropDownSearch
                        placeholder="Select Map"
                        label="Select the map you would like to use for RMStudio"
                        labelField="name"
                        valueField="id"
                        options={maps}
                        values={!!serverSettingsState ? [Object.values(maps).find(map => map.id === serverSettingsState.currentMapId)] : []}
                        dropdownGap={2}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {
                            // update current map
                            handleUpdateServerSettings({currentMapId: values[0].id})
                        }}
                        className="w-100"
                    />
                </styled.RowContainer>

            </styled.SettingContainer>
        )
    }

    const SignOut = () => {

        const dispatch = useDispatch()
        const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

        const localReducer = useSelector(state => state.localReducer.localSettings)

        const signOut = async () => {

            const poolData = {
                UserPoolId: process.env.REACT_APP_POOL_ID,
                ClientId: process.env.REACT_APP_POOL_CLIENT,
            }

            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
            var cognitoUser = userPool.getCurrentUser();

            cognitoUser.signOut();

            const updatedLocalSettings = {
                ...localReducer,
                authenticated: null,
                refreshToken: null
            }

            dispatchPostLocalSettings(updatedLocalSettings)

            window.location.reload();

        }
        return (
            <styled.SettingContainer style={{ display: 'flex', flexGrow: '1', justifyContent: 'center', alignItems: 'flex-end' }}>

                <Button style={{ height: '2rem', flex: 1 }} onClick={signOut}> Sign Out </Button>

            </styled.SettingContainer>
        )
    }

    return (
        <styled.SettingsContainer>
            <ConfirmDeleteModal
                isOpen={!!confirmLock || !!confirmUnlock}
                title={!!confirmLock ? "Are you sure you want to lock all dashboards?" : "Are you sure you want to unlock all dashboards?"}
                button_1_text={"Yes"}
                button_2_text={"No"}
                handleClose={() => {
                    setConfirmLock(false)
                    setConfirmUnlock(false)
                }}
                handleOnClick1={() => {
                    if (!!confirmLock) {
                        handleLockUnlockDashboards(true)
                    }
                    else {
                        handleLockUnlockDashboards(false)
                    }
                    setConfirmLock(false)
                    setConfirmUnlock(false)

                }}
                handleOnClick2={() => {
                    setConfirmLock(false)
                    setConfirmUnlock(false)
                }}
            />

            <TaskAddedAlert
                containerStyle={{
                    'position': 'absolute'
                }}
                {...addTaskAlert}
                visible={!!addTaskAlert}
            />
            <ContentHeader content={'settings'} mode={'title'} saveEnabled={true} onClickSave={handleSumbitSettings} />
            {MapViewEnabled()}
            {CurrentMap()}
            {TimeZone()}
            {APIAddress()}
            {LockUnlockAllDashboards()}
            {SignOut()}

            {/* {TimeZone()} */}
        </styled.SettingsContainer>
    )
}

export default Settings
