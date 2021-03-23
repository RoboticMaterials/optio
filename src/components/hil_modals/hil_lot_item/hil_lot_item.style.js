import styled, { css } from 'styled-components'
import * as commonCss from "../../../common_css/common_css";
import {iconButtonCss} from "../../../common_css/common_css";

export const Container = styled.div`
	display: flex;
  align-items: center;
  align-self: stretch;
  
`

export const ScaleContainer = styled.div`
    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        transform: scale(0.75);
        
    }
    flex: 1;

`

export const CardContainer = styled.div`

    position: relative;
    flex: 1;

    
     
`

export const XContainer = styled.div`
position: absolute;
display: flex;
justify-content: center;
align-items: center;
transition: all 0.3s ease;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // opacity: 0;
    //
    // &:hover{
    //     opacity: 1;
    // }
`

export const X = styled.button`
    ${iconButtonCss};
    position: absolute;
    top: .75rem;
    right: .75rem;
    // left: 50%;
    // transform: translate(-50%,-50%);
    font-size: 4rem;
    color: ${props => props.theme.schema.delete.solid};
    // opacity: 60%;
    z-index: 5;
    cursor: pointer;
    
    // opacity: 0;
    transition: all 0.3s ease;

    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover{
    cursor: pointer;
        filter: brightness(120%);
    }
    
    
    text-shadow: 0.05rem 0.05rem 0.2rem #303030;


    &:active{
        filter: brightness(85%);
        text-shadow: none;
    }

    background: none;
    outline: none;
    border: none;

    &:focus {
        outline: none;
    }
    
    
`

export const RemoveButton = styled.div`
    ${commonCss.iconButtonCss};
    ${commonCss.commonClickableIcon};
    font-size: 3rem;
    margin: 0 5rem 0 0;
    padding: 0;
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
