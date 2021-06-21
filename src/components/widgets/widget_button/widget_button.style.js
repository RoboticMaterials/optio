import styled from 'styled-components'
import { stationColor } from '../../../constants/station_constants'
import {LightenDarkenColor} from '../../../methods/utils/color_utils';
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
    &:hover{
      background: ${props => !props.currentPage && LightenDarkenColor(props.theme.bg.primary, -10)};
    }

    ${props => props.switcher &&
    `
        height: 4rem;
        width: 6rem;
        border-radius: 0.4rem;
        transform: none;
        margin: 0 0.2rem;
        padding-top: .6rem;
    `
    }

    ${props => props.active &&
    `
        background: ${props.theme.bg.primary};
    `
    }
`;
export const WidgetButtonText = styled.h4`
    font-size: ${props => props.currentPage ? '.8rem': '0.6rem'};
    font-family: ${props => props.theme.font.primary};
    padding-top: ${props=>props.currentPage && '0.2rem'};
    color: ${props=>props.active || !props.currentPage ? stationColor : props.theme.bg.quaternary};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){

    }
`;


export const WidgetButtonIcon = styled.i`
    font-size: ${props => props.currentPage ? '2rem': '1.8rem'};
    color: ${props=>props.active || !props.currentPage ? stationColor : props.theme.bg.quaternary};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 2rem;
    }
`
