import styled, { css } from "styled-components"
import {textSpanStyle} from "../../../../common_css/layout";
import {commonIcon, iconButtonCss} from "../../../../common_css/common_css";

export const Container = styled.div`
	align-self: stretch;
	//background: darkcyan;
	//height: 3rem;
	min-height: 4rem;
	max-height: 4rem;
	display: flex;
	align-items: center;
  
	//border: 1px solid black;
  justify-content: space-around;

  border-bottom: 1px solid black;
  //border-bottom: ${props => props.showBottomBorer && "1px solid black"};
  
  padding: 1rem;
  
`

export const ErrorContainer = styled.div`

`

export const ErrorTooltipContainerComponent = styled.div`
	position: relative;
`

export const Index = styled.span`
	//flex: 1;
  ${textSpanStyle};
  margin-right: 1rem;
`

export const NameContainer = styled.div`
	//flex: 1;
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  //background: darkred;
`

export const Name = styled.span`
  //flex: 1;
  ${textSpanStyle};
`

export const ColumnWrapper = styled.div`
flex: 1;
  display: flex;
  justify-content: space-between;
`

export const StatusContainer = styled.div`
	flex: 1;
  //background: blueviolet;
  //border: 1px solid deeppink;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

export const TooltipContainer = styled.div`
	position: relative;
`

export const StatusMessage = styled.span`
  margin-right: 2rem;
`

export const StatusIcon = styled.i`
	
`

export const EditButton = styled.button`
	${iconButtonCss};
	${commonIcon};
  	font-size: 1.75rem;
  //background: forestgreen;
`

export const cellCss = css`
  //padding: 5p;
  //box-sizing: border-box;
  width: 50%;
  margin: 0 1rem;
`

export const rowCss = css`
	margin-bottom: .5rem;
`

export const ListContainer = styled.ul`
	margin: 0;
  padding: 0;
  list-style-type: circle;
`

export const InsideTooltipContainer = styled.div`
	display: flex;
  flex-direction: column;
  align-items: stretch;
`

export const ItemContainer = styled.li`
	display: flex;
  	justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style-type: circle;
  ${rowCss};
`



export const ErrorHeader = styled.div`
	display: flex;
  justify-content: space-between;
  border-bottom: 1px solid whitesmoke;
  
  ${rowCss};
`

export const ErrorLabel = styled.span`
  ${cellCss};
`

export const ErrorKey = styled.span`
	//margin-right: 2rem;
  
  ${cellCss};
`




export const ErrorColumn = styled.div`
	display: flex;
  
  align-items: stretch;
  flex-direction: column;
  ${cellCss};
`

export const ErrorValue = styled.span`
  
  

`