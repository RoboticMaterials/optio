import React from 'react';

import * as styled from './stream_container.style'

const StreamContainer = () => {

    // Should put a ping here every second to tell the stream that we a still watching and cancel if we are not anymore
    const jsmpeg = require('jsmpeg')
    // const player = new JSMpeg.Player('rtsp://10.1.10.11:8554/ds-test', { canvas: document.getElementById('canvas') })

    return (
        <styled.VideoContainer>
            <p>Stream Container</p>
            <video
                controls
                // autoPlay
                src={{ uri: 'rtsp://10.1.10.11:8554/ds-test' }}
                type="video/mp4; codecs=hevc"

            >
                {/* <source /> */}
            </video>
            <canvas id='canvas'></canvas>
        </styled.VideoContainer>

    )
}

export default StreamContainer