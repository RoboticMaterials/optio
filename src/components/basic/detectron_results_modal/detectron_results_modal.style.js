import styled from "styled-components";
import Modal from "react-modal";
import { css } from "styled-components";

const sharedButtonStyle = css`
  outline: none !important;
  outline-offset: none !important;
  align-self: center;
  font-size: 1.5rem;
  position: relative;
  text-align: center;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
`;

export const Container = styled(Modal)`
  outline: none !important;
  outline-offset: none !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  right: auto;
  bottom: auto;

  position: absolute;

  background: ${(props) => props.theme.bg.primary};
  border-width: thin;
  border-radius: 0.5em;
  border-color: ${(props) => props.theme.bg.quarternary};
  border-style: solid;
  padding: 2rem;
  z-index: 20;
`;

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-width: 0;
  border-bottom-width: thin;
  border-color: black;
  border-style: solid;
  margin-bottom: 2rem;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.sz3};
  font-family: ${(props) => props.theme.font.primary};
  font-weight: bold;
`;

export const TextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

export const TextMain = styled.h4`
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.sz3};
  font-family: ${(props) => props.theme.font.primary};
  font-weight: 500;
`;

export const Caption = styled.h5`
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.sz4};
  font-family: ${(props) => props.theme.font.primary};
  font-weight: 400;
  font-style: italic;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const Icon = styled.i`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto auto;
  color: green;
  fill: green;
  font-size: 7rem;
  width: 14rem;
  &:hover {
    cursor: pointer;
  }

  &:active {
    filter: brightness(85%);
  }
`;
