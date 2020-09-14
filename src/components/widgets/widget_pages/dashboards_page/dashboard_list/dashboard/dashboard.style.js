import styled from 'styled-components'
import * as style from '../DashboardsList.style'
import SmallButton from "../../../../../basic/small_button/small_button";

import { LightenDarkenColor } from '../../../../../../methods/utils/color_utils'

export const AddContainer = styled(style.AddContainer)`
	padding-bottom: 1rem;
	align-content: center;
	width: 45%;
`

export const Container = styled.button`
	position: relative;
	
	// default font
	font-family: ${props => props.theme.font.primary};
	font-size: ${props => props.theme.fontSize.sz3};
	
	// remove default button padding and margin
	padding: 0;
	margin: 0;
	
	// // large screen style
	// @media (min-width: ${props => props.theme.widthBreakpoint.mobileL}){
	//   width: 100%;
	//   max-width: 100%;
	// }
	
	// // small screen style
	// @media (min-width: ${props => props.theme.widthBreakpoint.tablet}){
	// 	width: 45%;
	// 	margin-left: .5rem;
	// 	margin-right: .5rem;
	// }
	min-width: 26rem;
	width: 26rem;
	max-width: 26rem;
	
	margin-bottom: 1rem;
	margin-left: 0.5rem;
	margin-right: 0.5rem;
	
	// border related styling
	border: 0.3rem solid ${props => props.theme.bg.septenary};
	border-radius: 0.5rem;
	box-shadow: 5px 5px 10px ${props => props.theme.bg.quaternary};
	
	background: transparent;
	
	// flex layout
	display: flex;
	flex-direction: column;
	align-items: center;
	// justify-content: space-between;
	
	max-height: 15rem;
	height: 15rem;
	overflow: visible;
	
	outline: none;
	&:focus {
		outline: none;
	}
	
	&:active {
		box-shadow: 0px 0px 0px white;
	}
`

export const HeaderContainer = styled.div`
	width: 100%;
	padding-top: 0.75rem;
	padding-bottom: 0.5rem;
   	
	z-index: 1;
	
	// flex layout
	flex-grow: 0;
	height: 3rem;
	display: flex;
	justify-content: center;


	// background-color: ${props => props.theme.bg.septenary};
`

export const Title = styled.h3`
	padding: 0;
	margin: 0;
	color: ${props => props.theme.bg.septenary};
	
	font-family: ${props => props.theme.font.primary};
	font-size: ${props => props.theme.fontSize.sz2};
	font-weight: bold;
	
	white-space: nowrap;
	overflow: hidden;
	width: 100%;
	
	text-overflow: ellipsis;
	
`

export const NoGoals = styled.div`
	align-self: center;
	color: ${props => LightenDarkenColor(props.theme.bg.senary, -40)};
`

export const List = styled.div`
	width: 24rem;
	max-width: 100%;
	min-width: 100%;
	overflow-y: scroll;
	overflow-x: hidden;

	flex-grow: 1;
	max-height: 100%;
	height: 11.4rem;

	text-align: center;
	
	padding: 1rem;
	padding-top: 0;
	
	// hide scroll bar
	::-webkit-scrollbar {
		width: 0px;  /* Remove scrollbar space */
		// background: transparent;  /* Optional: just make scrollbar invisible */
	}
	::-webkit-scrollbar-thumb {
		background: transparent;
	}
	
`

export const ListContainer = styled.div`
	width: 100%;
	max-height: 100%;

	text-align: center;
`

export const TaskButton = styled.li`
	color: ${props => props.theme.bg.quaternary};
	background: ${props => `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%), ${LightenDarkenColor(props.color, -60)}`};
	font-size: ${props => props.theme.fontSize.sz3};
	font: ${props => props.theme.font.primary};
	text-align: center;

	user-select: none;

	margin-bottom: 0.15rem;
	padding: 0 1.2rem 0 1.2rem;
	border-radius: 0.3rem;
	
	// hide long names
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	list-style-type: none;
	width: 100%;
	flex-grow: 1;
	
`

export const DashboardButtonTitle = styled.h2`
	min-width: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	font-family: ${props => props.theme.font.primary};
	font-size: ${props => props.theme.fontSize.sz2};
	padding: 1rem 4rem 0 0;
	font-weight: bold;
	color: ${props => props.theme.bg.senary};
	width: 100%;
`




export const ButtonsContainer = styled.div`
	width: 100%;
	display: flex;
	z-index: 1;
`

export const Button = styled(SmallButton)`
	flex: 1;
	margin: 0;
	padding: 0;
	
	&:hover {
		cursor: pointer;
	}
	background: transparent;
	z-index: 2;
`

export const DashboardButtonRowConatiner = styled.div`
	display: flex;
	flex-direction: row;
	align-content:center;
`

export const DashboardButtonIcon = styled.a`
	display: flex;
	position: absolute;
	right: 1.5rem;
	top: 1.5rem;
	/* z-index: 2; */
	padding: 1rem;
	margin: -1rem;
	&:hover {
		cursor: pointer;
	}
`


export const Icon = styled.i`
	display: flex;
	color: ${props => props.theme.fg.primary};
	font-size: 2rem;
	margin-left: 0.75rem;
	margin-right: 0.75rem;
	&:hover {
		cursor: pointer;
	}
`
export const HILStatus = styled.i`
	bottom: 2.55rem;
	right: 2rem;
	display: flex;
	position: absolute;
	color: ${props => props.theme.good};
`

export const HILTimer = styled.p`
	bottom: 1.2rem;
	right: 3.5rem;
	display: flex;
	position: absolute;
	color: ${props => props.theme.good};
	font-family: ${props => props.theme.font.primary};
	font-weight: bold;
`

export const WarningIcon = styled.i`
	margin-right: 2rem;
	color: ${props => props.theme.bad};
	z-index: 10;
	font-size: 1.2rem;
`

// export const AddNewDashboardContainer = styled.div`
// 	display: flex;
// 	border: 0.25rem solid ${props => props.theme.bg.quaternary};
// 	background: none;
// 	height: 10rem;
// 	border-radius: 0.5rem;
// 	justify-content: center;
// 	align-items:center;
// `

// export const AddDashboardButton = styled.button`
//
//
// `
