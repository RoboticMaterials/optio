import styled from 'styled-components'

import * as stylel from '../locations_content.style'

export const ContentContainer = styled(stylel.ContentContainer)`
`

export const DefaultTypesContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-bottom: 0.1rem solid ${props => props.theme.bg.septenary};
    justify-content: center;

    margin-top: 0.5rem;
    padding-bottom: 0.5rem;
`

export const LocationTypeLabel = styled.p`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.theme.bg.octonary};
    margin-bottom: auto;
    user-select: none;
    text-align: center;
`

export const LocationTypeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 8rem;
    // margin-right: 1rem;
    // background: blue;
`