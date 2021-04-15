import styled, { css } from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

export const Label = styled.p`
    margin: 0;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    user-select: none;
    margin-right: .5rem;
    white-space: nowrap;
`