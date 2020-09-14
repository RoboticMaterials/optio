import styled, { css } from 'styled-components'
import { getDebugStyle } from "../../../../../../methods/utils/style_utils";

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	
	align-items: center;
	justify-content: space-between;
	
	position: relative;
	
	outline: none !important;
	outline-offset: none !important;
	
	margin-top: .5rem;
	
	background-color: transparent;
	
	border: .2rem solid;
	border-radius: 1rem;
	border-color: ${props=>props.theme.bg.octonary};
	
	padding-top: 1rem;
	padding-bottom: .5rem;
	padding-left: 1rem;
	padding-right: 1rem;
	
	// transition: all 0.5s ease 0s;
	
	// box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
	
	&:hover{
		cursor: grab;
		border-color: ${props => props.theme.schema["scheduler"].solid};
		// box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
		// transform: translateY(-2px);
	}
	
	&:active {
		box-shadow: none;
		// transform: translateY(4px);
	}
	
	${props => props.hasError && {
		// opacity: 0.5
	}}
	
	font-family: ${props => props.theme.font.primary};
	
`

export const TopContainer = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`

export const ErrorContainer = styled.div`
	position: relative;
`

export const buttonViewCss = css`
	border-right: ${props => !props.isLast && `solid ${props.theme.bg.quaternary} thin`}; // dont show border on last item
	color: ${props => props.theme.bg.quinary};
	padding: 0;
	margin: 0;
	padding-left: .5rem;
	padding-right: .5rem;
`

export const buttonGroupContainerCss = css`
	display: flex;
	flex-direction: row;
	align-self: center;
	padding: 0;
	margin: 0;
	
`

export const buttonViewSelectedCss = css`
	background: transparent;
	color: ${props => props.theme.schema["scheduler"].solid};
`
export const buttonCss = css`
	margin: 0;
	padding: 0;
	
	&:focus{
	}
	
	&:active{
	}
	
	&:hover{
		cursor: default;
	}
	
`

export const DaysContainer = styled.div`
	display: flex;
	flex-direction: row;
	margin: 0;
	padding: 0;
	
	${props => props.hasError && {
		opacity: 0.5
	}}
`

export const ContentContainer = styled.div`
	display: flex;
	flex-direction: row;
	
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin-bottom: .5rem;
`

export const Title = styled.span`
	font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    text-align: left;
    margin: 0;
    word-break: break-all;
    color: ${props => props.theme.schema["scheduler"].solid};
    
    // size styling based on sidebar width rather than screen size
	${props => (props.isSmall) && {
		// fontSize: ".2rem"
	}}
`

export const SubTitle = styled.span`
	font-size: ${props => props.theme.fontSize.sz4};
	font-family: ${props => props.theme.font.primary};
	color: ${props => props.theme.bg.senary};
	overflow: hidden;

	white-space: wrap;
	margin: 0;
	text-align: left;
	word-break: break-all;
	
	font-family: ${props => props.theme.font.primary};
	font-size: ${props => props.theme.fontSize.sz4};
	color: ${props => props.theme.bg.senary};
	cursor: pointer;
	
	// size styling based on sidebar width rather than screen size
	${props => (props.isSmall) && {
		// fontSize: ".2rem"
	}};
	
	${props => props.hasError && {
		color: props.theme.bad
	}};
	
`

export const LeftContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

export const TimeContainerlarge = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 1rem;
	
	${props => props.hasError && {
		opacity: 0.5
	}}
`

export const TimeContainerSmall = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	margin-bottom: .5rem;
	
	${props => props.hasError && {
		opacity: 0.5
	}}
`

export const TimeContainer = styled.span`
	color: ${props => props.theme.bg.octonary};
	display: flex;
	align-items: flex-end;
`

export const SwitchContainer = styled.div`
	margin-left: 1rem;
	&:hover{
		cursor: grab;
	}
`

export const TimeTitle = styled.span`
	margin-right: .5rem;
	font-weight: 600;
	font-size: 1rem;
	white-space: nowrap;
	
	// size styling based on sidebar width rather than screen size
	${props => (props.isSmall) && {
		fontSize: ".2rem"
	}}

`
export const TimeValue = styled.span`
	font-weight: 200;
	justify-content: center;
	align-items: flex-end;
	font-size: .9rem;
	white-space: nowrap;
	
	// size styling based on sidebar width rather than screen size
	${props => (props.isSmall) && {
		fontSize: ".2rem"
	}}	


`

export const ContentComponent = styled.div`

	

`
