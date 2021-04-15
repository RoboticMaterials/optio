import styled from 'styled-components'
import * as buttonCss from '../../../../../../common_css/button_css'
import * as commonCss from '../../../../../../common_css/common_css'
import * as styles from '../../statistics_page.style'
import { LightenDarkenColor } from '../../../../../../methods/utils/color_utils'

export const PlotHeader = styled.div`
    ${commonCss.columnContainer};
    align-items: center;
	//height: 30rem;
	//min-height: 30rem;
`

export const SinglePlotContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	background: ${props => props.theme.bg.primary};
  box-shadow: ${props => props.theme.cardShadow};
	border-radius: 1rem;
	/* padding: 1rem; */
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
	
	max-height: ${props => (props.minHeight && props.minHeight > 25) ? props.minHeight.toString() + "rem" : "35rem"};
	min-height: ${props => (props.minHeight && props.minHeight > 25) ? props.minHeight.toString() + "rem" : "25rem"};
	height: ${props => (props.minHeight && props.minHeight > 25) ? props.minHeight.toString() + "rem" : "25rem"};
	/* height: 100%; */
  
  	//height: 100rem;
  	//min-height: 100rem;
  	//max-height: 100rem;
  
	min-width: 30rem;
  
	/* overflow: hidden; */
`

export const LoadingIcon = styled.i`
    font-size: 1.5rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
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
    background-color:${props => props.theme.schema.statistics.solid};
    color: ${props => props.theme.bg.primary};
    margin-top: .5rem;
    margin-bottom: 0.1rem;
    font-size: 1.25rem;

    &:hover {
      background-color:${props => LightenDarkenColor(props.theme.schema.statistics.solid, -5)};
    }
`

export const RowContainer = styled.div`
    ${commonCss.rowContainer};
    justify-content: space-around;
    position: relative;
`

export const ColumnContainer = styled.div`
    ${commonCss.columnContainer};
`

export const Label = styled.label`
  font-size: ${props => props.theme.fontSize.sz3};
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.bg.octonary};
`

export const DatePickerLabel = styled.label`
  font-size: ${props => props.theme.fontSize.sz3};
  font-family: ${props => props.theme.font.primary};
  /* color: ${props => props.theme.bg.septenary}; */
  color: white;

  // flex-grow: 1;
  // flex-basis: 12rem;

  line-height: 2.5rem;
  width: 7rem;
  margin-right: 1rem;
`;

export const TimePickerErrorComponent = styled.span`
  color: ${props => props.theme.bad};
  font-size: ${props => props.theme.fontSize.sz4};
  font-weight: 600;
  margin-top: .25rem;
`;

export const BreakContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: fit-content;
    background-color: ${props => props.theme.bg.secondary};
    border-radius: .5rem;
`

export const ChartTypeButton = styled.button`
    font-size: 1.25rem;
    width: 5rem;

    font-size: 1rem;
    width: 8rem;
    border: none;
    font-family: ${props => props.theme.font.primary};

    color: ${props => props.selected ? props.theme.bg.primary : props.theme.bg.quinary};

    background-color: ${props => props.selected ? props.theme.schema.statistics.solid : props.theme.bg.tertiary};

    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    &:hover{
        //background-color: ${props => props.theme.bg.quaternary};
    }
`

export const BreakLabel = styled.label`
  font-size: ${props => props.theme.fontSize.sz4};
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.bg.senary};
`

export const FormIcon = styled.i`
    position: absolute;
    right: .5rem;
    top: .5rem;
    font-size: 1.25rem;
`
