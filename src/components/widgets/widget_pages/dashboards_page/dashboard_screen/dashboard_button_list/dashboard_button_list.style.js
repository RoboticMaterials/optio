import styled from "styled-components";
import { css } from "styled-components";

export const Container = styled.ul`
  // fill entire container
  width: 90%;
  max-width: 90%;
  max-height: 100%;
  height: 100%;
  z-index: 15;
  align-self: center;
  align-items: center;
  margin: 0;
  padding: 0;

  // allow scroll
  overflow: auto;

  // hide scroll bar
  ::-webkit-scrollbar {
    width: 0px; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  ::-webkit-scrollbar-thumb {
    background: #ff0000;
  }
`;

export const ListContainer = styled.div`
  // full entire container
  width: 100%;
  max-height: calc(100% - 8rem);

  // flex layout
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

// overwrite dashboard button container style
export const ButtonContainerCss = css`
  // large screen style

  @media (min-width: ${(props) => props.theme.widthBreakpoint.mobileL}) {
    width: 100%;
    max-width: 100%;
  }

  @media (min-width: ${(props) => props.theme.widthBreakpoint.tablet}) {
    width: 45%;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
`;
