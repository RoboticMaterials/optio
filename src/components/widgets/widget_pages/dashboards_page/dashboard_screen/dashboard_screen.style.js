import styled from "styled-components";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {RGB_Linear_Shade, hexToRGBA} from "../../../../../methods/utils/color_utils";

export const Container = styled.div`
    
    // flex layout
    display: flex;
    flex-direction: column;
    
    width: 100%;
    height: 100%;
    max-height: 100%;
    // overflow: hidden;
    
    background: ${props => props.theme.bg.secondary};
    
`

export const ButtonContainer = styled.div`


`

export const UndoIcon = styled.i`

    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;

    font-size: 2rem;
    color: ${props => props.theme.fg.primary};
    cursor: pointer;
    z-index: 100;

    ${props => props.disabled &&
        `
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
        `
    }
    
`


export const GoBackButton = styled(ArrowBackIosIcon)`
    color: ${props => props.theme.fg.primary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz1};
    
    transition: all .25s;
    &:hover {
        color: ${props => RGB_Linear_Shade(props.theme.hoverHighlightPer, hexToRGBA(props.theme.fg.primary))};
        cursor: grab;
    }
    margin-left: 1rem;
    
`