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
            <g>
                {appIcons[appName](enabled)}
            </g>
            <p3 style={{color: enabled ? 'black' : 'grey'}}>{appName}</p3>
        </AppContainer>
    )

}

const AppContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    margin: 10px;

    border-radius: 10px;

    &:hover {
        background: rgba(240, 240, 255, 0.3);
    }
`

export default MapApp;