import styled, { css } from "styled-components";

import { rowCss } from "../card_editor/lot_editor.style";
import * as commonCss from "../../../../../common_css/common_css";
import { commonClickableIcon, commonIcon, glow, iconButtonCss } from "../../../../../common_css/common_css";
import { hexToRGBA, LightenDarkenColor } from '../../../../../methods/utils/color_utils'

export const Container = styled.div`
 	margin: 10px;
  height: fit-content;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${props => !props.disabled ? props.theme.bg.primary : props.theme.bg.tertiary};
  ${props => props.disabled && 'opacity: 0.7;'}
  color: ${props => props.theme.bg.octonary};
  outline: none;
  &:focus {
      outline: none;
  }

  outline: none;
  user-select: none;
  cursor: ${props => props.clickDisabled ? 'auto' : 'pointer'};
  pointer-events: ${props => props.clickDisabled ? 'none' : 'auto'};

  box-shadow: 2px 3px 2px 1px rgba(0,0,0,0.2);
  // border: 0.15rem solid ${props => props.isInProgress ? props.theme.fg.primary : 'transparent'};

  &:active{
        box-shadow: none;
        filter: brightness(100%);
        cursor: grabbing;
    }

  &:hover {
    box-shadow: 2px 5px 5px 2px rgba(0,0,0,0.2);
  }

  ${props => props.isSelected && `box-shadow: 0px 0px 2px 3px ${hexToRGBA(props.theme.schema.lots.solid, 0.7)} !important;`}


  max-width: 30rem;

`

const selectedCss = css`
`

const glowCss = css`
    // border: 4px ridge #478fe6;
`

const focusedCss = css`

`

const notSelectedCss = css`
  // filter: contrast(50%);
`

export const LotFamilyContainer = styled.div`
${commonCss.rowContainer}
flex-wrap: wrap;
justify-content: center;
width: 100%;
overflow: auto;
`

export const Row = styled.div`
    display: flex;
    width: 100%;
    border-bottom: 1px solid ${props => props.theme.bg.quaternary};
    justify-content: space-between;
    padding: .25rem 0 .25rem 0;
`
export const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 10rem;
    padding: 0.4rem;
    background-color: ${props => !!props.disabled ? props.theme.bg.primary : props.theme.bg.tertiary};
    border-radius: 0rem 0rem 0rem .3rem;
    justify-content: center;
    align-content: center;
    z-index: 1;

`
export const PartsRow = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0rem 0 .25rem 0;
    z-index: 1;
`

export const PartContainer = styled.div`
    display: flex;
    height: 2.4rem;
    width: 9rem;
    margin-left: .2rem;
    margin-top: .2rem;
    padding-top: .5rem;
    margin-bottom: 0.1rem;

    justify-content: center;
    z-index: 1;
    pointer-events: auto;
    background: #F92644;
    border-radius: 0.4rem;
    color: ${props => props.theme.bg.primary};

    &:hover {
      cursor: pointer;
      background: #ff4545;

    }
`

export const PartName = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: .9rem;
  font-family: ${props => props.theme.font.primary};
  justify-content: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`


export const ContentContainer = styled.div`
	padding: 0.5rem .5rem 0rem .5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;

  ${props => !props.hasLeadTime && `margin-bottom: 0.5rem;`}
`

export const NameContainer = styled.div`
	display: flex;
  flex-direction: column;
`

export const CardName = styled.span`
  white-space: nowrap;
  white-space: pre-line !important;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 1.1rem;
  font-family: ${props => props.theme.font.primary};
  flex-grow: 1;
`

export const LotNumber = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${props => props.theme.fontSize.sz4};
  color: ${props => props.theme.bg.octonary};
  font-weight: 300;
  height: 100%;

  background: ${props => props.theme.bg.secondary};
  border-radius: 1rem;
  width: fit-content;
  padding: 0.1rem 0.7rem;
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

export const FooterContainer = styled.div`
	height: fit-content;
	display: flex;
	justify-content: center;
	padding: 0.5rem 1rem;
  color: #bbb;
  font-weight: bold;
  font-size: 0.9rem;
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
  position: relative;

  padding: 0rem 0rem 0.1rem 0.5rem;
`

export const NameNumberContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export const Label = styled.span`
    font-size: ${props => props.theme.fontSize.sz4};
    font-weight: 600;
`

export const LoopIndicator = styled.div`
    position: absolute;
    top: -0.7rem;
    right: -0.7rem;
    width: 2rem;
    height: 2rem;
    border-radius: 1rem;
    background: white;
    box-shadow: 1px 1px 4px 0px rgba(0,0,0,0.3);

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
`

export const LoopIcon = styled.i`
    color: #888;
    font-size: 1.2rem;
    transform: rotate(-70deg) scaleX(-1);
`

export const LoopCount = styled.div`
    position: absolute;
    top: 0.15rem;
    right: 0.15rem;

    height: 1rem;
    width: 1rem;
    border-radius: 0.5rem;
    background: #888;
    color: white;

    font-size: 0.6rem;
    font-weight: bold;

    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid white
`
