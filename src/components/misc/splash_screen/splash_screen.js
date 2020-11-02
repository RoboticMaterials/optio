// import external dependencies
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

// components
import Switch from 'react-ios-switch'
import Textbox from '../../basic/textbox/textbox'
import Button from '../../basic/button/button'

// styles
import * as styled from "./splash_screen.style"

// import logger
import logger from '../../../logger.js';
import {postLocalSettings} from "../../../redux/actions/local_actions";


const ToggleMapViewSwitch = (props) => {
    const {
        checked,
        onChange
    } = props

    return(
        <styled.SwitchContainer>
            <styled.SwitchContainerLabel>Show List View</styled.SwitchContainerLabel>
            <Switch
                checked={checked}
                onChange={onChange}
                style={{margin: "0 2rem 0 2rem"}}
            />
            <styled.SwitchContainerLabel>Show Map View</styled.SwitchContainerLabel>
        </styled.SwitchContainer>
    )
}

const SplashScreen = (props) => {
    const {
        isApiLoaded,
        apiError
    } = props

    const dispatch = useDispatch()
    const localSettings = useSelector(state => state.localReducer)
    const [apiIpAddress, setApiIpAddress] = useState('')
    const onPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))

    /**
     * Submit API address to local storage
     */
    const handleSubmitApiIpAddress = async () => {
        await onPostLocalSettings({ non_local_api: true, non_local_api_ip: apiIpAddress })
        window.location.reload(false);
    }

    /*
    * toggle mapViewEnabled
    * */
    const toggleMapViewEnabled = async () => {
        await onPostLocalSettings({ ...localSettings.localSettings, mapViewEnabled: !localSettings.localSettings.mapViewEnabled })
    }

    return (
        <>
            {/* When loading show an RM logo, if no api info, then show input to enter */}
            {!isApiLoaded ? apiError ?
                <div style={{ width: '100%', height: '100%', paddingTop: '15%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <i className={'icon-rmLogo'} style={{ fontSize: '10rem', marginBottom: '5rem', color: '#FF4B4B' }} />

                    <div style={{ width: '50%', minWidth: '20rem', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        < p > Please Enter API IP</p>
                        <form onSubmit={handleSubmitApiIpAddress}>
                            <Textbox
                                placeholder="API IP Address"
                                onChange={(event) => {
                                    setApiIpAddress(event.target.value)
                                }}
                                style={{ width: '100%' }}
                                // type = 'submit'
                            />
                        </form>
                        <ToggleMapViewSwitch
                            checked={localSettings.localSettings.mapViewEnabled}
                            onChange={toggleMapViewEnabled}
                        />
                        <Button schema={'scheduler'} style={{ color: 'red', border: '0.1rem solid red' }} type='submit'>Submit</Button>
                    </div>
                </div>

                :
                <div style={{ width: '100%', height: '100%',  display: 'flex', justifyContent: 'center', alignItems:"center", flexDirection: "column" }}>
                    <i className={'icon-rmLogo'} style={{ fontSize: '10rem', margin: "3rem", color: '#FF4B4B' }} />

                    <ToggleMapViewSwitch
                        checked={localSettings.localSettings.mapViewEnabled}
                        onChange={toggleMapViewEnabled}
                    />

                </div>
                :
                <>
                </>
            }
        </>
    )
}

export default SplashScreen;
