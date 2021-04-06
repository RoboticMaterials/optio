import styled from "styled-components";

export const ExpandContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    right: ${props => !!props.showTaskQ ? '20rem' : '0rem'};
    top: 0rem;
    margin: auto;
    height: 10rem;
    width: 10rem;
    /* z-index: ${props => props.showTaskQ ? 20 : 10}; */
    z-index: 15;
    /* border-radius: 1rem 0rem 0rem 1rem; */

    justify-content: center;

`

export const ExpandIcon = styled.i`
    z-index: 1;
    position: absolute;
    right: .5rem;
    top: ${props => !!props.mapViewEnabled ? '4rem' : '9rem'};
    font-size: 2rem;

    &:hover{
        cursor: pointer;
    }
`

export const ExpandSVG = styled.svg`
    align-items: center;
    position: absolute;
    z-index: auto;
    top: ${props => !!props.mapViewEnabled ? '0rem' : '5rem'};


    height: 100%;
    width: 100%;
`

export const ExpandPath = styled.path`
    background-color: ${props => props.theme.bg.primary};

    &:hover{
        cursor: pointer;
    }
`

export const TaskQContatiner = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;
    z-index: ${props => props.showTaskQ ? 20 : 10};

    position: absolute;
    top: 0rem;
    bottom: 0rem;
    right: 0rem;

    /* width: 20rem; */
    width: 100%;

    background-color: ${props => props.theme.bg.primary};

`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
`

export const CloseButton = styled.i`
    position: absolute;
    top: 0rem;
    right: 1rem;
    font-size: 2.5rem;
    margin: 1rem;
    color: ${props => props.theme.fg.red};
`
