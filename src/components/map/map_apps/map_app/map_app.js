import React from 'react';
import styled from 'styled-components'

import appIcons from './map_app_icons'

const MapApp = (props) => {

    const {
        appName,
        enabled,
        onClick
    } = props;

    return (
        <AppContainer onClick={onClick}>
            <g style={{height: 50, width: 50, alignItems: 'center'}}>
                {appIcons[appName](enabled)}
            </g>
            <p3 style={{color: enabled ? 'black' : 'grey', height: 20, width: 70, textAlign: 'center'}}>{appName}</p3>
        </AppContainer>
    )

}

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    margin: 10px;

    justify-content: center;
    align-content: center;

    border-radius: 10px;

    &:hover {
        background: rgba(240, 240, 255, 0.3);
    }
`

export default MapApp;