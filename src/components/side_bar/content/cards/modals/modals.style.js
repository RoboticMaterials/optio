import styled, {css} from "styled-components";
import * as commonCss from "../../../../../common_css/common_css";
import {iconButtonCss} from "../../../../../common_css/common_css";

export const Container = styled.div`
	align-self: stretch;
	flex: 1;
	overflow-y: auto;
  align-items: stretch;
  display: flex;
  flex-direction: column;
`

export const LotWrapper = styled.div`
  justify-content: center;
  display: flex;
`

export const lotContainerStyle = {
	flex: 1,
	maxWidth: "40rem",
}

export const Containerrr = styled.div`
  align-self: stretch;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

export const StationSelectorContainer = styled.div`
  background: ${props => props.theme.bg.tertiary};
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: center;
  //padding: 1rem;
  padding: .5rem;


  border: 2px groove ${props => props.theme.bg.primary};
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;;
`

export const SubTitle = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
  	color: ${props => props.theme.bg.octonary};
`

export const StationName = styled.span`
  font-size: ${props => props.theme.fontSize.sz4};
  color: ${props => props.theme.bg.octonary};
`

export const StationsContainer = styled.div`
	
  overflow-x: auto;
  display: flex;
  //padding: 3rem 1rem;
  //height: fit-content;
  //min-height: fit-content;
  height: fit-content;
  align-items: center;
  justify-content: center;
  padding-top: .5rem; // needed so stations don't get cut off when they bounce up when selected
  
  
`

export const ProcessHeader = styled.div`
	align-self: stretch;
  	background: ${props => props.theme.bg.tertiary};
  	padding: .5rem;
  display: flex;
  justify-content: center;
`

export const StationButton = styled.button`
	${iconButtonCss};
  	color: ${props => props.color};
  font-size: 3rem;
  padding: 0;
  margin: 0;
`


export const StationContainer = styled.div`
  height: fit-content;
  min-height: fit-content;
  //padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  //background: blue;
  overflow: hidden;

  margin: 0 2rem;
  transition: all .2s ease;
  
  &:hover {
	cursor: pointer;
  }

  ${props => props.isSelected && selectedCss};
`

const selectedCss = css`
	transform: translateY(-10px);
  

`

export const StationSvgContainer = styled.div`
  //transform: scale(3);
  // background: red;
  height: fit-content;
  height: 3rem;
  width: 3rem;
  margin: 10px;
  //overflow: hidden;
  padding: 0;
  border-radius: .6rem;
  //font-size: 3rem;
  
  //margin: 1rem;
  ${props => props.isSelected && svgSelectedCss};
  ${props => props.greyed && svgGreyedCss};
`

const svgGreyedCss = css`
	filter: contrast(70%) brightness(70%);
`
const svgSelectedCss = css`

  rect {
    //fill: #9fcdff;
    //stroke: #13ffc9;
    //stroke-width: 5px;
    //stroke-dasharray: 2, 2;
    //stroke-linejoin: ;
  }
`