import styled, {css} from 'styled-components'

export const Container = styled.div`
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	justify-content: center;
`

export const TextContainer = styled.div`
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  flex: 1;
  //width: 100%;
  position: relative;
  display: flex;
`

export const Label = styled.span`
	font-size: 1rem;
	margin-left: 0.4rem;
	margin-bottom: 0.2rem;
`

export const RequiredText = styled.span`
  font-size: ${props => props.theme.fontSize.sz5};
  align-self: flex-start;
  margin-top: .25rem;
`
