import styled, {css} from "styled-components";

export const DatesContainer = styled.span`
	display: inline-flex;
	align-items: center;
	background: ${props => props.theme.bg.primary};
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
	background: ${props => props.theme.bg.primary};
	border-radius: 0.2rem;
  width: fit-content;
  position: relative;

  padding: .5rem 1rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;

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

export const BodyContainer = styled.div`
	display: flex;
	flex-direction: column;
  width: 100%;
  min-width: 100%;
  background: ${props => props.theme.bg.primary};
	padding: 1rem;
  align-self: stretch;
  z-index: 1001;

	//flex: 1;
	justify-content: space-between;
  min-height: ${props => props.minHeight};



`

export const ContentHeader = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
  	margin-bottom: 1rem;
	//padding: 1rem;
`

export const ContentTitle = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
	font-weight: ${props => props.theme.fontWeight.bold};
	font-family: ${props => props.theme.font.primary};
`

export const CalendarContainer = styled.div`
	overflow: auto;

`
