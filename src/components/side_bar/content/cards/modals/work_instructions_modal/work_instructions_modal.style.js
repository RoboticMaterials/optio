import styled from "styled-components";
import { ModalContainerCSS, BodyContainerCSS } from '../../../../../../common_css/modal_css'
import { hexToRGBA, LightenDarkenColor } from '../../../../../../methods/utils/color_utils'

export const Container = styled(ModalContainerCSS)`
`

export const BodyContainer = styled(BodyContainerCSS)`
`

export const ColumnContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    margin-right: .5rem;
`

export const FileContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 1.7rem;
    margin: 1rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
`

export const CloseButton = styled.i`
    position: absolute;
    top: 0rem;
    right: 1rem;
    font-size: 1.5rem;
    margin: 1rem;
    color: ${props => props.theme.bg.senary};
`
export const SelectedFileDiv = styled.div`
    font-size: 1.5rem;
    border: 0.1rem solid transparent;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    max-width: 4.5rem;
    background: ${props => props.theme.schema['ok'].solid};
`

export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: auto;
    height: 6rem;
    text-overflow: ellipsis;
    justify-content: space-between;
    background: ${props => props.theme.bg.primary};
    padding-right: .5rem;

    border-radius: 0.5rem;
    border: 0.1rem solid;
    border-color: ${props => props.error ? 'red' : 'white'};

    box-shadow: ${props => props.theme.cardShadow};
    // cursor: pointer;

    margin-bottom: .7rem;

    &:hover {
      //box-shadow: 1px 1px 2px 2px rgba(0,0,0,0.15);
    }
`

export const UploadButton = styled.div`
    display: flex;
    align-items: center;
    height: 100%;

    border: 0.1rem solid transparent;
    border-radius: 0.5rem;

    box-shadow: 1px 2px 2px 2px rgba(0,0,0,0.15);
    max-width: 10rem;

    text-overflow: ellipsis;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    margin-right: 1rem;
    padding: 0.2rem;
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

export const StatusText = styled.h1`

    font-family: ${props => props.theme.font.primary};
    /* font-size: ${props => props.theme.fontSize.sz3}; */
    font-size: .9rem;
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};
    user-select: none;
    margin-right: 0.3rem;
    margin-top: 0.15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const ListItemIcon = styled.i`
    font-size: 1.7rem;
    color: #924dff;

    &:hover {
      cursor: pointer;
    }

`
