import styled, {css} from 'styled-components'

export const containerLayout = css`
	display: flex;
  	flex-direction: column;
  	flex: 1;
  	align-self: stretch;
`

export const columnRowLayout = css`
	align-self: stretch;
`

export const bodyStyle = css`
  background: ${props => props.theme.bg.primary};
`

export const headerStyle = css`
z-index: 10;
  background: ${props => props.theme.bg.secondary};
  box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
`

export const footerStyle = css`
  background: ${props => props.theme.bg.secondary};
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