import styled from 'styled-components'
import { RGB_Linear_Shade, hexToRGBA } from '../../../../methods/utils/color_utils'
import * as commonCss from "../../../../common_css/common_css";
import Dropdown from "react-bootstrap/Dropdown";


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
    border: 0.1rem solid;
    border-color: ${props => props.error ? 'red' : 'white'};

    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.2);
    // cursor: pointer;

  ${props => props.isNew &&  commonCss.newGlow};

    margin-bottom: 0.6rem;


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
export const LocationTypeGraphic = styled.svg`
    height: 2rem;
`
export const ListItemTitle = styled.h1`

    font-family: ${props => props.theme.font.primary};
    /* font-size: ${props => props.theme.fontSize.sz3}; */
    font-size: 1rem;
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};
    user-select: none;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right:0.5rem;
    margin-bottom: 0rem;
    width: 75%;

    flex-grow: 1;
    margin-left: 1rem;
`

export const ListItemIcon = styled.i`

    font-size: 1.3rem;
    color: ${props => props?.schema ? props.theme.schema[props.schema].solid : props.theme.bg.quaternary};

    &:hover {
        cursor: pointer;
        // color:green;
    }
`

export const ListItemIconContainer = styled.div`
    position: relative;
    display: flex;

    flex-grow: 0;
`

export const ErrorContainer = styled.div`
	position: relative;
`

export const SortToggle = styled.span`
    font-size: 1rem;
    color: ${props => props.theme.bg.quinary};
    cursor: pointer;
`
export const SortContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`
