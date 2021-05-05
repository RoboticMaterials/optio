import styled, { css } from 'styled-components'

import { hexToRGBA, RGB_Linear_Shade, LightenDarkenColor } from '../../../../../../methods/utils/color_utils';
import { borderGlowCss, ContainerCss, conditionTextCss } from "../dashboard_buttons.style"


const ButtonStyle = css`
    height: 100%;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    &:focus {
      outline: none;
    }
    padding: 0;
    margin: 0;
    letter-spacing: 1.5px;
    border: none;
    transition: all 0.1s ease 0s;
    cursor: pointer;
    outline: none;
    
    ${props => props.clickable && !props.disabled &&
        `&:active {
            background: ${`linear-gradient(180deg, 
                ${LightenDarkenColor(props.background, -20)} 0%, 
                ${props.background} 50%, 
                ${LightenDarkenColor(props.background, 20)} 100%)`
        }
        }`
    }
    
    ${props => props.disabled &&
    {
        color: props.theme.bg.quaternary,
        background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 100%), ${LightenDarkenColor(props.background, -60)}`,
        pointerEvents: "none",
    }
    }
    
`

export const Header = styled.div`
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.5rem;
`

export const ContentContainer = styled.div`
    display: flex;
    flex: 2;
    width: 100%;
    overflow: hidden;
`

export const RobotButton = styled.div`
    flex: 3;
    ${ButtonStyle};
    justify-content: space-around;
    align-items: center;
    background: rgba(0,0,0,0);
    display: flex;
    flex-direction: column;

`

export const HumanButton = styled.button`
    ${ButtonStyle};
    flex: 1;
    border-left: 1px solid ${props => props.theme.bg.secondary};
    background: ${props => `linear-gradient(180deg, 
                            ${LightenDarkenColor(props.background, -40)} 0%, 
                            ${LightenDarkenColor(props.background, -50)} 50%, 
                            ${LightenDarkenColor(props.background, -60)} 100%)`};
`

export const Container = styled.button`
    ${ContainerCss};
    
    // flex layout
    flex-direction: row;
    
    box-shadow: 0 9px 2px -4px ${props => LightenDarkenColor(props.theme.bg.secondary, -50)}; 
    height: 4rem; 
    // line-height: 4rem; 
    margin-bottom: 1rem; 
    flex-grow: 1;

    padding: 0;
    padding-left: 0.5rem;

    &:active{
        box-shadow: none;
        filter: brightness(85%);
    }
  

`

export const ConditionText = styled.span`
${conditionTextCss};

flex-grow: 1;
`

export const IconContainer = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    bottom: 0;
    width: 10.75rem;
`