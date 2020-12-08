import styled from "styled-components";
import {LightenDarkenColor} from "../../../../../../methods/utils/color_utils";
import Textbox from "../../../../../basic/textbox/textbox";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

export const SchemaIcon = styled.i`
    color: ${props => props.color};
    padding: 0;
    font-size: 2rem;
    margin: 0;
    height: fit-content;
    width: fit-content;
    // background: blue;

`

// ===== Delete Button ===== //
export const DeleteButtonIcon = styled(DeleteForeverIcon)`
    color: white;

    &:hover {
        color: ${LightenDarkenColor('#FFFFFF', -20)};
    }

    width: 5rem;
    height: 5rem;
  
`


export const ColorDropdownInnerContainer = styled.div`
    height: 100%;
    line-height: 100%;

    position: relative;
    width: 8rem;
    margin-right: 1rem;
    z-index: 0;
    // z-index: 100;
`

export const DeleteButton = styled.button`
    margin: 0;
    padding: 0;
    background: transparent;
    border: transparent;
    outline: none;
    z-index: 7;
    color: white;
    
    &:focus {
        outline: none;
    }

    width: 3rem;
    margin-left: 1rem;

   
`

export const RightContentContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.bg.senary};
    width: 8rem;
    border-left: 1px solid ${props => props.theme.bg.tertiary};
    // padding-left: 1rem;
    border-top-right-radius: 0.6rem;
    border-bottom-right-radius: 0.6rem;
`

export const TaskName = styled.span`

  font: ${props => props.theme.font.primary};
  font-size: ${props => props.theme.fontSize.sz3};

  color: ${props => props.theme.bg.tertiary};

`

export const TransparentTextBox = styled(Textbox)`
    background: rgba(0 ,0 ,0 , 0.2);
    border-bottom: 2px solid rgba(0 ,0 ,0 , 0.1);

    &:focus {
        background-color: rgba(0 ,0 ,0 , 0.3);
        border-bottom: 2px solid white;
        outline: none !important;
    }

    text-align: center;
`

export const CenterContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
`

export const DashboardEditButton = styled.div`
    height: 6rem;

    display: flex;
    flex: 1;
    flex-direction: row;
        
    background: ${props => `linear-gradient(180deg, 
                                ${LightenDarkenColor(props.color, 20)} 0%, 
                                ${props.color} 50%, 
                                ${LightenDarkenColor(props.color, -20)} 100%)`};
    border-top-left-radius: 0.6rem;
    border-bottom-left-radius: 0.6rem;
    overflow: visible;
        
    // margins
    // margin: 0 2rem 0.5rem 2rem;
        
    // padding
    padding: 0.5rem 1rem 0.5rem 1rem;
    
    outline: none;
    &:focus {
        outline: none;
    }

    letter-spacing: 1.5px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    
    outline: none;
    user-select: none;

    transition: transform 0.2s ease;

    cursor: grab;
    &:active {
        box-shadow: 2px 2px 2px rgba(0,0,0,0.5);
        transform: translateY(-2px);
        cursor: grabbing;
    }

}
`

export const Container = styled.div`
    height: 6rem;

    display: flex;
    flex-direction: row;
        
    border-radius: 0.6rem;
    overflow: visible;
        
    // margins
    margin: 0 2rem 0.5rem 2rem;
        
    outline: none;
    &:focus {
        outline: none;
    }

    letter-spacing: 1.5px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    
    outline: none;
    user-select: none;

    transition: transform 0.2s ease;

    cursor: grab;
    &:active {
        box-shadow: 2px 2px 2px rgba(0,0,0,0.5);
        transform: translateY(-2px);
        cursor: grabbing;
    }

}
`