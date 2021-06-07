import styled, { css } from "styled-components"

const transitionTime = '.5s'

export const Container = styled.div`
    display: flex;
    align-items: center;
    transition: all ease ${transitionTime};
    box-shadow: 0px 5px 5px rgba(0,0,0,0.2);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: .3rem;
`
// box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
// box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

// ,

export const StationsContainer = styled.div`
    display: flex;

    padding: 1rem 0;
`

export const NameContainer = styled.div`
    align-self: stretch;
    padding: .5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;  
`

export const ProcessName = styled.span`
    color: ${props => props.theme.schema.lots.solid};
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: ${props => props.theme.fontWeight.bold};
    white-space: nowrap;
`