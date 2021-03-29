import styled from 'styled-components'
import { hexToRGBA, LightenDarkenColor, RGB_Linear_Shade } from '../../../methods/utils/color_utils';


const backgroundColor = (props) => {
  if(props.secondary || props.disabled) {
    return props.theme.bg.senary;
  }

  else {
    if(props.tertiary) {
      return props.theme.bg.tertiary;
    }
    else {
       if(props.disabled) {
         return props.theme.disabled;
       }
       else {
         return props.theme.fg.primary;
       }
     }
  }


}
export const SmallButton = styled.button`
    display: inline-block;
    height: calc(${props => props.theme.fontSize.sz3} * 2.2);
    line-height: 1rem;
    text-align: center;
    vertical-align: middle;
    margin: 0.5rem;
    user-select: none;

    padding: 0.375rem 0.75rem;
    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;

    border-radius: calc(${props => props.theme.fontSize.sz3} * 0.3);
    color: ${props => props.secondary || props.disabled ? props.theme.bg.primary : (props.tertiary ? props.theme.fg.primary : props.theme.bg.octonary)};
    background-color: ${props => backgroundColor(props)};
    /*
    background-color: ${props => props.secondary || props.disabled ?
       (props.theme.bg.senary)
      :
      (props.tertiary ?
        props.theme.bg.tertiary
        :
        (props.disabled ? props.theme.disabled :  props.theme.fg.primary))};
    */

    border: none;

    white-space: pre;

    &:focus {
        outline: none;
        background-color: ${props => backgroundColor(props)};
        //background-color: ${props => props.secondary || props.disabled ? props.theme.bg.senary : (props.tertiary ? props.theme.bg.tertiary : props.theme.fg.primary)};
    }

    &:hover {
      background-color: ${props => props.disabled ? backgroundColor(props) : LightenDarkenColor(backgroundColor(props), 10)};
    }
`;
