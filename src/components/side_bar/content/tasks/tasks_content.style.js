import styled from 'styled-components'
import { LightenDarkenColor } from '../../../../methods/utils/color_utils'

export const ContentContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;

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
    color: ${props => props.theme.bg.primary};

    &:hover {
        cursor: pointer;
    }

`

export const Card = styled.div`
    background: ${props => props.dark ? props.theme.bg.tertiary : props.theme.bg.secondary};
    // box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.1);
    padding: 0.5rem;
    border-radius: 0.4rem;

    margin-bottom: 0.5rem;
    margin-top: 0.5rem
`

export const ItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    align-items: center;

    padding: 0.8rem;


`

export const Icon = styled.i`
    font-size: 1.4rem;
    color: ${props => props.theme.textColor};

    &:hover {
        cursor: pointer;
    }
`
export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: auto;
    height: 2.5rem;
    text-overflow: ellipsis;
    justify-content: space-between;
    background: ${props => props.theme.schema['objects'].solid};

    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    border: 0.1rem solid;

    border-color: ${props => props.error ? props.theme.error : 'transparent'};


`
export const ListItemTitle = styled.h1`

    font-family: ${props => props.theme.font.primary};
    /* font-size: ${props => props.theme.fontSize.sz3}; */
    font-size: 1rem;
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};
    user-select: none;
    width: 10rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 0.5rem;
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
    color: ${props => props.theme.textColor};
    margin-top: 1rem;
`

export const Label = styled.h2`
    font-size: 0.9rem;
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.textColor};
    margin-right: 1rem;
    line-height: 2rem;
`

export const LabelHighlight = styled.span`
    font-size: 1.2rem;
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.schema.tasks.solid};
    line-height: 2rem;
    font-weight: bold;

`

export const HelpText = styled.h3`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.quinary};
    text-align: center;
`
export const ObjectEditorText = styled.h3`
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.textColor};
    text-align: center;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 1.2rem;
    padding-top: 0.4rem;

`

export const DirectionText = styled.h3`
    font-size: 1rem;
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.schema.tasks.solid};
    text-align: center;
`

export const DualSelectionButton = styled.button`
    font-size: 1rem;
    width: 8rem;
    border: none;
    font-family: ${props => props.theme.font.primary};

    color: ${props => props.selected ? props.theme.bg.octonary : props.theme.bg.quinary};

    background-color: ${props => props.selected ? props.theme.schema.tasks.solid : props.theme.bg.tertiary};

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
