import styled, {css} from "styled-components";

export const lastItemCss = css`
  border: none;
`
export const Row = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
	height: 1.3rem;
  
  	${props => props.isLast && lastItemCss};
`

export const Label = styled.span`
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 600;
	line-height: 1.3rem;
	color:  ${props => props.theme.bg.septenary};
	font-family: ${props => props.theme.font.primary};
`

export const DatesContainer = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
    width: fit-content;
    
`

export const DateItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	
	&:hover {
		cursor: pointer;
	}
	
`

export const DateText = styled.span`
color:  ${props => props.theme.bg.septenary};
font-size: ${props => props.theme.fontSize.sz4};
font-family: ${props => props.theme.font.primary};
`

export const DateArrow = styled.i`
	margin-left: .35rem;
	margin-right: .35rem;
	color: ${props => props.theme.bg.secondary};
	// font-family: ${props => props.theme.font.primary};
`