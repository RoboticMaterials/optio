import styled from 'styled-components'

export const Container = styled.div`
    width: 100;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid ${props => props.theme.bg.secondary};

    position: relative;
    display: flex;
    flex-direction: row;
`

export const InfoContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`

export const Label = styled.span`
    align-self: flex-start;
    
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.warning ? props.theme.okay : props.theme.fg.primary};
    cursor: pointer;

`

export const Description = styled.span`
    align-self: flex-start;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    color: ${props => props.theme.bg.senary};
    cursor: pointer;
    white-space: pre-line;

`

export const WarningIcon = styled.i`
    margin-left: 1rem;
    color: ${props => props.theme.okay};
    z-index: 10;
    font-size: 1.2rem;
`

export const OptionsContainer = styled.div`

`

export const OptionButton = styled.button`
    border: none;
    background: ${props => props.theme.bg.primary};
    margin-right: 1.4rem;
    color: ${props => props.theme.fg.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    &:focus {outline:0;}

    height: 100%;
    line-height: 100%;
`