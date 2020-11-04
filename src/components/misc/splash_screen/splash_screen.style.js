import styled from 'styled-components'

export const SwitchContainer = styled.div`
    display: flex;
    alignItems: center;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
`

export const SwitchContainerLabel = styled.span`
    padding: 0;
    margin: 0;
    align-self: center;
`