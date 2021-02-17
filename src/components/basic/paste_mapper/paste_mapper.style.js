import styled, {css} from "styled-components"
import {commonIcon, disabledButtonCss, iconButtonCss, newGlow, trapezoidCss} from "../../../common_css/common_css";

export const Container = styled.div`
	display: flex;
  //background: red;
  
  flex-direction: column;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5000;
    
  // padding: 1rem;
  overflow: hidden;
  min-height: 100%;
  min-width: 100%;
  max-height: 100%;
  
  background: ${props => props.theme.bg.quaternary};
`

export const Header = styled.div`
    background: ${props => props.theme.bg.quinary};
    align-items: center;
    display: flex;
    flex-direction: column;
`

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

export const Footer = styled.div`
    background: ${props => props.theme.bg.quinary};
`




export const Table = styled.div`
padding: 1rem;
	display: flex;
  flex: 1;
  overflow: auto;
  //flex-direction: column;
  //background: yellow;
  
`

export const Column = styled.div`
  flex-direction: column;
  align-self:stretch;
  flex: 1;
	display: flex;
  // border: 1px solid ${props => props.theme.bg.quaternary};
  background: ${props => props.theme.bg.quaternary};
    max-width: 10rem;
    align-items: stretch;
    
  	//background: green;
`

export const Row = styled.div`
  align-self:stretch;
  flex: 1;
	display: flex;
  border: 1px solid ${props => props.theme.bg.secondary};
  	//background: green;
`

export const cellCss = css`
    
`

export const Trapezoid = styled.div`
    ${trapezoidCss};
    // background: ${props => props.theme.bg.tertiary};
    // flex: 1;
    // padding: .25rem;
    // align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    // align-items: center;
    width: 98%;
    // border: 1px solid ${props => props.theme.bg.senary};
    // border-bottom: none;
    border: none;
    
    
    // background: red;
  //   height: 3rem;
  // max-height: 3rem;
  
`

export const ItemContainer = styled.div`
  overflow: hidden;
  position: relative;
  border-left: 1px solid ${props => props.theme.bg.quinary};
  border-right: 1px solid ${props => props.theme.bg.quinary};
  
  
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.bg.tertiary};
  
  
  height: 2rem;
  max-height: 2rem;
    
  
   border-top: .5px solid ${props => props.theme.bg.senary};
    border-bottom: .5px solid ${props => props.theme.bg.senary};
  
  //width: 10rem;
  
  background: ${props => props.selected && "blue"}
  
`

export const Cell = styled.div`
   
    // border: 1px solid ${props => props.theme.bg.quinary};
    border-radius: .5rem;
    // background: ${props => props.theme.bg.quinary};
    flex: 1;
    align-self: stretch;
    text-align: center;
    padding: 0 .5rem;
    // margin: .25rem;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const FieldNamesContainer = styled.div`
    padding: 1rem;
    width: fit-content;
    display: flex;
    
`

export const FieldName = styled.div`
    margin: 0 1rem;
    background: ${props => props.disabled ? "pink" : props.theme.bg.tertiary};
    padding: 1rem;
    border-radius: 1rem;
    
    ${props => props.disabled && disabledButtonCss};
`





export const SelectButton = styled.button`
    ${iconButtonCss};
    ${commonIcon};
    font-size: 1.5rem;
    color: ${props => props.selected ? props.theme.schema.error.solid : props.theme.schema.ok.solid};
    
    &:hover {
            
    }
    
    &:active {
    
    }
`




export const buttonViewCss = css`
	//border-right: ${props => !props.isLast && `solid ${props.theme.bg.quaternary} thin`}; // dont show border on last item
	color: ${props => props.theme.bg.quinary};
	padding: 0;
	margin: 0;
  margin: 0 .25rem;
	padding-left: .5rem;
	padding-right: .5rem;
  background: ${props => props.theme.bg.senary};
  
  &:hover {
	cursor: pointer;
  }
`


export const buttonViewSelectedCss = css`
	//background: transparent;
  background: ${props => props.theme.bg.secondary};
	color: white;
`
export const buttonCss = css`
	margin: 0;
	padding: 0;
	
	&:focus{
	}
	
	&:active{
	}
	
	&:hover{
		cursor: default;
	}
	
`

export const buttonGroupContainerCss = css`
	display: flex;
	flex-direction: row;
	align-self: center;
	padding: 0;
	margin: 0;
	
`