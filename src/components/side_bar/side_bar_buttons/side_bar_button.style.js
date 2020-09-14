import styled from 'styled-components'

export const SideBarButtonIcon = styled.i`
    font-size: 2.5rem;
    padding: 1.5rem;
    cursor: pointer;

    // You cant stack a color on a gradient, but you CAN stack a gradient on a gradient
    background: ${props => props.mode==props.currentMode ? `linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)), `+props.theme.schema[props.mode].gradient : props.theme.bg.octonary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    transition: color 0.15s ease;

    &:hover{
        background: ${props => `linear-gradient(rgba(255,255,255,0.2),rgba(255,255,255,0.2)), `+props.theme.schema[props.mode].gradient};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 2rem;
        padding: 1rem;

        
    }
`
