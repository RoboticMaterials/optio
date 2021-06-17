import styled, { css } from "styled-components"

export const Container = styled.div`
	background: ${props => props.theme.bg.primary};
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.textColor};
  overflow: hidden;
  justify-content: center;
  align-items: center;
  //flex: 1;
  position: relative;
`

export const LoaderContainer = styled.div`
	position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const Header = styled.div`
	display: flex;
  	align-self: stretch;
  background: ${props => props.theme.bg.secondary};
  min-height: 2rem;
  padding: 1rem;
  justify-content: center;
  
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
  align-items: center;
  padding: .5rem;
  margin: 1rem;
  opacity: ${props => props.loaded ? 1 : 0};
  //background: linear-gradient(217deg, rgba(0, 0, 0, 0.49), rgba(108, 108, 108, 0.09) 70.71%),
  //linear-gradient(127deg, rgba(0, 0, 0, 0.33), rgba(0, 0, 0, 0.62) 70.71%),
  //linear-gradient(336deg, rgba(0, 0, 0, 0.69), rgba(0, 0, 0, 0.08) 70.71%);

  border-radius: .3rem;
`
export const DocumentContainer = styled.div`
	color: white;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  
  
`

export const Footer = styled.div`
  display: flex;
  align-self: stretch;
  background: ${props => props.theme.bg.secondary};
  min-height: 2rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`