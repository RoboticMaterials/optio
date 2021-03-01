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

export const Count = styled.span`
	font-size: ${props => props.theme.fontSize.sz4};
`