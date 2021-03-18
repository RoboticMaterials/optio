import styled, { css } from 'styled-components'
import { LightenDarkenColor } from '../../../../../../methods/utils/color_utils'

import { borderGlowCss, ContainerCss, conditionTextCss } from "../dashboard_buttons.style"


export const Container = styled.button`
    ${ContainerCss};
    
    // flex layout
    flex-direction: row;
    
    box-shadow: 0 9px 2px -4px ${props => LightenDarkenColor(props.theme.bg.tertiary,  -50)}; 
    height: 4rem; 
    // line-height: 4rem; 
    margin-bottom: 1rem; 
    min-width: 80%;

    padding: 0;
    padding-left: 0.5rem;
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