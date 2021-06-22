import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

import { useSelector, useDispatch } from 'react-redux'

import MapApp from './map_app/map_app'
import { deepCopy } from '../../../methods/utils/utils'
import { postSettings } from '../../../redux/actions/settings_actions'

const MapApps = (props) => {

    const {

    } = props;

    const [active, setActive] = useState(false);

    const settings = useSelector(state => state.settingsReducer.settings);

    const dispatch = useDispatch();
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))

    const toggleMapApp = (appName) => {

        const settingsCopy = deepCopy(settings)
        settingsCopy.mapApps[appName] = !settings.mapApps[appName];

        dispatchPostSettings(settingsCopy);
    }


    // handle if the mapApps hasnt been created in settings
    const hasAllKeys = (keys, obj) => keys.every(item => obj.hasOwnProperty(item));
    if (!settings.mapApps || !hasAllKeys(['ratsnest', 'labels', 'heatmap'], settings.mapApps)) {
        const settingsCopy = deepCopy(settings)
        settingsCopy.mapApps = {
            ratsnest: true,
            labels: true,
            heatmap: true,
        }

        dispatchPostSettings(settingsCopy);

        // return null;
    }

    return (
        <>
        <Icon active={active} className="fa fa-ellipsis-v" onClick={() => setActive(!active)}/>
        {active &&
            <>
            <Container style={{background: 'white', opacity: 0.3, height: 110*Object.keys(settings.mapApps).length}}/>
            <Container>
                {Object.keys(settings.mapApps).map(app => (
                    <MapApp appName={app} enabled={settings.mapApps[app]} onClick={() => toggleMapApp(app)} />
                ))}
            </Container>
            </>
        }
        </>
    )

}

const Icon = styled.i`
    position: absolute;
    bottom: 0px;
    right: 0px;

    // transform: ${props => props.active ? 'scaleX(-1)' : 'scaleX(1)'};
    // transition: transform 100ms ease;

    border: none;
    background: ${props => props.active ? 'rgba(240, 240, 255, 0.2)' : 'none'};
    color: ${props => props.theme.bg.octonary};
    text-align: center;

    font-size: 2rem;
    margin: 10px 10px;
    width: 70px;
    height: 70px;
    line-height: 70px;
    border-radius: 35px;

    cursor: pointer;
    &:focus {outline:0;}

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 3rem;
    }

    &:hover {
        background: rgba(240, 240, 255, 0.3);
    }

`

const Container = styled.div`
    position: absolute;
    bottom: 90px;
    right: 10px;
    display: flex;
    flex-direction: column-reverse;

    width: 110px;
    border-radius: 10px;
`

export default MapApps;