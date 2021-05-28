import styled from "styled-components";


export const Container = styled.div`
    width: 100%;
    max-width: 50rem;

    height: fit-content;
    min-height: 10rem;

    background: ${props => props.theme.bg.primary};
    box-shadow: ${props => props.theme.cardShadow};

    padding: 1rem;
    border-radius: .5rem;

    align-self: center;

`

export const Title = styled.h3`

`