import styled from "styled-components";

import { LightenDarkenColor } from '../../../methods/utils/color_utils'

export const NotificationContainer = styled.div`
    width: 19rem;
    background: ${props => LightenDarkenColor(props.theme.bg.senary, 45)};
    margin-bottom: 1rem;
    border-radius: 0.35rem;
    
    position: relative;
    display: flex;
    flex-direction: column;

    &:hover {
        cursor: pointer;
    }
`;

export const NotificationHeader = styled.div`
    height: 1.4rem;
    width: 100%;

    display: flex;
    flex-direction: row;

    background: ${props => LightenDarkenColor(props.theme.bg.senary,25)};

    border-radius: 0.35rem 0.35rem 0 0;
`

export const NotificationTypeText = styled.h3`
    color: ${props => props.theme.bg.quaternary};
    font-weight: 600;
    font-size: ${props => props.theme.fontSize.sz5};
    font-family: ${props => props.theme.font.primary};
    user-select: none; /* Standard */

    line-height: 1.4rem;
    padding-left: 0.5rem;

    flex-grow: 1;
`

export const NotificationDateTime = styled.h4`
    color: ${props => props.theme.bg.quaternary};
    font-weight: 400;
    font-size: ${props => props.theme.fontSize.sz5};
    font-family: ${props => props.theme.font.primary};

    line-height: 1.4rem;
    padding-right: 0.5rem;
`

export const NotificationBody = styled.div`
    flex-grow: 1;
    padding: 0.5rem;
`

export const NotificationLabel = styled.h4`
    color: ${props => props.theme.bg.tertiary};
    font-weight: 550;
    font-size: ${props => props.theme.fontSize.sz5};
    font-family: ${props => props.theme.font.primary};
    user-select: none; /* Standard */
`

export const NotificationMessage = styled.h5`
    color: ${props => props.theme.bg.quaternary};
    font-size: ${props => props.theme.fontSize.sz6};
    font-family: ${props => props.theme.font.primary};
    user-select: none; /* Standard */
`

export const ClearNotification = styled.i`
    /* position: absolute; */
    right: 0.5rem;
    top: 1.5rem;
    font-size: ${(props) => props.theme.fontSize.sz2};

    display: flex;
    flex-grow: 1;

    &:hover {
        cursor: pointer;
    }
`;