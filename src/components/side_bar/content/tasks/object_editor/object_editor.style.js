import styled, { css } from 'styled-components'
import { LightenDarkenColor } from '../../../../../methods/utils/color_utils'

export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: auto;
    height: 2.5rem;
    text-overflow: ellipsis;
    justify-content: space-between;
    background: ${props => props.theme.schema['objects'].solid};

    &:hover {
        background: ${props => LightenDarkenColor(props.theme.schema['objects'].solid, 10)};
    }

    margin-left: .5rem;
    margin-right: .5rem;
    margin-top: 0rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    border: 0.1rem solid;

    border-color: ${props => props.error ? props.theme.error : 'transparent'};



`
export const ObjectContainer = styled.div`
    display: flex;
    flex-grow: .5rem;

    flex-direction: column;
    margin-top: 0rem;
    margin-bottom: 1rem;
    padding-top: .2rem;
    background-color: ${props => props.theme.bg.primary};
    border-radius: 0.5rem;

    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.1);
`
export const QuantityInput = styled.input`
    margin-top: 1rem;
    align-self: flex-start;
    background-color: #6c6e78;
    color: white;
    border-radius: .5rem;
    text-align: center;
    max-width: 4rem;
    height: 2rem;
    font-size: 1rem;
    -webkit-appearance: none !important;
    &:focus{
        outline: 0 !important;
        border-color: #26ab76;
    }

    ::placeholder{
      color: ${props => props.theme.bg.senary};
    }
`

export const ScrollableContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
    width: 100%;
    max-height: 15rem;

    ::-webkit-scrollbar {
    }
    ::-webkit-scrollbar-thumb {
    }

`

export const CountInput = styled.input`
	width: fit-content;
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
    margin-left: 0.5rem;
    margin-right: 1rem;
    margin-bottom: 0rem;

    text-align: center;

`

export const ListItemIcon = styled.i`

    font-size: 1.3rem;
    color: ${props => props.theme.bg.primary};
    padding-left: 0.8rem;

    &:hover {
        cursor: pointer;
    }
`
export const RowContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;
    flex-direction: row;
    margin-bottom: .5rem;
    align-items: center;
`
export const HoverContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 80%;
    height: 100%;
    padding-top: .5rem;

    &:hover {
        cursor: pointer;
    }

`
export const ColumnContainer = styled.div`
    width: 100%
    justify-content: center;
    margin-bottom: .5rem;

`
