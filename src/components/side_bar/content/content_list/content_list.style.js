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
    height: 3rem;
    text-overflow: ellipsis;
    justify-content: space-between;

    background: transparent;
    padding: 0rem 1rem;

    border-radius: 0.5rem;
    border: 0.1rem solid white;

    margin-bottom: 1rem;


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

export const ListItemTitle = styled.h1`

    font-family: ${props => props.theme.font.primary};
    /* font-size: ${props => props.theme.fontSize.sz3}; */
    font-size: 1rem;
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    margin-bottom: 0rem;
    width: 75%;
`

export const ListItemIcon = styled.i`
    
    font-size: 1.3rem;
    color: lightgreen;


    &:hover {
        cursor: pointer;
        color:green;
    }
`

export const ListItemIconContainer = styled.div`
    display: flex;
    width: 10%;

`
