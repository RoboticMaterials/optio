import styled from "styled-components";

import * as stylel from "../locations_content.style";

export const ContentContainer = styled(stylel.ContentContainer)``;

export const Label = styled(stylel.Label)``;

export const DefaultTypesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  border-bottom: 0.1rem solid ${(props) => props.theme.bg.septenary};
  justify-content: center;
  align-items: center;

  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

export const LocationTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 8rem;
  // margin-right: 1rem;
  // background: blue;
`;

export const LocationButtonConatiner = styled.div`
  display: flex;
  flex-direction: row;
`;

export const LocationButtonSubtitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 8rem;
  margin-right: 5rem;
`;

export const Subtitle = styled.h1`
  font-family: ${(props) => props.theme.font.primary};
  flex-grow: 1;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  margin-right: 1rem;
  justify-content: center;
`;
