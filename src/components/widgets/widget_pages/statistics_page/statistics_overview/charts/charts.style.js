import styled from 'styled-components'
import * as buttonCss from '../../../../../../common_css/button_css'

export const PlotHeader = styled.div`
	//height: 30rem;
	//min-height: 30rem;
`

export const SinglePlotContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	background: ${props => props.theme.bg.tertiary};
	border-radius: 1.5rem;
	padding: 1rem;
	min-width: 60rem;
	overflow: hidden;
	

    width: 100%;
    // max-width: 60%;
    margin-bottom: 1rem;
    // min-height: ${props => (props.minHeight && props.minHeight > 25) ? props.minHeight.toString() + "rem" : "30rem"};
    height: fit-content;
    min-height: fit-content;
  
  	// /* // row layout
	// @media (min-width: ${props => props.theme.widthBreakpoint.laptopL}){
	// 	//flex: 1;
	// 	width: 100%;
	// 	margin: 0 5rem;
	// 	height: fit-content;
	// 	min-height: fit-content;
	// }
    //
  	// // column layout
	// @media (max-width: ${props => props.theme.widthBreakpoint.laptopL}){
	// 	width: 100%;
	// 	margin-bottom: 1rem;
	// 	// min-height: ${props => (props.minHeight && props.minHeight > 25) ? props.minHeight.toString() + "rem" : "30rem"};
	// 	height: fit-content;
	// 	min-height: fit-content;
	// } */
`

export const PlotContainer = styled.div`
	position: relative;
	
	max-height: ${props => (props.minHeight && props.minHeight > 25) ? props.minHeight.toString() + "rem" : "25rem"};
	min-height: ${props => (props.minHeight && props.minHeight > 25) ? props.minHeight.toString() + "rem" : "25rem"};
	height: ${props => (props.minHeight && props.minHeight > 25) ? props.minHeight.toString() + "rem" : "25rem"};
  
  	//height: 100rem;
  	//min-height: 100rem;
  	//max-height: 100rem;
  
	min-width: 60rem;
  
	overflow: hidden;
`

export const LoadingIcon = styled.i`
    font-size: 1.5rem;
`

export const NoDataText = styled.span`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: ${props => props.theme.fontSize.sz2};
	font-family: ${props => props.theme.font.primary};
	font-weight: ${props => props.theme.fontWeight.bold};
	color: ${props => props.theme.bg.septenary};
`

export const PlotTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.sz2};
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.bg.septenary};

  margin: 0rem .5rem 1rem .5rem;
`

export const ChartButton = styled.button`
    ${buttonCss.button};

`