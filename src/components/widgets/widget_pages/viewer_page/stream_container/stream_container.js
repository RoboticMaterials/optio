import React from 'react';

import * as styled from './stream_container.style'

const StreamContainer = () => {

    // Should put a ping here every second to tell the stream that we a still watching and cancel if we are not anymore
    const jsmpeg = require('jsmpeg')

    const url = 'rtsp://10.1.10.11:8554/ds-test'

    const canvas = document.getElementById('video-canvas')

    const player = new jsmpeg(url, { canvas: canvas, autoplay: true, loop: true })

    // const client = new WebSocket('rtsp://10.1.10.11:8554/ds-test')
    // const player = new jsmpeg(client, { canvas: document.getElementById('canvas') })

    player.play();

    return (
        <styled.VideoContainer>
            <p>Stream Container</p>
            {/* <video
                controls
                // autoPlay
                src={{ uri: 'rtsp://10.1.10.11:8554/ds-test' }}
                type="video/mp4; codecs=hevc"

            >
            </video> */}
            <canvas id='video-canvas'></canvas>
        </styled.VideoContainer>

    )
}

export default StreamContainer