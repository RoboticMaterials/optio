import styled, {css} from "styled-components";

export const lastItemCss = css`
  border: none;
`
export const Row = styled.div`
    display: flex;
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.bg.quaternary};
    justify-content: space-between;
    padding: .25rem 0 .25rem 0;
  
  	${props => props.isLast && lastItemCss};
`

export const Label = styled.span`
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 600;
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

font-size: ${props => props.theme.fontSize.sz4};

`

export const DateArrow = styled.i`
	margin-left: .35rem;
	margin-right: .35rem;
	color: ${props => props.theme.bg.secondary};
`