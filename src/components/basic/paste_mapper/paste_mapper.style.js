import styled, {css} from "styled-components"
import {commonIcon, disabledButtonCss, iconButtonCss, newGlow, trapezoidCss} from "../../../common_css/common_css";

export const Container = styled.div`
	display: flex;
  
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
  max-width: 100%;
  max-height: 100%;
  
  background: ${props => props.theme.bg.quaternary};
`

export const Header = styled.div`
    background: ${props => props.theme.bg.quinary};
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: 1rem;
`

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 1rem;
`

export const Footer = styled.div`
    background: ${props => props.theme.bg.quinary};
`

export const Title = styled.div`
	flex: 2;
	height: 100%;
	min-height: 100%;
	margin: 0;
	padding: 0;
	text-align: center;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	display: flex;
  flex-direction: column;
	font-size: ${props => props.theme.fontSize.sz2};
	font-weight: ${props => props.theme.fontWeight.bold};
	
`
export const TitleText = styled.span`

`

export const SectionBreak = styled.hr`
    border-top: 1px solid ${props => props.theme.bg.secondary};
    width: 100%;
    margin: 0;
    
`


export const Table = styled.div`
    padding-top: 1rem;
    padding-bottom: 1rem;
    //margin-left: auto;
    //margin-right: auto;
//padding: 1rem;
	display: flex;
  //flex: 1;
  overflow: auto;
    //width: fit-content;
    //align-self: center;
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
    //max-width: 10rem;
    min-width: 13rem;
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

export const FieldNameTab = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    align-self: stretch;
    //padding: 1rem;
    height: 4rem;
`
export const Trapezoid = styled.div`
    position: absolute;
    //top: 50%;
    //left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    background: ${props => props.theme.bg.tertiary};
    ${trapezoidCss};
    //padding: 1rem;
    width: 94.5%;
    height: 100%;
    border: none;
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
  
  
  //height: 2rem;
  min-height: 2rem;
  max-height: 4rem;
    
  
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
    overflow: auto;
`

export const FieldNamesContainer = styled.div`
    padding: 1rem;
    width: fit-content;
    display: flex;
    align-self: center;
    flex-direction: column;
`

export const SectionTitle = styled.span`
    margin: 0;
    padding: 0;
    text-align: center;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: ${props => props.theme.fontWeight.bold};
    margin-bottom: 1rem;
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
    margin-right: .5rem;
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