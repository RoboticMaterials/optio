import styled, {css} from "styled-components";

const HilButtonCss = css`
  border: none;

    border-radius: 1rem;
    box-shadow: 0 0.1rem 0.2rem 0rem #303030;
    height: 100%;
    min-height: 5rem;
    max-height: 7rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    transition: background-color 0.25s ease, filter 0.1s ease;
    background-color: ${props => props.color};

    margin-bottom: 2rem;

    filter: brightness(${props => props.filter});

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
        filter: brightness(85%);
    }

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        height: 9rem;
    }
`

export const HilButtonText = styled.p`
    color:  ${props => props.color};
    font-size: 2rem;
    margin: 0;
    padding: 0;
    filter: brightness(50%);
`


export const Container = styled.button`
    ${HilButtonCss};
    align-items: center;
    justify-content: center;

    //min-height: 5rem;
    //height: 5rem;
    //max-height: 5rem;
    //width: fit-content;
    display: flex;
    flex-direction: row;
    padding: 0rem 3rem;
    align-items: center;
    justify-content: center;
    ${props => props.disabled && "filter: grayscale(80%)"};
    
    ${props => props.css && props.css};
`

export const HilIcon = styled.i`
    display: flex;
    justify-content: center;
    align-items: center;
    //margin: auto auto;
    color:  ${props => props.color};
    fill: green;
    font-size: 2.5rem;
    filter: brightness(50%);
    margin-right: 1rem;
    &:hover {
        cursor: pointer;
    }

    &:active{
        filter: brightness(85%)
    }
`