import styled from 'styled-components'
import {LightenDarkenColor} from "../../methods/utils/color_utils";

export const Container = styled.div`
    background: ${props => props.theme.bg.quaternary};
    display: flex;
    flex: 1;
    flex-direction: column;
    max-height: 100%;
    // padding-top: 4rem;
`

export const Icon2 = styled.i`
	padding: 0;
	margin: 0;
	font-size: 1.5rem;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
`

export const Button = styled.div`
    height: 6rem;

    display: flex;
    flex-direction: row;
        
    background: ${props => `linear-gradient(180deg, 
                                ${LightenDarkenColor(props.color, 20)} 0%, 
                                ${props.color} 50%, 
                                ${LightenDarkenColor(props.color, -20)} 100%)`};
    border-radius: 0.6rem;
    overflow: visible;
        
    // margins
    margin: 0 2rem 0.5rem 2rem;
        
    // padding
    padding: 0.5rem 1rem 0.5rem 1rem;
    
    outline: none;
    &:focus {
        outline: none;
    }

    letter-spacing: 1.5px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    
    outline: none;
    user-select: none;

    transition: transform 0.2s ease;

    cursor: grab;
    &:active {
        box-shadow: 2px 2px 2px rgba(0,0,0,0.5);
        transform: translateY(-2px);
        cursor: grabbing;
    }

}
`





export const Icon = styled.i`
	margin: 0;
	padding: 0;
	margin-right: 1rem;
	font-size: 2rem;
	
	
	
	
	height: 3.2rem;
    width: 3.2rem;
	
	border-radius: .5rem;

    box-shadow: 0 0.1rem 0.2rem 0rem #303030;
    /* background-color: ${props => props.showSideBar ? 'rgba(255,255,255,0.2)' : props.theme.bg.secondary} ; */
    background: rgba(97, 98, 109, 0.97);
    
    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:focus{
        outline: 0 !important;
    }

    &:active{
        box-shadow: none;
    }

    &:hover{
    }

    // @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
    //     width: 3.5rem;
    //     height: 3.5rem;
    //     margin-left: .5rem;
        
    // }
`

export const Header = styled.div`
	background: ${props => props.theme.bg.septenary};
	width: 100%;
	padding: 1rem;
	border-bottom: 1px solid black;
	align-items: center;
	display: flex;
`

export const Title = styled.span`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: 700;
    color: ${props => props.theme.bg.primary};
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
`

export const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 100%;
    padding: 1rem;
    
    
`

export const ListScrollContainer = styled.ul`
    padding: 0;
    margin: 0;
    overflow-y: scroll;
`

export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: auto;
    height: 2.4rem;
    background: transparent;
    padding-bottom: 0.4rem;

 
`

export const ListItemRect = styled.div`
    height: 100%;
    width: 100%;

    border-radius: 0.5rem;
    text-align: center;

    cursor: pointer;
    user-select: none;

    border: 0.1rem solid white;
    box-sizing: border-box;

    &:hover {
        background: ${props => props.theme.bg.octonary};
    }

`

export const ListItemTitle = styled.div`
    height: 2rem;
    line-height: 2rem;
    box-sizing: border-box;
    width: 100%;
    margin-top: -0.1rem;
    padding-left: 1rem;
    padding-right: 1rem;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};
    
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        background: ${props => props.theme.schema[props.schema].gradient};
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        display:block;
    }
`

export const ListItemIcon = styled.i`
    margin-left: 1rem;
    font-size: 1.25rem;
    color: lightgreen;

    &:hover {
        cursor: pointer;
    }
`
