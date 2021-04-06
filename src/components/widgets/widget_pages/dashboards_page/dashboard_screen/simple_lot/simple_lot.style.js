import styled from "styled-components";

export const LotItem = styled.div`
    align-items: center;
    justify-content: center;
    height: 2.3rem;
    color: black;
    font-size: 1.4rem;
    white-space: nowrap;

    width: auto;
    background: white;

    padding-right:.5rem;
    padding-left:.5rem;
    margin-right:.5rem;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;

    border-radius: 0.5rem;
    border: 0.1rem solid;
    border-color: ${props => props.error ? 'red' : 'white'};
    box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.1);


`