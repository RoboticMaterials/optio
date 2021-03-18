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
  transition: all 0.2s ease;
  position: relative;
  
  ${props => props.greyed && lotsContainerGreyedCss};
`
export const ContainerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
	//position: relative;
`

export const spinnerCss = css`
	//position: absolute;
  //	top: 50%;
  //left: 50%;
  //transform: translate(-50%, -50%);
  //z-index: 1000;
`

const lotsContainerGreyedCss = css`
  filter: contrast(70%) brightness(70%);
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
  // background: ${props => props.theme.bg.tertiary};
  display: flex;
  flex-direction: column;
  align-items: center;
  //padding: 1rem;
  //padding: .5rem;
  padding-top: 1rem;
  // border: 2px groove ${props => props.theme.bg.primary};
  //border-radius: 3rem;
  //max-width: 65rem;
  overflow: hidden;
  flex: 1;
`

export const StationSelectorContainerWrapper = styled.div`
  justify-content: center;
  display: flex;
  //margin: 1rem 0;
`



// export const LotWrapper = styled.div`
//   justify-content: center;
//   display: flex;
// `
//
// export const lotContainerStyle = {
// 	flex: 1,
// 	maxWidth: "40rem",
// }

export const SubTitle = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
  	color: ${props => props.theme.bg.octonary};
`

export const StationName = styled.span`
  font-size: ${props => props.theme.fontSize.sz4};
  color: ${props => props.theme.bg.octonary};
`

export const StationsScrollWrapper = styled.div`
	overflow-x: auto;
  	align-self: stretch;

  /* width */
  ::-webkit-scrollbar {
	height: 10px;
  }
`

export const StationsContainer = styled.div`
	
  display: flex;
  overflow: visible;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: 10rem;
  //align-self: stretch;
  
`

export const ProcessHeader = styled.div`
	align-self: stretch;
  	margin-top: 1rem;
	align-self: center;
	display: flex;
	justify-content: center;
`

export const StationButton = styled.button`
	${iconButtonCss};
  	color: ${props => props.color};
  padding: 0;
  margin: 0;
  
  transition: font-size 0.5s ease;

  //margin: 1rem;
  font-size: ${props => props.isSelected ? "4rem" : "3rem"};
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
  height: 3rem;
  width: 3rem;
  margin: 10px;
  //overflow: hidden;
  padding: 0;
  border-radius: .6rem;
  transition: width 0.5s ease;
  transition: height 0.5s ease;
  //font-size: 3rem;
  
  //margin: 1rem;
  ${props => props.isSelected && svgSelectedCss};
  ${props => props.greyed && svgGreyedCss};
`

const svgGreyedCss = css`
	filter: contrast(70%) brightness(70%);
`
const svgSelectedCss = css`
  height: 4rem;
  width: 4rem;

  rect {
    //fill: #9fcdff;
    //stroke: #13ffc9;
    //stroke-width: 5px;
    //stroke-dasharray: 2, 2;
    //stroke-linejoin: ;
  }
`