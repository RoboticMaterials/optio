import styled from 'styled-components'

export const ContentContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;
    padding-top: 1.5rem;

    display: flex;
    flex-direction: column;

`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export const Header = styled.h1`
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: white;
    margin-top: 1rem;
`

export const Label = styled.h2`
    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
    color: white;
    margin-right: 1rem;
    line-height: 2rem;
`

export const HelpText = styled.h3`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.senary};
    text-align: center;
`

export const DirectionText = styled.h3`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.schema.tasks.solid};
    text-align: center;
`