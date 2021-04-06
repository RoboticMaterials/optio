import styled, { css } from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;

`

export const HeaderBar = styled.div`
    
    width: 100%;
    height: 5rem;
    background-color: ${props => props.theme.bg.secondary}
`