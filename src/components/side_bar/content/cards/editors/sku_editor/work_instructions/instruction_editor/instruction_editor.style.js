import styled, { css } from "styled-components"

export const Container = styled.div`
    flex: 1;
    align-self: stretch;
    background: ${props => props.theme.bg.primary};
    display: flex;
    flex-direction: column;
  	overflow: hidden;
`

export const StationName = styled.span`
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: ${props => props.theme.fontWeight.bold};
    
`

export const Header = styled.div`
  background: ${props => props.theme.bg.secondary};
    display: flex;
    align-self: stretch;
    align-items: center;
    justify-content: center;
    padding: .5rem 1rem;
  //margin-bottom: 1rem;
`

export const Footer = styled.div`
  background: ${props => props.theme.bg.secondary};
    display: flex;
    align-self: stretch;
    align-items: center;
    justify-content: center;
    padding: .5rem 1rem;
  	min-height: 3rem;
`

export const FieldsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: stretch;
    flex: 1;
    padding: 0 1rem 1rem 1rem;
  padding-top: 1rem;
    
    
  
  overflow-y: auto;
`
export const FieldContainer = styled.div`
    display: flex;
    align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  //background: blue;

  :not(:first-child) {
    margin-top: 1rem;
  }
  
  //overflow: hidden;
   
`

export const ComponentContainer = styled.div`
	//overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const FieldName = styled.span`
    font-size: ${props => props.theme.fontSize.sz3};
    margin-right: 1rem;
  font-weight: ${props => props.theme.fontWeight.bold};
`