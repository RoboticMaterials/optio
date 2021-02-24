import styled from "styled-components";

import { globStyle } from "../../global_style";
import {
  hexToRGBA,
  LightenDarkenColor,
  RGB_Linear_Shade,
} from "../../methods/utils/color_utils";

export const StatusHeader = styled.div`
  position: fixed;
  width: 100%;
  height: 4rem;

  display: flex;
  flex-direction: row;
  pointer-events: none;

  z-index: 2;
`;

export const LeftContentContainer = styled.div`
  flex-grow: 1;
  z-index: 2;
  margin-left: 4.5rem;
  pointer-events: auto;

  display: flex;
`;

export const RightContentContainer = styled.div`
  flex-grow: 1;
  z-index: 2;
  pointer-events: auto;

  display: flex;
  align-items: right;
  justify-content: flex-end;
`;

// logo
// ************************************
// ************************************
export const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${(props) =>
    props.windowWidth > props.widthBreakPoint ? "1rem" : ".4rem"};
`;

export const LogoIcon = styled.i`
  font-size: 2.5rem;
  margin-top: -0.5rem;
  margin-right: 0.1rem;
  color: ${(props) => props.theme.fg.secondary};
`;

export const LogoSubtitle = styled.h2`
  color: ${(props) => props.theme.bg.senary};
  font-family: "Montserrat";
  font-size: ${(props) => props.theme.fontSize.sz4};
  font-weight: 600;
  margin: 0;
  margin-bottom: -2rem;
  padding: 0;
`;

// ************************************
// ************************************

// play button
// ************************************
// ************************************
export const PlayButton = styled.button`
  //color:  ${(props) => (props.play ? props.theme.good : props.theme.bad)};
  background: transparent;
  // border: 0.2rem solid ${(props) =>
    props.play ? props.theme.good : props.theme.bad};
  border: none;
  border-radius: 0.3rem;
  height: 4rem;
  padding: 0.25rem;
  outline: none !important;
  outlineoffset: none !important;
  &:hover {
    color: ${(props) =>
      props.play
        ? RGB_Linear_Shade(0.3, props.theme.good)
        : RGB_Linear_Shade(0.3, props.theme.bad)};
    border-color: ${(props) =>
      props.play
        ? RGB_Linear_Shade(0.3, props.theme.good)
        : RGB_Linear_Shade(0.3, props.theme.bad)};
  }

  margin-right: 1.5rem;
  margin-left: 0;

  @media (max-width: ${(props) => props.theme.widthBreakpoint.tablet}) {
    margin-right: 1rem;
  }
`;

export const PlayButtonIcon = styled.i`
  color: ${(props) => (props.play ? props.theme.good : props.theme.bad)};
  font-size: 2rem;
  // outline: 'none !important',
  // outlineOffset: 'none !important',
  line-height: 1.7rem;
  text-align: center;
  &:hover {
    color: ${(props) =>
      props.play
        ? RGB_Linear_Shade(0.3, props.theme.good)
        : RGB_Linear_Shade(0.3, props.theme.bad)};
  }
`;

// ************************************
// ************************************

// Notifications
// ************************************
// ************************************

export const NotificationIcon = styled.i`
  font-size: 2.2rem;
  /* font-size: ${(props) => props.theme.fontSize.sz3}; */
  color: ${(props) => props.theme.fg.primary};
  margin-left: 0.2rem;
  margin-right: 0.2rem;
  margin-bottom: 0.4rem;
`;

export const RightMenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 3.6rem;
  height: 3.2rem;
  margin-top: 0.4rem;

  border-radius: 0.5rem;
  // border: .2em solid;
  // border-color: ${(props) => props.theme.fg.primary};

  &:hover {
    cursor: pointer;
  }

  ${(props) =>
    props.checked &&
    `
        box-shadow: inset 2px 2px 4px 0px rgba(0, 0, 0, 0.25), inset -2px -2px 3px 0px rgba(255, 255, 255, 0.6);
        background: rgba(0,0,0,0.01);
    `}

  margin-left: 0;
  margin-right: 2rem;

  @media (max-width: ${(props) => props.theme.widthBreakpoint.tablet}) {
    margin-right: 1rem;
  }
`;

export const NotificationText = styled.p`
  height: 1.4rem;
  width: 1.4rem;
  user-select: none;

  position: absolute;
  transform: translate(0.9rem, 0.6rem);

  background-color: ${(props) => props.theme.bg.septenary};
  border: 0.1rem solid ${(props) => props.theme.fg.primary};
  border-radius: 0.7rem;

  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.fg.primary};
  margin: 0;
  padding: 0;

  line-height: 1.4rem;
  text-align: center;
`;
