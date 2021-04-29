import styled from "styled-components";

export const LotFieldsContainer = styled.div`
    height: fit-content;
    width: 30rem;
    background: ${props => props.theme.bg.primary};
    box-shadow: ${props => props.theme.cardShadow};

    padding: 1rem;
    border-radius: .5rem;
    align-self: center;
`