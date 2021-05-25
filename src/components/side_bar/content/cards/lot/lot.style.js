import styled, { css } from "styled-components";

import { rowCss } from "../card_editor/lot_editor.style";
import * as commonCss from "../../../../../common_css/common_css";
import { commonClickableIcon, commonIcon, glow, iconButtonCss } from "../../../../../common_css/common_css";
import { hexToRGBA, LightenDarkenColor } from '../../../../../methods/utils/color_utils'

export const Container = styled.div`
 	margin: 10px; // prevents glow from being cut off
  height: fit-content;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // overflow: hidden;
      
  background: ${props => props.theme.bg.primary};
  border-radius: 0.4rem;
  color: ${props => props.theme.bg.octonary};

  outline: none;
  &:focus {
      outline: none;
  }

  // letter-spacing: 1.5px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);
  
  outline: none;
  user-select: none;

  transition: all 0.2s ease;

  cursor: pointer;

  &:active{
        box-shadow: none;
        filter: brightness(85%);
        cursor: grabbing;
    }

  &:hover {
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }

  ${props => props.isSelected && `box-shadow: 0px 0px 2px 3px ${hexToRGBA(props.theme.schema.lots.solid, 0.7)} !important;`}
  
  // ${props => (props.selectable && !(props.isSelected || props.isFocused)) && notSelectedCss};
  // ${props => props.glow && glowCss};
  // ${props => props.isFocused && focusedCss};
  // ${props => props.isSelected && selectedCss};
  // ${props => props.containerStyle};
  
  max-width: 30rem;
`

const selectedCss = css`
`

const glowCss = css`
    // border: 4px ridge #478fe6;
`

const focusedCss = css`

  background-color: ${props => LightenDarkenColor(props.theme.bg.primary, -10)};

  &:active {
    transform: translateY(-2px);
  }

  &:hover {
    transform: translateY(-2px);
  }
`

const notSelectedCss = css`
  // filter: contrast(50%);
`

export const Row = styled.div`
    display: flex;
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.bg.quaternary};
    justify-content: space-between;
    padding: .25rem 0 .25rem 0;
`

export const ContentContainer = styled.div`
	padding: 0.5rem .25rem 0rem .25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const NameContainer = styled.div`
	display: flex;
  flex-direction: column;
`

export const CardName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 1.1rem;
  font-family: ${props => props.theme.font.primary};
`

export const LotNumber = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${props => props.theme.fontSize.sz4};
  color: ${props => props.theme.bg.octonary};
  font-weight: 300;
  

  background: ${props => props.theme.bg.secondary};
  border-radius: 1rem;
  width: fit-content;
  padding: 0rem 0.7rem;
  align-content: center;
  justify-content: center;
`


export const Count = styled.span`
	font-size: ${props => props.theme.fontSize.sz4};
`

export const LotName = styled.span`
  font-size: 1rem;
  //overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FooterBar = styled.div`
	height: fit-content;
	background: ${props => props.theme.bg.septenary};
	// background: ${props => props.color};
	display: flex;
	justify-content: space-between;
	padding: 0 1rem 0 1rem;
  font-size: ${props => props.theme.fontSize.sz4};
`

const notSelectedFlagCss = css`
    filter: contrast(40%);
    //filter: brightness(50%);
`

export const FlagButton = styled.button`
	  ${iconButtonCss};
  	${commonClickableIcon};
  	margin: 0.2rem 0.5rem;
    list-style: none;
    font-size: 1.5rem;
    cursor: pointer !important;
`

export const FlagsContainer = styled.div`
    display: flex;
    padding: 0.5rem 0.2rem;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

export const HeaderBar = styled.div`
	display: flex;
  flex-direction: column;

  padding: 0.5rem 0.5rem;
`










export const Label = styled.span`
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 600;
`
