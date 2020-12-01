import styled from 'styled-components'
import { RGB_Linear_Shade, hexToRGBA } from '../../../../methods/utils/color_utils'


// ========== Content ========== //
export const ContentContainer = styled.div`
    flex-grow: 1;
    padding: 1rem;
    padding-top: 1.5rem;

    display: flex;
    flex-direction: column;

`

export const ContentHeader = styled.div`
    display: flex; 
    flex-direction: row;
`

export const ContentTitle = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.schema.locations};
    flex-grow: 1;
`

// ========== Location List ========== //

export const LocationList = styled.ul`
    flex-grow: 1;
    padding: 0;
`

export const LocationItem = styled.div`
    width: auto;
    height: 2rem;
    box-sizing: content-box;

    text-align: center;

    background: transparent;
    border-radius: 0.5rem;
    margin-bottom: 0.4rem;

    border: 0.1rem solid white;
    box-sizing: border-box;

    cursor: pointer;
    user-select: none;

    &:hover {
        background: ${props => props.theme.bg.octonary};
    }
`

export const LocationText = styled.span`
    height: 2rem;
    line-height: 2rem;
    box-sizing: content-box;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};

    ${props => props.selected && `
        background: ${props.theme.schema.locations};
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        display:block;
    `}
`

// ========== Type Buttons & Containers ========== //

export const DefaultTypesContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-bottom: 0.1rem solid ${props => props.theme.bg.septenary};
    justify-content: center;

    margin-top: 0.5rem;
    padding-bottom: 0.5rem;
`

export const CustomTypesContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    margin: 0.5rem 0 0.5rem 0;
    justify-content: center;
`

export const LocationTypeButton = styled.div`
    height: 4rem;
    width: 6rem;
    border-radius: 0.5rem;

    background: ${props => props.isSelected ? `rgba(0,0,0,0.2)` : props.isNotSelected ? 'lightgray' :  props.theme.bg.octonary};

    margin: 0.5rem;
    position: relative;
    opacity: 0.999;

    box-shadow: ${props => props.isSelected ? `inset 0 0.1rem 0.2rem rgba(0,0,0,.39), 0 -0.1rem 0.1rem rgba(255,255,255,0.1), 0 0.1rem 0 rgba(255,255,255,0.1)` : `0 0.2rem 0.3rem 0rem rgba(0,0,0,0.3)`};
`
export const LocationTypeGraphic = styled.svg`
    height: 3.5rem;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    fill: ${ props=> props.isNotSelected && 'gray'};
    stroke: ${ props=> props.isNotSelected && 'gray'};
`

export const LocationTypeLabel = styled.p`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.theme.bg.octonary};
    margin-bottom: auto;
    user-select: none;
    text-align: center;
`

export const LocationTypeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 10rem;
    // margin-right: 1rem;
    // background: blue;
`

export const Label = styled.h3`
    font-family: ${props => props.theme.font.primary};
    font-size: 1.5rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
    user-select: none;
    text-align: center;
`