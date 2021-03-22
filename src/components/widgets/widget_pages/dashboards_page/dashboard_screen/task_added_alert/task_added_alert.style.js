import styled from "styled-components";

export const AddTaskAlertContainer = styled.div`
    position: fixed;
    flex-direction: column;
    text-align: center;

    background-color: ${props => props.theme.bg.secondary};
    opacity: 90%;
    border-radius: .3rem;
    min-width: 70%;
    max-width: 95%;
    margin-left: auto;
    margin-right: auto;
    box-shadow: .1rem .1rem .5rem grey;
    
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    
    padding-top: 1rem;  
    z-index: 10000;
`

export const AddTaskAlertLabel = styled.span`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: bold;
    color: ${props => props.color};
`

export const AddTaskAlertMessage = styled.p`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.color};
`