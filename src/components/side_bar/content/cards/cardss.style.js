import styled, { css } from "styled-components";

import { commonClickableIcon, commonIcon, glow, iconButtonCss } from "../../../../common_css/common_css";
import { hexToRGBA, LightenDarkenColor } from '../../../../methods/utils/color_utils'

export const Container = styled.div`
  justify-content: start;
  display: flex;
  overflow-x: scroll;
  flex-direction: row;
  width: 100%;
`
export const AddLotContainer = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: start;
  background-color: ${props =>LightenDarkenColor(props.theme.bg.tertiary,15)};
  border-radius: 0.4rem;
  margin: 0.5rem 1rem 0.5rem 1rem;
  padding-left: 1rem;

  &:hover {
    cursor: pointer;
    background-color: ${props =>LightenDarkenColor(props.theme.bg.tertiary,10)};
  }
`

export const CardContainer = styled.div`
    margin: 0rem .5rem .5rem .5rem;
`

export const DropContainer = styled.div`
	width: ${props => props.divWidth};
  height: ${props => props.divHeight};
	margin: 0.5rem 0.3rem 0.3rem 0.5rem;

  align-self: center;
  justify-self: center;
	background: ${props => LightenDarkenColor(props.theme.bg.tertiary,15)};
	border: 0.1rem solid ${props => LightenDarkenColor(props.theme.bg.tertiary,15)};
	border-radius: .3rem;

`

export const ColumnContainer = styled.div`
    margin: 1rem;
    padding: .5rem 0rem 1.5rem 0rem;
    border-radius: 0.4rem;
    height: fit-content;
    background-color: ${props =>props.theme.bg.secondary};
    opacity: ${props => props.disabled && '0.5'}
`

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0rem .8rem 0rem 1rem;
`
export const ColumnHeader = styled.div`
    display: flex;
    flex-direction: column;
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
    margin-bottom: 0.2rem;
`
export const StationColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 24rem;
    margin-top: .5rem;
    min-height: 1rem;
    max-height: ${props => !!props.maxHeight && props.maxHeight};
    overflow: auto;
    border-radius: .4rem;
    background-color: ${props =>props.theme.bg.secondary};
    justify-content: start;
    align-content: start;
`

export const StationName = styled.span`
    font-size: ${props => props.theme.fontSize.sz3};
    font-weight: bold;
    margin: 0.5rem;
`

export const AddLot = styled.span`
    font-size: 1rem;
    margin: 1rem;
`

export const LotCount = styled.span`
    font-size: 1rem;

`
