import styled from 'styled-components'
import { stationColor } from '../../../constants/station_constants'

export const WidgetButtonButton = styled.button`

    display:flex;
    flex-direction: column;
    border: none;
    outline:none;

    align-items: center;
    justify-content: center;


    width: 4.2rem;
    height: 4.2rem;
    border-radius: 50%;
    background: white;
    box-shadow: ${props => props.theme.cardShadow};

    transform: translate(-50%, -50%);

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    ${props => props.switcher &&
    `
        height: 4rem;
        width: 6rem;
        border-radius: 0.4rem;
        transform: none;
        margin: 0 0.2rem;
    `
    }

    ${props => props.active &&
    `
        background: ${props.theme.bg.tertiary};
    `
    }
`;
export const WidgetButtonText = styled.h4`
    font-size: 0.6rem;
    font-family: ${props => props.theme.font.primary};

    color: ${stationColor};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){

    }
`;


export const WidgetButtonIcon = styled.i`
    font-size: 1.8rem;
    color: ${stationColor};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 2rem;
    }
`