import styled from "styled-components";

export const ExpandContainer = styled.div`
    position: absolute;
    right: ${props => !!props.showTaskQ ? '20rem' : '0rem'};
    top: 0rem;
    bottom: 0rem;
    margin: auto;
    height: 15rem;
    width: 10rem;
    z-index: 10;
    /* border-radius: 1rem 0rem 0rem 1rem; */

    display: flex;
    align-items: center;

    /* background-color: ${props => props.theme.bg.quinary}; */


`

export const ExpandIcon = styled.i`
    z-index: 1;
    position: absolute;
    right: .5rem;
    font-size: 2rem;

    &:hover{
        cursor: pointer;
    }
`

export const ExpandSVG = styled.svg`
    position: absolute;
    top: 0rem;


    height: 100%;
    width: 100%;
`

export const ExpandPath = styled.path`
    background-color: ${props => props.theme.bg.quinary};

    &:hover{
        cursor: pointer;
    }
`

export const TaskQContatiner = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;

    position: absolute;
    top: 0rem;
    bottom: 0rem;
    right: 0rem;

    width: 20rem;

    background-color: ${props => props.theme.bg.quinary};

`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
`