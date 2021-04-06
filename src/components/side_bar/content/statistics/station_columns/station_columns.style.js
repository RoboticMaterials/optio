import styled, { css } from "styled-components";
import * as commonCss from '../../../../../common_css/common_css'

export const ChartsContainer = styled.div`
    ${commonCss.rowContainer}
    flex-wrap: wrap;
`

export const RowContainer = styled.div`
    ${commonCss.rowContainer}
    background-color: ${props => props.theme.bg.primary};
    border-radius: 0.5rem;
    margin: 1.5rem;
    box-shadow: ${props => props.theme.cardShadow};
    align-items: center;
`

export const ProcessName = styled.h3`
    padding: 0;
    margin: 0;
    margin: 0 2rem;
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.theme.schema.lots.solid};
    text-align: center;
    width: 5rem;
    min-width: 8rem;
    
    overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
   -webkit-box-orient: vertical;
`