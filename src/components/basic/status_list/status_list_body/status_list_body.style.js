import styled, {css} from "styled-components"
import {bodyStyle, containerLayout, textSpanStyle} from "../../../../common_css/layout";

export const Container = styled.div`
  //padding: 1rem;
  //background: green;
  ${containerLayout};
  ${bodyStyle};
  overflow-y: auto;
  overflow-x: hidden;
`

export const RowTitles = styled.div`
  display: flex;
  align-self: stretch;
  background: ${props => props.theme.bg.secondary};
  padding: 1rem;
  justify-content: space-between;
  //border: 1px solid blueviolet;
`

export const cellCss = css`
  //border: 1px solid deeppink;
  flex: 1;
  display: flex;
  justify-content: flex-start;
`



export const Filler = styled.div`
  //margin: auto;
  //width: 1.75rem;
  ${cellCss};
  flex: .5;
`


export const IndexTitle = styled.span`
  //flex: 1;
  ${cellCss};
`

export const NameTitle = styled.span`
  ${cellCss};
`

export const StatusMessageTitle = styled.span`
  ${cellCss};
  
`

export const StatusIconTitle = styled.span`

`