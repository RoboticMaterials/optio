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

export const Text = styled.span`
    color: #6b6b6b;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
`

export const Icon = styled.i`
	padding: 0;
	margin: 0;
	font-size: 1.3rem;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
    color: ${props => props.theme.bg.primary};
`

export const UndoIcon = styled.i`

    position: absolute;

    font-size: 2rem;
    color: ${props => props.theme.fg.primary};
    cursor: pointer;
    z-index: 100;

    ${props => props.disabled &&
        `
        opacity: 0.3;
        cursor: default;
        pointer-events: none;
        `
    }

    ${props => 
        (props.isMobile ? 
            (props.isListView ?
                `top: 10.5rem; left: 1rem;`
                :
                `top: 9.5rem; left: 1rem;`
            )
            :
            (props.isListView ?
                `top: 11.5rem; left: 2rem`
                :
                `top: 8rem; left: 1rem;`
            )
        )

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