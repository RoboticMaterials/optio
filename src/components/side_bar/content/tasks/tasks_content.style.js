import styled from 'styled-components'

export const ContentContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;
    padding-top: 1.5rem;

    display: flex;
    flex-direction: column;

`
export const ObjectContainerBackground = styled.div`
    width: 100%
    padding: 1rem;
    padding-top: 1.5rem;

    display: flex;
    flex-direction: column;
    background-color: #26ab76

`
export const ListItemIcon = styled.i`
    font-size: 1.3rem;
    color: white;
    padding-left: 0.8rem;
    flex:1;

`
export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: auto;
    height: 2.5rem;
    text-overflow: ellipsis;
    background: #26ab76;
    margin-left: .5rem;
    margin-right: .5rem;
    margin-top: 0rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    border: 0.1rem solid;

    border-color: ${props => props.error ? 'red' : '#26ab76'};

    // border-color: ${props => props.isNew ? 'blue' : '#26ab76'};


`
export const ListItemTitle = styled.h1`

    font-family: ${props => props.theme.font.primary};
    /* font-size: ${props => props.theme.fontSize.sz3}; */
    font-size: 1.2rem;
    font-weight: 500;
    flex:5;
    color: ${props => props.theme.bg.octonary};
    user-select: none;
    width: 10rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0rem;
`
export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
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

export const LabelHighlight = styled.span`
    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.schema.tasks.solid};
    line-height: 2rem;
    font-weight: bold;

`

export const HelpText = styled.h3`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: white;
    text-align: center;
`

export const DirectionText = styled.h3`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.schema.tasks.solid};
    text-align: center;
`

export const DualSelectionButton = styled.button`
    font-size: 1rem;
    width: 8rem;
    border: none;
    font-family: ${props => props.theme.font.primary};

    color: ${props => !props.selected ? props.theme.bg.tertiary : props.theme.bg.octonary};

    background-color: ${props => props.selected ? props.theme.schema.tasks.solid : props.theme.bg.octonary};

    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    &:hover{
        //background-color: ${props => props.theme.bg.quaternary};
    }
`
