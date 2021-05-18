import styled, {css} from "styled-components";

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`



export const Caption = styled.span`
  color: ${props => props.theme.textColor};
  font-size: ${props => props.theme.fontSize.sz4};
  white-space: nowrap;
`


