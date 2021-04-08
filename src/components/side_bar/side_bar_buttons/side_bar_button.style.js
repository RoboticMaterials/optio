import styled from 'styled-components';
import { hexToRGBA, LightenDarkenColor } from '../../../methods/utils/color_utils';

export const SideBarButtonWrapper = styled.div`

    // background-color: ${props => props.mode == props.currentMode && props.theme.bg.primary};
    // box-shadow: ${props => props.mode == props.currentMode && '0px 5px 15px 8px rgba(0,0,0,0.05)'};

    width: 5rem;
    height: 5rem;
    border-radius: 2.5rem;

    margin-top: 0.6rem;
`

export const SideBarButtonIcon = styled.i`
    font-size: 1.8rem;
    padding: 1rem;
    cursor: pointer;
    display: flex;
    flex-direction:column;
    align-items: center;

    /* THIS METHOD OF USING GRADIENTS DOES NOT WORK ON SAFARI */
    // You cant stack a color on a gradient, but you CAN stack a gradient on a gradient
    /* background: ${props => props.mode == props.currentMode ?
        props.theme.schema[props.mode].solid
        :
        props.theme.bg.quaternary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; */


    color: ${props => props.mode == props.currentMode ?
        props.theme.schema[props.mode].solid
        :
        props.theme.bg.quaternary};;

    transition: color 0.15s ease;

    &:hover{
        /* background: ${props => `linear-gradient(rgba(255,255,255,0.2),rgba(255,255,255,0.2)), ` + props.theme.schema[props.mode].gradient}; */
        /* -webkit-background-clip: text; */
        /* -webkit-text-fill-color: transparent; */
        color:${props => props.theme.schema[props.mode].solid};
    }

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 2rem;
        padding: 1rem;


    }
`
export const SideBarButtonText = styled.h1`
  padding-top:.3rem;
  font-family: ${props => props.theme.font.primary};
  font-weight: 500;
  font-size: 0.8rem;
  color: ${props => props.theme.schema.locations};
  text-align: center;

  @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
      font-size: .7rem;

`
