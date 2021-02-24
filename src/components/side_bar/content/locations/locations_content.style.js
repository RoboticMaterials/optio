import styled from "styled-components";
import {
  RGB_Linear_Shade,
  hexToRGBA,
} from "../../../../methods/utils/color_utils";

// ========== Content ========== //
export const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 1rem;
  padding-top: 1.5rem;

  display: flex;
  flex-direction: column;
`;

export const ContentHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ContentTitle = styled.h1`
  font-family: ${(props) => props.theme.font.primary};
  font-size: 2rem;
  font-weight: 500;
  color: ${(props) => props.theme.schema.locations};
  flex-grow: 1;
`;

// ========== Location List ========== //

export const LocationList = styled.ul`
  flex-grow: 1;
  padding: 0;
`;

export const LocationItem = styled.div`
  width: auto;
  height: 2rem;
  box-sizing: content-box;

  text-align: center;

  background: transparent;
  border-radius: 0.5rem;
  margin-bottom: 0.4rem;

  border: 0.1rem solid white;
  box-sizing: border-box;

  cursor: pointer;
  user-select: none;

  &:hover {
    background: ${(props) => props.theme.bg.octonary};
  }
`;

export const LocationText = styled.span`
  height: 2rem;
  line-height: 2rem;
  box-sizing: content-box;

  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.sz4};
  font-weight: 500;
  color: ${(props) => props.theme.bg.octonary};

  ${(props) =>
    props.selected &&
    `
        background: ${props.theme.schema.locations};
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        display:block;
    `}
`;

// ========== Type Buttons & Containers ========== //

export const CustomTypesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  margin: 0.5rem 0 0.5rem 0;
  justify-content: center;
`;

export const Label = styled.h3`
  font-family: ${(props) => props.theme.font.primary};
  font-size: 1.5rem;
  font-weight: 500;
  color: ${(props) => props.theme.schema[props.schema].solid};
  user-select: none;
  text-align: center;
`;
