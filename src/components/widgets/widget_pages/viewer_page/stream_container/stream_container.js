import React, { useState, useEffect } from 'react';

import ClipLoader from "react-spinners/ClipLoader"

import * as styled from './stream_container.style'




const StreamContainer = (props) => {
  const {
    status,
    error,
    myPeerId,
    resetVideo,
    loading
  } = props


  return (

        <styled.PlayerWrapper>

        <styled.TextContainer>
        
        <ClipLoader
            css={styled.loaderCss}
            color={'white'}
            size={50}
            loading={loading}
        />
        {/*status &&
          <styled.StatusText>{status}</styled.StatusText>
        */}

        {error &&
          <styled.ErrorText>{error}</styled.ErrorText>
        }

        </styled.TextContainer>




            <styled.VideoContainer
                id="stream"
                autoPlay
                playsInline

            >
                Your browser doesn't support video
            </styled.VideoContainer>
        </styled.PlayerWrapper>

  );
}

export default StreamContainer;
