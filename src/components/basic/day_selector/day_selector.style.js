import styled from 'styled-components'

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    // width: 100%;
    min-width: 25rem;
    max-width: 45rem;
`

export const DateSelectorIcon = styled.i`
    font-size: 1.5rem;
    margin-right: 1rem;
    margin-left: 1rem;
    color: ${props => props.theme.bg.septenary};

    &:hover{
        cursor:pointer;
    }
`

export const DateSelectorTitle = styled.h1`
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.septenary};

    margin: 0rem .5rem;

`
export const LoadingIcon = styled.i`
    font-size: 1.5rem;
`