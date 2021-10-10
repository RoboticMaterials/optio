import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TimezoneSelect from 'react-timezone-select'

// Import Components
import Textbox from '../../../basic/textbox/textbox'
import Switch from 'react-ios-switch';
import TimezonePicker, { timezones } from 'react-timezone';
import Button from "../../../basic/button/button";
import DropDownSearch from "../../../basic/drop_down_search_v2/drop_down_search";
import ContentHeader from '../content_header/content_header'
import ConfirmDeleteModal from '../../../basic/modals/confirm_delete_modal/confirm_delete_modal'
import TaskAddedAlert from "../../../widgets/widget_pages/dashboards_page/dashboard_screen/task_added_alert/task_added_alert";
import ShiftSettings from './shift_settings/shift_settings'

// Import Constants
import { ADD_TASK_ALERT_TYPE } from "../../../../constants/dashboard_constants";
import { Timezones } from '../../../../constants/timezone_constants'

import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

// Import Styles
import * as styled from './settings.style'
import { ThemeContext } from 'styled-components';


// Import Actions
import { postSettings, getSettings } from '../../../../redux/actions/settings_actions'
import { postLocalSettings, getLocalSettings } from '../../../../redux/actions/local_actions'
import { putDashboard } from '../../../../redux/actions/dashboards_actions'


import { deviceEnabled } from '../../../../redux/actions/settings_actions'
import { getStatus } from '../../../../redux/actions/status_actions'
import { setCurrentMap } from '../../../../redux/actions/map_actions'

// Import Utils
import { getIsEquivalent } from '../../../../methods/utils/utils'
import config from '../../../../settings/config'
import { useHistory } from "react-router-dom";

export const Durations = [...Array(10).keys()].map(num => ({label: num, value: num*1000}))


const Settings = () => {

    const history = useHistory()

    const dispatch = useDispatch()
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))
    const dispatchGetSettings = () => dispatch(getSettings())
    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = () => dispatch(getLocalSettings())
    const dispatchPutDashboard = (dashboard, id) => dispatch(putDashboard(dashboard, id))
    const dispatchGetStatus = () => dispatch(getStatus())
    const dispatchDeviceEnabled = (bool) => dispatch(deviceEnabled(bool))
    const dispatchSetCurrentMap = (mapID) => dispatch(setCurrentMap(mapID))

    const mapReducer = useSelector(state => state.mapReducer)
    const serverSettings = useSelector(state => state.settingsReducer.settings)
    const localSettings = useSelector(state => state.localReducer.localSettings)
    const deviceEnabledSetting = serverSettings.deviceEnabled
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const {
        currentMap,
        maps
    } = mapReducer

    const [serverSettingsState, setServerSettingsState] = useState(serverSettings)
    const [emailSettingsState, setEmailSettingsState] = useState(serverSettings.emailNotifications)
    const [localSettingsState, setLocalSettingsState] = useState({})
    const [mapSettingsState, setMapSettingsState] = useState(currentMap)
    const [devicesEnabled, setDevicesEnabled] = useState(!!deviceEnabledSetting)
    const [showShiftSettings, setShowShiftSettings] = useState(false)
    const [confirmUnlock, setConfirmUnlock] = useState(false)
    const [confirmLock, setConfirmLock] = useState(false)
    const [addTaskAlert, setAddTaskAlert] = useState(null)
    const [saveDisabled, setSaveDisabled] = useState(true)

    const themeContext = useContext(ThemeContext);


    /**
     *  Sets current settings to state so that changes can be discarded or saved
     * */
    useEffect(() => {
      var {
        _id,
        ...remainingServerSettings
      } = serverSettings

      var {
        _id,
        ...remainingServerSettingsState
      } = serverSettingsState

      const serverChange = !getIsEquivalent(remainingServerSettingsState, remainingServerSettings)
      const mapChange = !getIsEquivalent(mapSettingsState, currentMap)
      const localChange = !getIsEquivalent(localSettingsState, localSettings)


      if(!!serverChange || !!mapChange || !!localChange){
        setSaveDisabled(false)
      }

      else setSaveDisabled(true)

    }, [serverSettingsState, mapSettingsState, localSettingsState])

    useEffect(() => {
        setServerSettingsState(serverSettings)
        setEmailSettingsState(serverSettings.emailNotifications)
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
     * Handles updating settings on the server        const serverChange = getIsEquivalent(serverSettingsState, serverSettings)
        const mapChange = !getIsEquivalent(mapSettingsState, currentMap)
        const deviceChange = getIsEquivalent(deviceEnabled, deviceEnabledSetting)
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
        const serverChange = getIsEquivalent(serverSettingsState, serverSettings)
        const mapChange = !getIsEquivalent(mapSettingsState, currentMap)
        const deviceChange = getIsEquivalent(deviceEnabled, deviceEnabledSetting)
    const handleLockUnlockDashboards = (locked) => {

        Object.values(dashboards).forEach((dashboard) => {
            if (dashboard.name !== "MiR_SIM_2 Dashboard") {
                const newDashboard = {
                    ...dashboard,
                    locked: locked
                }
                dispatchPutDashboard(newDashboard, newDashboard._id?.$oid)
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

        if (!serverChange) {
            delete serverSettingsState._id
            await dispatchPostSettings(serverSettingsState)
        }

        if (!deviceChange) {
            await dispatchDeviceEnabled(devicesEnabled)
            await dispatchPostSettings(serverSettingsState)
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
                <styled.DropdownContainer>
                    <styled.DropdownLabel>Timezone</styled.DropdownLabel>
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
                </styled.DropdownContainer>
        )
    }

    const dashboardSettings = () => {
        return (
            <>
                <styled.SwitchContainer>
                    <styled.SwitchLabel style={{marginRight:'0rem'}}>Track Users</styled.SwitchLabel>
                    <Switch
                        checked={!!serverSettingsState.trackUsers ? serverSettingsState.trackUsers : false}
                        onChange={() => {
                            setServerSettingsState({
                                ...serverSettingsState,
                                trackUsers: !serverSettingsState?.trackUsers || false
                            })
                        }}
                        onColor={themeContext.schema.settings.solid}
                        style={{ marginRight: '1rem', minWidth:'3rem' }}
                    />
                </styled.SwitchContainer>

                <styled.SwitchContainer>
                    <styled.SwitchLabel style={{marginRight:'0rem'}}>Hide Filters on Mobile</styled.SwitchLabel>
                    <Switch
                        checked={!!serverSettingsState.hideFilterSortDashboards ? serverSettingsState.hideFilterSortDashboards : false}
                        onChange={() => {
                            setServerSettingsState({
                                ...serverSettingsState,
                                hideFilterSortDashboards: !serverSettingsState.hideFilterSortDashboards
                            })
                        }}
                        onColor={themeContext.schema.settings.solid}
                        style={{ marginRight: '1rem', minWidth:'3rem' }}
                    />
                </styled.SwitchContainer>

                <styled.SwitchContainer>
                    <styled.SwitchLabel style={{marginRight:'0rem'}}>Advanced Search Filters</styled.SwitchLabel>
                    <Switch
                        checked={!!serverSettingsState.enableMultipleLotFilters ? serverSettingsState.enableMultipleLotFilters : false}
                        onChange={() => {
                            setServerSettingsState({
                                ...serverSettingsState,
                                enableMultipleLotFilters: !serverSettingsState.enableMultipleLotFilters
                            })
                        }}
                        onColor={themeContext.schema.settings.solid}
                        style={{ marginRight: '1rem', minWidth:'3rem' }}
                    />
                </styled.SwitchContainer>

                <styled.SwitchContainer>
                    <styled.SwitchLabel style={{marginRight:'0rem'}}>Custom Lot Display</styled.SwitchLabel>
                    <Switch
                        checked={!!serverSettingsState.stationBasedLots ? serverSettingsState.stationBasedLots : false}
                        onChange={() => {
                            setServerSettingsState({
                                ...serverSettingsState,
                                stationBasedLots: !serverSettingsState.stationBasedLots
                            })
                        }}
                        onColor={themeContext.schema.settings.solid}
                        style={{ marginRight: '1rem', minWidth:'3rem' }}
                    />
                </styled.SwitchContainer>
            </>
        )
    }

    const advancedSettings = () => {
        //  if(MiRMapEnabled){
        return (
            <styled.SettingContainer>

                <styled.RowContainer style={{ justifyContent: 'space-between', width: '100%', alignSelf: 'start', borderColor: localSettingsState.toggleDevOptions ? "transparent" : "white" }}>
                    <styled.SwitchLabel>Show Developer Settings</styled.SwitchLabel>

                    <styled.ChevronIcon
                        className={!!localSettingsState.toggleDevOptions ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}
                        style={{ color: 'black' }}
                        onClick={() => {
                            handleUpdateLocalSettings({ toggleDevOptions: !localSettingsState.toggleDevOptions })
                        }}
                    />

                </styled.RowContainer>

                {!!localSettingsState.toggleDevOptions  &&
                    <>
                        <styled.SwitchContainer>
                            <styled.SwitchLabel>Enable Non Local API</styled.SwitchLabel>
                            <Switch
                                checked={localSettingsState.non_local_api}
                                onChange={() => {
                                    handleUpdateLocalSettings({ non_local_api: !localSettingsState.non_local_api })
                                }}
                                onColor={themeContext.schema.settings.solid}
                                style={{ marginRight: '1rem' }}
                            />
                        </styled.SwitchContainer>

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



                    </>
                }

            </styled.SettingContainer>
        )
        //  }Choose a Map
    }


    const MapViewEnabled = () => {
        return (
            <styled.SwitchContainer>
                <styled.SwitchLabel>Enable Map View</styled.SwitchLabel>
                <Switch
                    onColor={themeContext.schema.settings.solid}
                    checked={!!localSettingsState.mapViewEnabled}
                    onChange={() => {
                        handleUpdateLocalSettings({ mapViewEnabled: !localSettingsState.mapViewEnabled })
                    }}
                />

            </styled.SwitchContainer>
        )
    }

    const LockUnlockAllDashboards = () => {
        return (
            <styled.SettingContainer>
                <styled.RowContainer>
                    {/* <styled.IconContainer>
                        <styled.LockUnlockIcon className="fas fa-unlock" onClick={() => setConfirmUnlock(true)}/>
                    </styled.IconContainer>
                    <styled.IconContainer>
                        <styled.LockUnlockIcon className="fas fa-lock" onClick={() => setConfirmLock(true)}/>
                    </styled.IconContainer> */}
                    <Button
                        style={{ width: '100%', minHeight: '2rem', fontSize: '1.2rem', lineHeight: '1.5rem', padding: '0.3rem 1rem' }}
                        schema={"settings"}
                        onClick={() => setConfirmUnlock(true)}
                    >Unlock All Dashboards
                    </Button>

                    <Button
                        style={{ width: '100%', minHeight: '2rem', fontSize: '1.2rem', lineHeight: '1.5rem', padding: '0.3rem 1rem' }}
                        schema={"settings"}
                        onClick={() => setConfirmLock(true)}
                    >Lock All Dashboards
                    </Button>
                </styled.RowContainer>

            </styled.SettingContainer>
        )
    }

    const EmailAddress = () => {
        return (
            <>
                <styled.SwitchContainer>
                    <styled.SwitchLabel>Email Notifications </styled.SwitchLabel>
                    <Switch
                        checked={!!serverSettingsState.emailEnabled ? serverSettingsState.emailEnabled : false}
                        onChange={() => {
                            setServerSettingsState({
                                ...serverSettingsState,
                                emailEnabled: !serverSettingsState.emailEnabled
                            })
                        }}
                        onColor={themeContext.schema.settings.solid}
                        style={{ marginRight: '1rem', minWidth:'3rem' }}
                    />
                </styled.SwitchContainer>
                {!!serverSettingsState.emailEnabled &&
                    <>
                    <styled.DropdownContainer>
                        <styled.DropdownLabel>Contact Name</styled.DropdownLabel>
                        <Textbox
                            placeholder="Enter a contact name..."
                            value={!!serverSettingsState.emailName ? serverSettingsState.emailName : ""}
                            onChange={(event) => {
                                handleUpdateServerSettings({ emailName: event.target.value })
                            }}
                            style={{ width: '100%' }}
                        />
                    </styled.DropdownContainer>

                    <styled.DropdownContainer>
                        <styled.DropdownLabel>Email Address</styled.DropdownLabel>
                        <Textbox
                            placeholder="Enter an email address..."
                            value={!!serverSettingsState.emailAddress ? serverSettingsState.emailAddress : ""}
                            onChange={(event) => {
                                handleUpdateServerSettings({ emailAddress: event.target.value })
                            }}
                            style={{ width: '100%' }}
                        />
                    </styled.DropdownContainer>
                    </>
                }

            </>
        )
    }



    const CurrentMap = () => {


        return (
                <styled.DropdownContainer>
                    <styled.DropdownLabel>Map</styled.DropdownLabel>
                    <DropDownSearch
                        placeholder="Select Map"
                        label="Select the map you would like to use for RMStudio"
                        labelField="name"
                        valueField="_id"
                        options={maps}
                        values={[Object.values(maps).find((map,ind) => {
                            if (!!localSettingsState && !!localSettingsState.currentMapId && !!maps.find(map => map._id === localSettingsState.currentMapId)) {
                                return map._id === localSettingsState.currentMapId
                            }
                            else return ind===0
                        })]}
                        dropdownGap={2}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {
                            // update current map
                            handleUpdateLocalSettings({ currentMapId: values[0]._id })
                        }}
                        className="w-100"
                    />

                </styled.DropdownContainer>
        )
    }

    const renderShiftSettings = () => {
        return (
            <>

                <styled.RowContainer style={{ justifyContent: 'space-between', width: '100%', alignSelf: 'start', marginBottom: '.5rem' }}>
                    <styled.DropdownLabel style={{paddingLeft: '0.5rem'}}>Show Shift Settings</styled.DropdownLabel>
                    <styled.ChevronIcon
                        className={!!showShiftSettings ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}
                        style={{ color: 'black' }}
                        onClick={() => {
                            setShowShiftSettings(!showShiftSettings)
                        }}
                    />

                </styled.RowContainer>
                {!!showShiftSettings &&
                    <styled.ShiftSettingsContainer>
                        <ShiftSettings
                            themeContext={themeContext}
                            enableOutput={false}
                        />
                    </styled.ShiftSettingsContainer>
                }
            </>
        )
    }

    const renderAlertDurationSetting = () => {
        return (
            <styled.DropdownContainer>
                <styled.DropdownLabel>Move Alert Duration</styled.DropdownLabel>
                <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                    <DropDownSearch
                        placeholder="(s)"
                        labelField="label"
                        valueField="value"
                        label="(secs)"
                        options={Durations}
                        values={!!serverSettingsState.moveAlertDuration ? [Durations.find(d => d.value === serverSettingsState.moveAlertDuration)] : []}
                        dropdownGap={0}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {
                            console.log('dffff', values)
                            handleUpdateServerSettings({ moveAlertDuration: values[0].value })
                        }}
                        style={{width: '3.5rem', alignSelf: 'flex-end'}}
                    />
                </div>
            </styled.DropdownContainer>
    )
    }


    const SignOut = () => {

        const dispatch = useDispatch()
        const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

        const localReducer = useSelector(state => state.localReducer.localSettings)

        const signOut = async () => {

            var poolData = {
                UserPoolId: config.UserPoolId,
                ClientId: config.ClientId,
            };

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

                {config.authenticationNeeded && <Button schema={'settings'} style={{ height: '2rem', flex: 1 }} onClick={signOut}> Sign Out </Button>}

            </styled.SettingContainer>
        )
    }

    return (
        <>
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
        <styled.SettingsContainer>

            <ContentHeader content={'settings'} mode={'title'} saveEnabled={true} disabled = {saveDisabled} onClickSave={handleSumbitSettings} />

            <styled.Label>Map Settings</styled.Label>
            {MapViewEnabled()}
            {CurrentMap()}

            <styled.Label>General Settings</styled.Label>
            {TimeZone()}
            {EmailAddress()}
            {renderAlertDurationSetting()}
            {renderShiftSettings()}


            <styled.Label>Dashboard Settings</styled.Label>
            {dashboardSettings()}
            {LockUnlockAllDashboards()}

            {advancedSettings()}

            {SignOut()}


            {/* {TimeZone()} */}
        </styled.SettingsContainer>

        </>
    )
}

export default Settings
