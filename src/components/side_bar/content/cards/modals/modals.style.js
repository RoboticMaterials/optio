import styled, {css} from "styled-components";
import * as commonCss from "../../../../../common_css/common_css";
import {iconButtonCss} from "../../../../../common_css/common_css";

export const Container = styled.div`
	align-self: stretch;
	flex: 1;
	overflow-y: auto;
  // align-items: stretch;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  position: relative;
  
  ${props => props.greyed && lotsContainerGreyedCss};
  
`

export const ContainerWrapper = styled.div`
	align-self: stretch;
	flex: 1;
	// overflow-y: auto;
	overflow: hidden;
	align-items: stretch;
	display: flex;
	flex-direction: column;
	transition: all 0.2s ease;
	position: relative;
`

export const LoaderWrapper = styled.div`
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
  display: flex;
  align-items: center;
`

export const lotContainerStyle = {
	marginBottom: "0.5rem", 
  width: "80%", 
  flex: 1,
  margin: '.5rem auto .5rem auto', 
  border: '1px solid red'
}

export const Containerrr = styled.div`
  align-self: stretch;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  // max-height: 20rem;
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
















