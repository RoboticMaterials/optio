import styled, {css} from "styled-components";
export const DatesContainer = styled.span`
	display: inline-flex;
	align-items: center;
	background: ${props => props.theme.bg.secondary};
	justify-content: center;
	padding: .75rem;
	border-radius: 0.4rem;
	width: fit-content;
	margin: 0;
	
	
`

const usableCss = css`
  &:hover {
    cursor: pointer !important;
    filter: brightness(105%);
  }
`

const notUsableCss = css`
  &:hover {
    cursor: default;
  }
`

export const DateItem = styled.div`
	display: flex;
	flex-direction: column;
	background: ${props => props.theme.bg.tertiary};
	border-radius: 0.2rem;
  width: fit-content;
  position: relative;
	
	padding: .5rem 1rem;
	align-items: center;
	justify-content: center;
  
  ${props => props.usable ? usableCss : notUsableCss};
	
	
	
`

export const DateArrow = styled.i`
	margin-left: 1rem;
	margin-right: 1rem;
	color: ${props => props.theme.bg.senary};
`

export const DateTitle = styled.span``

export const DateText = styled.span`

`