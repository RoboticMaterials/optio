import styled, { css } from 'styled-components'

import { hexToRGBA } from '../../../methods/utils/color_utils'


export const Container = styled.div`
    position: absolute;
    padding: inherit;
    z-index: 1;

    top: 5rem;
    bottom: 1rem;
    left: 1rem;
    right: ${props => !!props.taskQueueOpen ? '21rem' : '1rem'};


    display: flex;
    flex-direction: column;

    /* // styles when showWidgetPage is true */;
    visibility: ${props => !!props.showWidgetPage ? 'visible' : 'hidden'};

    opacity: ${props => !!props.showWidgetPage ? '100%' : '0%'};
    transition-delay: .2s;
    transition-property: opacity;
    transition-duration: .25s;
    transition-timing-function: ease;


    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        top: 5rem;
        bottom: .5rem;
        left: .5rem;
        right: .5rem;
    }

`

export const WidgetPageContainer = styled.div`
    height: 100%;
    width: 100%;
    z-index: 3;
    position: relative;

    border-radius: 1rem;
    box-shadow: 0 0.2rem 0.4rem 0rem #303030;
    // background-color: transparent;
    background-color: ${props => props.theme.bg.primary};

    overflow: hidden;

    cursor: default;
    /* transition: all 2s ease; */
`

export const WidgetsContainer = styled.div`
    position: relative;
    display: flex;

    margin: .5rem 0;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        margin: 0;
    }
`
