import styled, { css } from "styled-components"

export const Container = styled.div`
    background: red;
    display: flex;
    align-self: stretch;
`

export const ProcessName = styled.span`
    color: ${props => props.theme.schema.lots.solid};
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: ${props => props.theme.fontWeight.bold};
`