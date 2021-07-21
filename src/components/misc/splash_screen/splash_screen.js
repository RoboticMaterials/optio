// import external dependencies
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// components
import Switch from 'react-ios-switch'
import Textbox from '../../basic/textbox/textbox'
import Button from '../../basic/button/button'
import { ReactComponent as OptioLogo } from '../../../graphics/icons/optio.svg'

// styles
import * as styled from "./splash_screen.style"

// import logger
import logger from '../../../logger.js';
import { postLocalSettings, getLocalSettings } from "../../../redux/actions/local_actions";



const ToggleMapViewSwitch = (props) => {
    const {
        checked,
        onChange,
        switchContainerStyle
    } = props

    return (
        <styled.SwitchContainer style={switchContainerStyle}>
            <styled.SwitchContainerLabel>Show List View</styled.SwitchContainerLabel>
            <Switch
                checked={checked}
                onChange={onChange}
                style={{ margin: "0 2rem 0 2rem" }}
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
    const localSettings = useSelector(state => state.localReducer.localSettings)
    const apiAddress = localSettings.non_local_api_ip

    const [apiIpAddress, setApiIpAddress] = useState(apiAddress)
    const [localSettingsState, setLocalSettingsState] = useState({})

    const dispatchPostLocalSettings = (settings) => dispatch(postLocalSettings(settings))
    const dispatchGetLocalSettings = () => dispatch(getLocalSettings())

    useEffect(() => {
      setLocalSettingsState(localSettings)
    }, [])
    /**
     * Submit API address to local storage
     */
    const handleSubmitApiIpAddress = async () => {
        console.log("submitting")

        const localSettingsPromise = dispatchGetLocalSettings()
        localSettingsPromise.then(response =>{
          dispatchPostLocalSettings({
              ...response,
              non_local_api_ip: apiIpAddress,
              non_local_api: true,
          })
        })

        //window.location.reload(false);
    }

    /*
    * toggle mapViewEnabled
    * */
    const toggleMapViewEnabled = async () => {
        const updatedLocalSettings = {
          ...localSettingsState,
          mapViewEnabled: !localSettingsState.mapViewEnabled,
        }
        await dispatchPostLocalSettings(updatedLocalSettings)
    }

    return (
        <>
            {/* When loading show an Optio logo, if no api info, then show input to enter */}
            {!isApiLoaded ? apiError ?
                <div style={{ width: '100%', height: '100%', paddingTop: '15%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <div style={{height: '15rem', overflow: 'hidden'}}>
                        <OptioLogo preserveAspectRatio="xMinYMid meet" height="100%" width="100%"/>
                    </div>

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
                            <Button schema={'scheduler'} style={{ color: 'red', border: '0.1rem solid red' }} type='submit'>Submit</Button>
                        </form>



                        <ToggleMapViewSwitch
                            switchContainerStyle={{
                                bottom: "1rem",
                                transform: "translateY(-50%)",
                                position: "absolute"
                            }}
                            checked={localSettingsState.mapViewEnabled}
                            onChange={toggleMapViewEnabled}
                        />
                    </div>
                </div>

                :
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: "column" }}>
                    <div style={{height: '15rem', overflow: 'hidden'}}>
                        <OptioLogo preserveAspectRatio="xMinYMid meet" height="100%" width="100%"/>
                    </div>

                    {/* <ToggleMapViewSwitch
                        checked={localSettings.localSettings.mapViewEnabled}
                        onChange={toggleMapViewEnabled}
                    /> */}

                </div>
                :
                <>
                </>
            }
        </>
    )
}

export default SplashScreen;
