import styled, { css } from "styled-components";
import * as commonCss from '../../../../../common_css/common_css'

export const ChartsContainer = styled.div`
    ${commonCss.rowContainer}
    flex-wrap: wrap;
    flex: 9;
`

export const RowContainer = styled.div`
    ${commonCss.rowContainer}
    background-color: ${props => props.theme.bg.primary};
    border-radius: 0.5rem;
    margin: 1.5rem;
    box-shadow: ${props => props.theme.cardShadow};
    position: relative;
    /* align-items: center; */
    /* overflow-y: scroll; */
`

export const ProcessName = styled.h3`
    padding: 0;
    margin-top: .5rem;
    margin-left: 2.25rem;
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.theme.schema.lots.solid};
    /* text-align: center; */
    /* width: 20rem; */
    /* max-width: 8rem; */
    overflow: hidden;
    text-overflow: clip;
`

export const NameContainer = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    /* max-width: 8rem; */

`

export const CollapseIcon = styled.i`
    position: absolute;
    align-content: center;
    left: 1rem;
    top: .5rem;
    /* top: 50%; */
    /* transform: translateY(-50%); */
`
