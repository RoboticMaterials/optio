import styled from "styled-components";


export const ButtonContainer = styled.div`

    width: 95%;
    max-width: 50rem;
    align-self: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const Button = styled.div`
    max-width: 50rem;
    width: 100%;

    min-height: 5rem;
    max-height: 15rem;
    background-color: ${props => props.color};

    border-radius: .5rem;

    margin: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    box-shadow: ${props => props.theme.cardShadow};

`

export const ButtonText = styled.p`
    margin-bottom: 0rem;
    margin-right: 1rem;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: bold;

`

export const ButtonIcon = styled.i`
    font-size: ${props => props.theme.fontSize.sz2};


`