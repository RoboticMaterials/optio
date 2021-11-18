import styled from "styled-components";
import { ModalContainerCSS, BodyContainerCSS } from '../../../../../../common_css/modal_css'

export const Container = styled(ModalContainerCSS)`
`

export const BodyContainer = styled(BodyContainerCSS)`
`

export const ColumnContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;
    padding-top: 1.5rem;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    margin-right: .5rem;
`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 1.7rem;
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

export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 3rem;
    text-overflow: ellipsis;
    justify-content: space-between;
    background: ${props => props.theme.bg.primary};
    padding: 0rem 1rem;

    border-radius: 0.3rem;
    border: 0.1rem solid;
    border-color: ${props => props.error ? 'red' : 'white'};
    box-shadow: ${props => props.theme.cardShadow};


    margin-bottom: .7rem;
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
    color: lightgreen;

    &:hover {
        cursor: pointer;
        color:green;
    }
`
