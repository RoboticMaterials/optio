import styled from 'styled-components'
import { stationColor } from '../../../constants/station_constants'

export const WidgetButtonButton = styled.button`

    display:flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: column;
    border: none;
    text-align: center;
    outline:none;

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

    // @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
    //     width: 6rem;
    //     height: 4rem;

    // }
`;

export const WidgetButtonLabel = styled.label`
    display: inline-block;
    width: 12.5rem;
    height: 6rem;
    text-align: center;
`;

export const WidgetButtonText = styled.h4`
    font-size: 0.6rem;
    font-family: ${props => props.theme.font.primary};
    font-weight: regular;

    text-align: center;
    align-self:center;

    color: ${stationColor};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){

    }
`;

export const WidgetStationName = styled.h4`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};

    text-align: center;
    align-self:center;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
      font-size: ${props => props.theme.fontSize.sz6};

    }
`;

export const WidgetButtonIcon = styled.i`
    font-size: 1.8rem;
    margin-bottom:0rem;
    align-self:center;
    color: ${stationColor};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 2rem;


    }
`

export const WidgetButtonBlock = styled.div`
    align-self:center;
    width: 12.5rem;
    height: 4rem;
    display: inline-block;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    padding-right: 3rem;
`;

export const WidgetButtonContainer = styled.div`
    width: 25%;
    display: flex;
    justify-content: space-between;
`

export const ButtonText = styled.p`
    position: absolute;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
`
