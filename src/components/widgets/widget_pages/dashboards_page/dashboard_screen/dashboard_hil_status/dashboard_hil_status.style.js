import styled from "styled-components";
import * as style from "../../dashboard_list/DashboardsList.style.js";

export const AddContainer = styled(style.AddContainer)``;

export const HilContainer = styled.div`
  position: absolute;
  right: 1rem;
  top: 0.5rem;
  left: 1rem;
  bottom: 2rem;

  z-index: 100;
  border-radius: 1rem;
  box-shadow: 0 0.2rem 0.4rem 0rem #303030;
  display: column;
  /* flex-flow: row; */
  background-color: white;

  @media (max-width: ${(props) => props.theme.widthBreakpoint.tablet}) {
    left: 0.5rem;
    right: 0.5rem;
  }
`;

export const HilInputContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const HilInput = styled.input`
  margin: 1rem 1rem;
  border-radius: 0.5rem;
  text-align: center;
  width: 10rem;
  font-size: 2rem;
  -webkit-appearance: none !important;
  &:focus {
    outline: 0 !important;
    border-color: #56d5f5;
  }
`;

export const HilInputIcon = styled.i`
  font-size: 5rem;
  text-shadow: 0.05rem 0.05rem 0.2rem #303030;
  transition: text-shadow 0.1s ease, filter 0.1s ease;

  &:hover {
    cursor: pointer;
  }

  &:active {
    filter: brightness(85%);
    text-shadow: none;
  }
`;

export const HilBorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const HilButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 50rem;
  margin-top: 2rem;

  @media (max-width: ${(props) => props.theme.widthBreakpoint.tablet}) {
    padding: 0rem 2rem;
  }
`;

export const HilMessage = styled.h3`
  display: flex;
  font-family: ${(props) => props.theme.font.primary};
  justify-content: center;
  padding-top: 1rem;
  font-size: ${(props) => props.theme.fontSize.sz1};
`;

export const HilTimer = styled.p`
  display: flex;
  justify-content: center;
  font-family: ${(props) => props.theme.font.primary};
  font-weight: bold;
  font-size: ${(props) => props.theme.fontSize.sz2};
  color: ${(props) => props.theme.fg.primary};
`;

export const HilIcon = styled.i`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto auto;
  color: ${(props) => props.color};
  fill: green;
  font-size: 5rem;
  &:hover {
    cursor: pointer;
  }

  &:active {
    filter: brightness(85%);
  }
`;

export const HilButton = styled.button`
  border: none;

  border-radius: 1rem;
  box-shadow: 0 0.1rem 0.2rem 0rem #303030;
  height: 10rem;

  transition: background-color 0.25s ease, filter 0.1s ease;
  background-color: ${(props) => props.color};

  margin-bottom: 2rem;
  &:focus {
    outline: 0 !important;
  }

  &:active {
    box-shadow: none;
    filter: brightness(85%);
  }

  @media (max-width: ${(props) => props.theme.widthBreakpoint.tablet}) {
    height: 9rem;
  }
`;

export const HilButtonText = styled.p`
  color: ${(props) => props.color};
  font-size: 2rem;
`;
