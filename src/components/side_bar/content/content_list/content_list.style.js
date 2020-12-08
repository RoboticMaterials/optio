import styled from 'styled-components'
import { RGB_Linear_Shade, hexToRGBA } from '../../../../methods/utils/color_utils'


// ========== Content ========== //
export const Container = styled.div`
    flex-grow: 1;
    padding: 1rem;
    padding-top: 1.5rem;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    margin-right: .5rem;


`

export const Header = styled.div`
    display: flex;
    flex-direction: row;

`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
    flex-grow: 1;
    user-select: none;
`

// ========== List ========== //

export const List = styled.ul`
    flex-grow: 1;
    padding: 0;
`

export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: auto;
    height: 2.4rem;
    text-overflow: ellipsis;

    background: transparent;
    padding-bottom: .4rem;
    padding-right:1.5rem;

`

export const ListItemRect = styled.div`
    height: 100%;
    width: 100%;

    border-radius: 0.5rem;
    text-align: center;
    padding-right:0.5rem;
    cursor: pointer;
    user-select: none;

    border: 0.1rem solid white;
    box-sizing: border-box;

    &:hover {
        background: ${props => props.theme.bg.octonary};
    }

`

export const ListItemTitle = styled.div`
    text-align: left;
    height: 2rem;
    line-height: 2rem;
    box-sizing: border-box;
    width: 100%;
    margin-top: -0.1rem;
    padding-left: 2rem;
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
        color:green;
    }
`
