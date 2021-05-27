import styled from "styled-components";

export const ProcessHeader = styled.div`
	align-self: stretch;
  	margin-top: 1rem;
	align-self: center;
	display: flex;
	justify-content: center;
`

export const SubTitle = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
  	color: ${props => props.theme.bg.octonary};
`

export const Container = styled.div`
    display:flex;
    flex-direction:column;
    grid-template-columns: 1fr;
    grid-gap: 0.1rem;
    align-content: center;
	align-self: stretch;
	justify-content: center;
`