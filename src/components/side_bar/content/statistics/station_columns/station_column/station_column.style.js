import styled, { css } from "styled-components";
import * as commonCss from '../../../../../../common_css/common_css'
import * as styles from '../../../cards/columns/station_column/station_column.style'

export const StationColumnContainer = styled.div`
    height: fit-content;
    width: fit-content;
    margin: 1rem;
    border-radius: .5rem;
    background-color: ${props => props.theme.bg.primary};
    max-width: 100rem;
`

export const StationCollapsedContainer = styled.div`
    width: 3rem;
    height: 20rem;
    background-color: ${props => props.theme.bg.secondary};
    position: relative;
    margin: 1rem;
    border-radius: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const RowContainer = styled.div`
    ${commonCss.rowContainer}
`

export const StationColumnHeader = styled.div`
    width: 100%;
    justify-content: center;
    height: 2rem;
    display: flex;
    flex-direction: row;
    position: relative;
`

export const StationTitle = styled.p`
    font-size: ${props => props.theme.fontSize.sz3};
    text-overflow: ellipsis;
    color: ${props => props.theme.textColor};
    margin: 0;
    transform: ${props => !!props.rotated && 'rotate(90deg)'} 
`

export const CollapseIcon = styled.i`
    position: absolute;
    align-content: center;
    left: 1rem;
    top: .5rem;
    /* top: 50%; */
    /* transform: translateY(-50%); */
`