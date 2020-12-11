import styled, { css } from 'styled-components'

import { borderGlowCss, ContainerCss, conditionTextCss } from "../dashboard_buttons.style"


export const Container = styled.button`
    ${ContainerCss};
    
    // flex layout
    flex-direction: column;
    
    // padding
    padding: 0.5rem 1rem 0.5rem 1rem;
`

export const ConditionText = styled.span`
    ${conditionTextCss};
`

export const IconContainer = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.bg.senary};
    right: 0;
    top: 0;
    bottom: 0;
    width: 4rem;
    border-left: 1px solid ${props => props.theme.bg.tertiary};
`