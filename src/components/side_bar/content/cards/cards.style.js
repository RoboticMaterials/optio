import styled, { css } from "styled-components";

import { commonClickableIcon, commonIcon, glow, iconButtonCss } from "../../../../common_css/common_css";
import { hexToRGBA, LightenDarkenColor } from '../../../../methods/utils/color_utils'

export const Container = styled.div`
  justify-content: start;
  display: flex;
  flex-direction: row;
  min-height: 100%
  width: 100%;
`

const scrollCss = css`
::-webkit-scrollbar {
        width: 12px;
        height: 5px;
        margin: 1rem;
        background: transparent;
        border: none;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: ${props => props.theme.bg.tertiary};
    }

    ::-webkit-scrollbar-track:hover {
      background: ${props => props.theme.bg.tertiary};
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: ${props => props.theme.bg.quaternary};
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: ${props => props.theme.bg.quaternary};

    }
`

const xScrollCss = css`
::-webkit-scrollbar {
        width: 12px;
        height: 15px;
        margin: 1rem;
        background: transparent;
        border: none;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: ${props => props.theme.bg.tertiary};
    }

    ::-webkit-scrollbar-track:hover {
      background: ${props => props.theme.bg.tertiary};
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: ${props => props.theme.bg.quaternary};
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: ${props => props.theme.bg.quaternary};

    }
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
    justify-content: center;
    align-content: center;
`
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto;

  ${xScrollCss};


`
export const DropContainer = styled.div`
	width: 22rem;
  height: ${props => props.divHeight};
	margin: 0.5rem 0.3rem 0.3rem 0.3rem;

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
    opacity: ${props => props.disabled && '0.4'};
    pointer-events: ${props => props.disabled && 'none'};
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
    max-height: ${props => props.maxHeight};
    overflow: ${props => props.isOverflowing ? 'auto' : 'visible'};
    border-radius: .4rem;
    background-color: ${props =>props.theme.bg.secondary};
    justify-content: start;
    align-content: start;
    pointer-events: ${props => props.disabled && 'none'};

    ${scrollCss};
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
