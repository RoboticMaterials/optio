import styled, { css } from "styled-components";

export const dropdownCss = css`
	//min-width: fit-content;
  z-index: 5000;
`

export const valueCss = css`
  ::-webkit-scrollbar {
    display: none;
  }
  
  overflow-x: auto;
  @media (max-width: ${props => props.theme.widthBreakpoint.laptop}) {
	font-size: ${props => props.theme.fontSize.sz4};
  }

  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const BarsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  flex-direction: row;
  //padding: 0 1rem;
  max-width: 100%;
  
  width: 100%;
  //background: hotpink;

  
  
  @media (max-width: ${props => props.theme.widthBreakpoint.laptop}) {
    flex-direction: column;
	align-items: center;
    max-width: 40rem;
  }
`

export const columnCss = css`
  //flex-direction: row;
  //align-items: center;
  //background: beige;
  //border: 1px solid black;

  
`

export const containerCss = css`
  //max-width: 30%;
  overflow: hidden;
  flex: 1;
  //width: 0;
  max-width: auto;
  width: auto;
  min-width: auto;
`



export const reactDropdownSelectCss = css`
  //max-width: 100%;
  @media (max-width: ${props => props.theme.widthBreakpoint.laptop}) {
    //max-width: 5rem;
  }
  
  
  
`

export const descriptionCss = css`
   color: black;
  // margin: "0 1rem 0 0",
	white-space: nowrap;
	min-width: 6rem;
	max-width: 6rem;
`