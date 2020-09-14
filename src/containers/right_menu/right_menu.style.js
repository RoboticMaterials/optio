import styled from 'styled-components';

import { hexToRGBA } from '../../methods/utils/color_utils'

export const NotificationsContainer = styled.div`
    display: flex;
    flex-direction: column;

    position: absolute;
    top: 4rem;
    right: 0;

    padding: 0.5rem;
    padding-top: 0rem;

    align-items: center;

    width: 20rem;
    height: auto;
    max-height: ${props => props.windowHeight};
    /* max-height: 10rem; */

    box-shadow: -6px 6px 6px 0px rgba(0,0,0,0.3);

    background: ${props => hexToRGBA(props.theme.bg.septenary, 0.97)};

    border-radius: 0 0 0 1rem;

    z-index: 1;

    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }

`

export const ClearText = styled.p`
    color: ${props => props.theme.bg.quaternary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    margin-bottom: 0rem;
    user-select: none; /* Standard */
    &:hover {
        cursor: pointer;
    }
`

export const NotificationTypeTitle = styled.p`
    color: ${props => props.theme.bg.senary};
    font-weight: 600;
    font-size: 1.3rem;
    font-family: ${props => props.theme.font.primary};
    user-select: none; /* Standard */

`

export const NotificationTypeContainer = styled.div`
    width: 100%;
    padding-left: 1rem;
    position: relative;
`

export const NotificationMinimizeIcon = styled.i`
    position: absolute;
    right: 1rem;
    top: 0rem;
    color: ${props => props.theme.bg.octonary};

    &:hover {
        cursor: pointer;
    }
`

export const NotificationDisplayContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

export const NewNotificationContainer = styled.div`
    display: flex;
    position: absolute;
    top: 5rem;
    right: .5rem;
`

export const ToggleContainer =styled.div`
    display: flex;
    width: 100%;
    justify-content: center;

    margin: .5rem .5rem;
`

export const ToggleButton = styled.div`
    width: 50%;
    display: flex;
    justify-content: center;
    color: ${props => props.theme.fg.primary};
    font-size: 1rem;

    user-select: none; /* Standard */
    background-color: ${props => props.selected == props.type ? props.theme.bg.senary : props.theme.bg.septenary};
    color: ${props => props.selected == props.type ? props.theme.bg.septenary : props.theme.bg.quaternary};

    height: 1.8rem;
    line-height: 1.9rem;

    &:hover{
        cursor: pointer;
    }
`

export const Title = styled.h1`
    margin-top: 1rem;
    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
`