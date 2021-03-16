import styled, {css} from "styled-components"
import {commonClickableIcon, disabledButtonCss, iconButtonCss, newGlow, trapezoidCss} from "../../../common_css/common_css";
import {containerLayout} from "../../../common_css/layout";

const scrollCss = css`
::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        margin: 1rem;
        background: transparent;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: rgba(175,175,175,0.75);
    }

    ::-webkit-scrollbar-track:hover {
        background: rgba(175,175,175,0.6);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #27272b;
        border-radius: .5rem;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;

    }
`

export const Container = styled.div`
    display: flex;
    ${containerLayout};
    align-self: center;
    overflow: hidden;
    border-radius: 1rem;
    flex-direction: column;
    z-index: 5000;
    overflow: hidden;
    height: 90vh;
    width: 90vw;
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
    // padding: 1rem;
`

export const Footer = styled.div`
    background: ${props => props.theme.bg.quinary};
    display: flex;
    justify-content: center;
    align-items: center;
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




export const TableContainer = styled.div`
    padding: 1rem;
    overflow: auto;
    flex: 1;

    ${scrollCss};
    
`
export const Table = styled.div`
    width: fit-content;
    overflow: hidden;
	display: flex;
`

export const Column = styled.div`
    flex-direction: column;
    align-self:stretch;
    flex: 1;
    display: flex;
    background: ${props => props.theme.bg.quaternary};
    min-width: 13rem;
    align-items: stretch;
`

export const Row = styled.div`
    align-self:stretch;
    flex: 1;
    display: flex;
    border: 1px solid ${props => props.theme.bg.secondary};
`

export const cellCss = css`
    
`

export const FieldNameTab = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4rem;
    min-height: 4rem;
`
export const Trapezoid = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 0;
    background: ${props => props.theme.bg.tertiary};
    ${trapezoidCss};
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
    
    min-height: 2rem;
    max-height: 2rem;
    
    
    
    border-top: .5px solid ${props => props.theme.bg.senary};
    border-bottom: .5px solid ${props => props.theme.bg.senary};
    
    background: ${props => props.selected && "blue"}
`

export const Cell = styled.div`
   
    overflow: auto;
    ::-webkit-scrollbar {
        display: none;
    }
    border-radius: .5rem;
    flex: 1;
    align-self: stretch;
    text-align: center;
    padding: 0 .5rem;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    align-self: stretch;
    padding: 1rem 0;
    min-height: fit-content;
    
`

export const FieldNamesContainer = styled.div`
    overflow-x: auto;
    min-height: fit-content;
    padding: 1rem;
    align-self: stretch;
    ${scrollCss};
    margin-bottom: 1rem;
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

export const SectionDescription = styled.span`
    margin: 0;
    padding: 0;
    text-align: center;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: ${props => props.theme.fontSize.sz4};
    //margin-bottom: 1rem;
    margin-top: 1rem;
    margin: 0 1rem;
`

export const FieldButton = styled.div`
    margin: 0 1rem;
    background: ${props => props.disabled ? "pink" : props.theme.bg.tertiary};
    //padding: 1rem;
    border-radius: 1rem;
    min-width: fit-content;
    display: flex;
    flex-direction: column;
    color: white;
    overflow: hidden;
    align-items: stretch;

    ${props => props.disabled && disabledButtonCss};
`

export const FieldName = styled.div`
    font-size: ${props => props.theme.fontSize.sz3};
    min-width: fit-content;
    padding: .5rem 1rem;
`

export const FieldDescription = styled.div`
    font-size: ${props => props.theme.fontSize.sz5};
    background: ${props => props.disabled ? "pink" : props.theme.bg.senary};
    padding: .25rem;
    display: inline-flex;
    min-width: fit-content;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.bg.tertiary};
    font-style: italic;
`





export const SelectButton = styled.button`
    ${iconButtonCss};
    ${commonClickableIcon};
    margin-right: .5rem;
    font-size: 1.5rem;
    color: ${props => props.color};
    
    &:hover {
            
    }
    
    &:active {
    
    }
`




export const buttonViewCss = css`
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