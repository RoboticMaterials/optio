import React, { useEffect } from 'react';

import ClipLoader from "react-spinners/ClipLoader"

import * as styled from './stream_container.style'

const StreamContainer = (props) => {
    const {
        status,
        error,
        myPeerId,
        loading, streams
    } = props


    const getVideoElement = () => {
        return document.getElementById("stream");
    }

    const resetVideo = () => {
        console.log("resetVideo called")
        // Reset the video element and stop showing the last received frame
        var videoElement = getVideoElement();
        if(videoElement) {
            videoElement.pause();
            videoElement.src = "";
            videoElement.load();
        }

    }

    useEffect(() => {
        const vidEle = getVideoElement()
        if(streams && Array.isArray(streams)) {
            if (vidEle.srcObject !== streams[0]) {

                // clean up old stream
                let oldStream = vidEle.srcObject;

                if(oldStream) {
                    let tracks = oldStream.getTracks();
                    tracks.forEach(function(track) {
                        track.stop();
                        track = null
                    });
                    oldStream = null
                }


                // streams.forEach((stream, ind) => {
                //     logger.log("closing stream", stream)
                //     if (stream != undefined) {
                //         if (stream.active) {
                //             stream.getTracks().forEach(function (track) {
                //                 logger.log("closing track", track)
                //
                //                 track.stop();
                //             });
                //             stream = null;
                //         }
                //     }
                // })

                // set new stream
                getVideoElement().srcObject = streams[0];
            }
        } else {


            getVideoElement().srcObject = null
        }
    }, [streams])

    useEffect(() => {
        const interval = setInterval(() => {
            let vidEle = getVideoElement()
            if(vidEle.getVideoPlaybackQuality().droppedVideoFrames > 0) resetVideo()
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return (
        <styled.PlayerWrapper>
            <styled.TextContainer>
                <ClipLoader
                    css={styled.loaderCss}
                    color={'white'}
                    size={50}
                    loading={loading}
                />
                {status &&
                <styled.StatusText>{status}</styled.StatusText>
                }

                {error &&
                <styled.ErrorText>{error}</styled.ErrorText>
                }
            </styled.TextContainer>

            <styled.VideoContainer
                id="stream"
                autoPlay
                playsInline
                muted

            >
                Your browser doesn't support video
            </styled.VideoContainer>
        </styled.PlayerWrapper>
    );
}

export default StreamContainer;
