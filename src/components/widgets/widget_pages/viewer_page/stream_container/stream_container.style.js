import styled, { css } from 'styled-components';


export const VideoContainer = styled.video`
    //z-index: 500;
    //background: red;

    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`

export const PlayerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: black;
   /* Player ratio: 100 / (1280 / 720) */
  //padding-top: 56.25%;
  //max-height: 20rem;


`

export const TextContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

`

export const loaderCss = css`
  z-index: 2000;
  display: block;
  margin: 0 auto;
  //color: pink;
  //border-color: red;


`

const textStyle = css`

  //color: red;

`


export const ErrorText = styled.div`
  ${textStyle};
  color: red;

`

export const StatusText = styled.div`
  ${textStyle};
  color: white;

`
