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
    if (!settings.mapApps) {
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
        <Icon active={active} className="fa fa-chevron-up" onClick={() => setActive(!active)}/>
        {active &&
            <>
            <Container style={{background: 'white', opacity: 0.3, width: 110*Object.keys(settings.mapApps).length}}/>
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
    bottom: 0;
    right: 1rem;

    transform: ${props => props.active ? 'scaleY(-1)' : 'scaleY(1)'};
    transition: transform 100ms ease;

    border: none;
    background: none;
    color: ${props => props.theme.bg.octonary};
    text-align: center;

    font-size: 3rem;
    margin: 20px;
    width: 70px;

    cursor: pointer;
    &:focus {outline:0;}

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 3rem;
    }

`

const Container = styled.div`
    position: absolute;
    right: 1rem;
    bottom: 70px;
    display: flex;
    flex-direction: row;

    height: 110px;
    border-radius: 10px;
`

export default MapApps;