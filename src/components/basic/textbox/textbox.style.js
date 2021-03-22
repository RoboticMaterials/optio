import styled from 'styled-components'
import { hexToRGBA, LightenDarkenColor } from '../../../methods/utils/color_utils'

export const TextboxContainer = styled.div`
    ${props => props.flex &&
        `
        display: flex;
        flex-grow: 1`
    }

    padding: 0;
    margin: 0;

    position: relative;
`


export const TextboxLabel = styled.h1`
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.octonary};
    margin-top: .6rem;
    margin-right: 0.5rem;
    line-height: 1rem;
`;

export const TextboxInput = styled.input`
    background-color: ${props => props.theme.bg.secondary};
    border: none;
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;
    display: flex;
    flex-grow: 1;
    color: ${props => props.theme.bg.octonary};

    box-shadow: 0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1) !important;
    border-bottom: 2px solid ${props => props.theme.bg.secondary};

    &:focus {
        border-bottom: 2px solid ${props => !!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
        color: ${props => props.theme.bg.octonary};
        outline: none !important;
    }

    &::placeholder {
        font-family: ${props => props.theme.font.secondary};
        color: ${props => props.theme.bg.senary};
    }
`;

export const TextboxArea = styled.textarea`
    background-color: ${props => props.theme.bg.secondary};
    border: none;
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;
    display: flex;
    flex-grow: 1;
    color: ${props => props.theme.bg.octonary};

    box-shadow: 0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1) !important;
    border-bottom: 2px solid ${props => props.theme.bg.secondary};

    &:focus {
        background-color: ${props => LightenDarkenColor(props.theme.bg.secondary, 3)};
        border-bottom: 2px solid ${props => !!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
        color: ${props => props.theme.bg.octonary};
        outline: none !important;
    }

    &::placeholder {
        font-family: ${props => props.theme.font.secondary};
        color: ${props => props.theme.bg.senary};
    }
`;
