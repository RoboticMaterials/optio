import styled from "styled-components";

export const LotFieldsContainer = styled.div`
    height: fit-content;
    width: 100%;
    max-width: 50rem;
    background: ${props => props.theme.bg.primary};
    box-shadow: ${props => props.theme.cardShadow};

    padding: 1rem;
    border-radius: .5rem;
    align-self: center;

    margin-bottom: 2rem;
`