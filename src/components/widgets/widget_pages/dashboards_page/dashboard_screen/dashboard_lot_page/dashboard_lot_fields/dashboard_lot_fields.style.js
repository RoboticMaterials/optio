import styled from "styled-components";

export const LotFieldsContainer = styled.div`
    height: fit-content;
    width: 100%;
    max-width: 50rem;
    background: ${props => props.theme.bg.primary};
    box-shadow: 2px 3px 2px 1px rgba(0,0,0,0.2);

    padding: 1rem;
    border-radius: .3rem;
    align-self: center;

    margin-bottom: 2rem;
`
