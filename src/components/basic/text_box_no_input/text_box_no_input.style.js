import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
    border-width: thin;
    border-color: black;
    border-style: solid;
    width: 20rem;
    padding-left: .5rem;
    padding-right: .5rem;
    text-align: center;
    background-color: ${props => props.theme.bg.secondary};

    font-family: ${props => props.theme.font.primary};
    font-weight: 400;
    font-size: ${props => props.theme.fontSize.sz3};
    cursor: default;



`;
