import styled from 'styled-components'

import { LightenDarkenColor } from '../../../../../methods/utils/color_utils'

export const OverviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
    height: 100%;
    flex: 1;
    border-radius: 1rem;

    align-items: center;
    justify-content: center;

    padding-top: 1rem;
    // padding: .5rem;

`

export const StationName = styled.h1`
    margin-bottom: 0.5rem;
    color: ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
`





export const PlotsContainer = styled.div`
  	//align-items: center;
  	position: relative;
    //display: flex;
    //flex-direction: row;
    //flex: 1;
    width: 100%;
    overflow: scroll;
    padding: 1rem;
    
    // @media (max-width: ${props => props.theme.widthBreakpoint.laptopL}){
    //     flex-direction: column;
    // }

	@media (min-width: ${props => props.theme.widthBreakpoint.laptopL}){
      display: flex;
      flex-direction: row;
      flex: 1;
	}
`

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
  
  	// row layout
	@media (min-width: ${props => props.theme.widthBreakpoint.laptopL}){
		//flex: 1;
		width: 100%;
		margin: 0 5rem;
		height: fit-content;
		min-height: fit-content;
	}
  
  	// column layout
	@media (max-width: ${props => props.theme.widthBreakpoint.laptopL}){
		width: 100%;
		margin-bottom: 1rem;
		// min-height: ${props => (props.minHeight && props.minHeight > 25) ? props.minHeight.toString() + "rem" : "30rem"};
		height: fit-content;
		min-height: fit-content;
	}
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

// ========== Statistics Container ========== //
export const StatsSection = styled.div`
    /* background: ${props => LightenDarkenColor(props.theme.bg.quaternary, -10)}; */
    border-radius: 0.5rem;

    /* margin-bottom: 1rem; */

    max-width: 60rem;
    width: 100%;

    height: 12rem;

    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;

    padding: 0rem 4rem 0 4rem;
`
export const StatTitle = styled.h2`
    position: absolute;
    left: 0;
    right: 0;
    top: 4rem;
    
    text-align: center;

    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: white;
`

export const Col = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

export const Stat = styled.div`
    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;

`

export const StatLabel = styled.h3`
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.fg.primary};

    margin-right: 1rem;
`

export const StatValue = styled.h4`
    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
    color: white;
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    // width: 100%;
    min-width: 15rem;
    max-width: 45rem;
`

export const DateSelectorIcon = styled.i`
    font-size: 1.5rem;
    margin-right: 1rem;
    margin-left: 1rem;
    color: ${props => props.theme.bg.septenary};

    &:hover{
        cursor:pointer;
    }
`

export const PlotTitle = styled.h2`
  font-size: ${props => props.theme.fontSize.sz2};
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.bg.septenary};

  margin: 0rem .5rem 1rem .5rem;
`

export const DateSelectorTitle = styled.h1`
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.septenary};

    margin: 0rem .5rem;

`

export const LoadingIcon = styled.i`
    font-size: 1.5rem;
`