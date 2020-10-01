import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import * as styled from './viewer_page.style'

// Import components
import ButtonGroup from '../../../basic/button_group/button_group'
import BounceButton from '../../../basic/bounce_button/bounce_button'

import StreamContainer from './stream_container/stream_container'

const ViewerPage = () => {

    const locaitons = useSelector(state => state.locationsReducer.locations)
    const devices = useSelector(state => state.devicesReducer.devices)

    const [streamConnected, setStreamConnected] = useState(true)

    const params = useParams()

    // Set the station and device if there is a associated device
    const station = locaitons[params.stationID]
    let device = {}
    if(!!station.device_id) device = devices[station.device_id]

    useEffect(() => {
        return () => {
            // Disconnect Stream on unmount
        }
    }, [])

    const handleStreamConnect = () => {

        // TODO: This is where the logic to connect to the stream will go
        // Once connection is established set stream connected to true

        setStreamConnected(!streamConnected)
    }

    return (
        <styled.PageContainer>
            <styled.ConnectContainer>
                <styled.ConnectText>{!!device ? `Connect to ${device.device_name}'s stream` : 'Connect to Stream'}</styled.ConnectText>
                <BounceButton color={'blue'} width={'10rem'} onClick={handleStreamConnect}>{!streamConnected ? 'Connect' : 'Disconnect'}</BounceButton>
            </styled.ConnectContainer>

            {streamConnected &&
                <StreamContainer />
            }
        </styled.PageContainer>
    )
}

export default ViewerPage