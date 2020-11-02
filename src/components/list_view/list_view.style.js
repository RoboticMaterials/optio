import styled from 'styled-components'

export const Container = styled.div`
    background: ${props => props.theme.bg.secondary};
    display: flex;
    flex-direction: column;
    max-height: 100%;
`

export const ListTitle = styled.span`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    font-weight: 700;
    color: ${props => props.theme.bg.octonary};
`

export const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 100%;
    padding: 1rem;
    padding-top: 4rem;
    
`

export const ListScrollContainer = styled.ul`
    padding: 0;
    margin: 0;
    overflow-y: scroll;
`

export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: auto;
    height: 2.4rem;
    background: transparent;
    padding-bottom: 0.4rem;

 
`

export const ListItemRect = styled.div`
    height: 100%;
    width: 100%;

    border-radius: 0.5rem;
    text-align: center;

    cursor: pointer;
    user-select: none;

    border: 0.1rem solid white;
    box-sizing: border-box;

    &:hover {
        background: ${props => props.theme.bg.octonary};
    }

`

export const ListItemTitle = styled.div`
    height: 2rem;
    line-height: 2rem;
    box-sizing: border-box;
    width: 100%;
    margin-top: -0.1rem;
    padding-left: 1rem;
    padding-right: 1rem;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};
    
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        background: ${props => props.theme.schema[props.schema].gradient};
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        display:block;
    }
`

export const ListItemIcon = styled.i`
    margin-left: 1rem;
    font-size: 1.25rem;
    color: lightgreen;

    &:hover {
        cursor: pointer;
    }
`
