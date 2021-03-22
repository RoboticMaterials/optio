import styled, { css } from 'styled-components'

export const Container = styled.div`
	display: flex;
  align-items: center;
`


export const QuantityItem = styled.button`
  background: linear-gradient(0deg, rgb(215, 215, 215) 0%, rgb(152, 152, 152) 100%);
  padding: 1rem;
  outline: none !important;
  border-radius: 0.4rem;
  width: 5rem;
  max-width: 5rem;
  min-width: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  
  
  font-size: ${props => props.theme.fontSize.sz3};
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.textColor};
  
  transition: all 0.1s ease-in-out;
  
  box-shadow: 2px 2px 2px grey;
  
  &:hover {
	cursor: pointer;
	box-shadow: 3px 3px 3px grey;
	transform: translate(-3px, -3px);
	filter: brightness(110%);
  }
  
  &:active {
    box-shadow: 0px 0px 0px grey;
    transform: translate(2px, 2px);
    filter: brightness(90%);
  }
`
