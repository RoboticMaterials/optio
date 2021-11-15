import styled, {css} from "styled-components";

export const lastItemCss = css`
	border: none;
`

export const Row = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    height: 1.8rem;



  	${props => props.isLast && lastItemCss};
`

export const Label = styled.span`
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 600;
    margin-right: 0.5rem;
    line-height: 1.3rem;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		
    color:  ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
`

export const Count = styled.span`
	font-size: ${props => props.theme.fontSize.sz4};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color:  ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
`
