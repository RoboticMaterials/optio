import styled from "styled-components";
import {
  RGB_Linear_Shade,
  hexToRGBA,
  LightenDarkenColor,
} from "../../../../../methods/utils/color_utils";
import * as pageStyle from "../dashboards_header/dashboards_header.style";
import SmallButton from "../../../../basic/small_button/small_button";

export const AddButton = styled.button`
  flex-grow: 8;
  background-color: #bcbcbc;
`;

export const Container = styled.div`
  // flex layout
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  overflow: hidden;

  background: ${(props) => props.theme.bg.quaternary};
`;

export const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-top: 0.2rem;
  justify-content: center;
  padding-bottom: 0.2rem;
`;

export const HeaderContentContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled(pageStyle.Title)`
  padding: 0;
  margin: 0;
  margin-left: 4rem;
`;

export const CreateNewText = styled.span`
  // font-weight: bold;
  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.sz3};
`;

export const DashboardContainer = styled.div`
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  height: 100%;

  overflow: auto;
  overflow-x: hidden;

  padding: 2rem;

  // hide scroll bar
  ::-webkit-scrollbar {
    width: 0px; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  ::-webkit-scrollbar-thumb {
    background: transparent;
  }
`;

export const DashboardList = styled.div`
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  height: 100%;

  // flex layout
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

export const MenuButton = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`;
export const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AddHeadContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 2rem;
  padding-bottom: 1rem;
  position: relative;

  background-image: linear-gradient(
    ${(props) => props.theme.bg.tertiary},
    ${(props) => props.theme.bg.primary}
  );
  // background: ${(props) => props.theme.bg.secondary};
  border-bottom: thin solid ${(props) => props.theme.bg.tertiary};
  box-shadow: 0px 0px 15px black;

  z-index: 1;

  height: 5rem;
  max-height: 5rem;
`;
export const AddHeader = styled.h2`
  display: flex;
  margin: auto auto;
  font-weight: bold;
  color: #ff4b4b;
  font-family: ${(props) => props.theme.font.primary};
`;

export const HeaderButtonLeft = styled.button`
  display: flex;
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  background: ${(props) => props.theme.fg.primary};
  height: 2rem;
  text-align: center;
  color: ${(props) => props.theme.bg.primary};
  margin-top: 2rem;

  @media (max-width: 1000px) {
    top: -1.5rem;
  }

  &:hover {
    color: ${(props) => props.theme.bg.primary};
  }
`;
export const HeaderButtonLabel = styled.span`
  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.sz4};
  font-weight: 400;
  color: ${(props) => props.theme.bg.primary};
`;

export const HeaderButtonRight = styled.button`
  display: flex;
  position: absolute;
  right: 1rem;
  background: ${(props) => props.theme.fg.primary};
  height: 2.5rem;
  text-align: center;
  color: ${(props) => props.theme.bg.primary};

  &:hover {
    color: ${(props) => props.theme.bg.primary};
  }
`;

export const DashboardHeaderStatus = styled.p``;

export const UnstyledList = styled.ul`
  list-style: none;
  list-style-type: none;
  margin-top: 2rem;
  padding-inline-start: 0rem;
`;

export const TitleTextbox = styled.input`
  background-color: ${(props) => props.theme.bg.secondary};
  border-color: ${(props) => props.theme.bg.primary};
  font-size: ${(props) => props.theme.fontSize.sz2};
  font-family: ${(props) => props.theme.font.primary};
  display: flex;
  flex-grow: 1;

  &:focus {
    border: 1px solid ${(props) => props.theme.fg.primary};
    color: ${(props) => props.theme.bg.septenary};
    box-shadow: none;
    background-color: ${(props) => props.theme.bg.secondary};
  }

  &::placeholder {
    font-size: ${(props) => props.theme.fontSize.sz2};
    font-family: ${(props) => props.theme.font.secondary};
    color: ${(props) => props.theme.bg.quaternary};
  }
  margin: 0;
  padding: 0;
`;

export const NewDashboard = styled.button`
  position: relative;

  // default font
  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.sz3};

  // remove default button padding and margin
  padding: 0;
  margin: 0;
  width: 26rem;
  min-width: 26rem;
  max-width: 26rem;

  margin-bottom: 1rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  // border related styling
  border: 0.3rem solid ${(props) => props.theme.bg.senary};
  border-radius: 0.5rem;
  box-shadow: 5px 5px 10px ${(props) => props.theme.bg.quaternary};

  background: transparent;

  // flex layout
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  max-height: 15rem;
  height: 15rem;
  overflow: hidden;

  outline: none;
  &:focus {
    outline: none;
  }

  &:active {
    box-shadow: 0px 0px 0px white;
  }
`;

export const AddDashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0rem;

  flex-grow: 1;

  background: none;
  justify-content: center;
`;

export const AddDashboardButtonText = styled.p`
  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.sz2};
  font-weight: 600;
  color: ${(props) => props.theme.bg.senary};
`;

export const PlusButton = styled.i`
  color: ${(props) => props.theme.bg.senary};
  font-size: 2rem;
`;
