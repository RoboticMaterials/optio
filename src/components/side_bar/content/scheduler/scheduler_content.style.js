import styled, { css } from "styled-components";

export const Container = styled.div`
  flex-grow: 1;
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  max-width: 100%;
`;

export const Title = styled.h1`
    font-family: ${(props) => props.theme.font.primary};
    font-size: ${(props) => props.theme.fontSize.sz7};
    font-weight: 500;
    color: ${(props) => props.theme.schema[props.schema].solid};
    padding: 0;
    margin: 0;
    
    ${(props) => props.isSmall && titleCssSmall}};
`;

export const titleCssSmall = css`
  font-size: ${(props) => props.theme.fontSize.sz2};
`;

export const Header = styled.div`
  // display: flex;
  // flex-direction: row;
  // width: 100%;
  // justify-content: space-between;

  display: flex;
  align-items: center;
  width: 100%;
  /* box-shadow: 2px 2px 10px black; */
  padding: 1rem;
  padding-top: 1.5rem;
  /* background-color: ${(props) => props.theme.bg.quinary}; */
  justify-content: space-between;
`;
