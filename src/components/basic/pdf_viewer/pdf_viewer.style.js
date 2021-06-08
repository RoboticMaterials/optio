import styled, { css } from "styled-components"

export const Container = styled.div`
	background: ${props => props.theme.bg.primary};
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.textColor};
  overflow: hidden;
`

export const Header = styled.div`
	display: flex;
  	align-self: stretch;
  background: ${props => props.theme.bg.secondary};
  min-height: 2rem;
  padding: 1rem;
  
`

export const Title = styled.span`
	font-size: ${props => props.theme.fontSize.sz2};
	font-weight: ${props => props.theme.fontWeight.bold};
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  overflow: hidden;
  flex: 1;
  
  
`

export const DocumentOuterContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: .5rem;
  margin: 1rem;
  background: linear-gradient(217deg, rgba(0, 0, 0, 0.49), rgba(0, 0, 0, 0.09) 70.71%),
  linear-gradient(127deg, rgba(0, 0, 0, 0.33), rgba(0, 0, 0, 0.28) 70.71%),
  linear-gradient(336deg, rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.29) 70.71%);
`
export const DocumentContainer = styled.div`
	
  //max-height: 20%;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  
`

export const Nav = styled.div`
	//flex: 1;
`


export const Footer = styled.div`
  display: flex;
  align-self: stretch;
  background: ${props => props.theme.bg.secondary};
  min-height: 2rem;
`