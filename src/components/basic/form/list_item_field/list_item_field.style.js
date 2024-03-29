import styled, { css } from 'styled-components'
import { RGB_Linear_Shade, hexToRGBA } from '../../../../methods/utils/color_utils'
import * as commonCss from "../../../../common_css/common_css";


// ========== Content ========== //
export const DefaultContainer = styled.div`
	position: relative;
`;


export const DefaultErrorTooltipContainerComponent = styled.div`
  margin: 0 1rem;
`


export const ListItem = styled.div`
    display: flex;
    align-items: center;
    width: auto;
    height: 3rem;
    text-overflow: ellipsis;
    justify-content: space-between;
    background: ${props => props.theme.bg.primary};
    padding: 0rem 1rem;

    flex-grow: 1;
    width: 100%;

    border-radius: 0.5rem;
    border: 0.15rem solid;
    border-color:  ${props => props.theme.schema['routes'].solid};
    box-shadow: ${props => props.theme.cardShadow};

    ${props => css`
      ${props.isNew && commonCss.newGlow};
      ${props.edited && commonCss.newGlow};
      ${props.error && commonCss.errorGlow};
    `}  

`

export const ListItemRect = styled.div`
    height: 100%;
    width: 100%;

    border-radius: 0.5rem;
    text-align: center;
    padding-right:0.5rem;
    cursor: pointer;
    user-select: none;

    box-sizing: border-box;
    

    &:hover {
        background: ${props => props.theme.bg.octonary};
    }

`
export const ListItemTitle = styled.h1`

    font-family: ${props => props.theme.font.primary};
    /* font-size: ${props => props.theme.fontSize.sz3}; */
    font-size: 1rem;
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right:0.5rem;
    margin-bottom: 0rem;
    flex-grow: 1;
`

const disabledCss = css`
  color: ${props => props.theme.disabled};
  
  &:hover {
    cursor: default;
    color: ${props => props.theme.disabled};
  }
`

export const ListItemIcon = styled.i`

    font-size: 1.3rem;
    color: lightgreen;
    



    &:hover {
        cursor: pointer;
        color:green;
    }
  
    ${props => props.disabled && disabledCss};
`



export const ListItemIconContainer = styled.div`
    position: relative;
    display: flex;
    //width: 10%;
`