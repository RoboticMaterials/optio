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
	font-size: ${props => props.theme.fontSize.sz3};
	//margin-right: 1rem;
`

export const RequiredText = styled.span`
  font-size: ${props => props.theme.fontSize.sz5};
  align-self: flex-start;
  margin-top: .25rem;
`