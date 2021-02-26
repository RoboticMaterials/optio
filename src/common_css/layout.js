import styled, {css} from 'styled-components'

export const containerLayout = css`
	display: flex;
  	flex-direction: column;
  	flex: 1;
  	align-self: stretch;
`

export const columnRowLayout = css`
	align-self: stretch
`

export const bodyStyle = css`
  background: ${props => props.theme.bg.quaternary};
`

export const headerStyle = css`
  background: ${props => props.theme.bg.quinary};
`

export const footerStyle = css`
  background: ${props => props.theme.bg.quinary};
`

export const textSpanStyle = css`
  margin: 0;
  padding: 0;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  
`