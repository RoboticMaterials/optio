import styled, { css } from "styled-components";
import * as commonCss from '../../../../../../common_css/common_css'

export const StationColumnContainer = styled.div`
    height: fit-content;
    width: fit-content;
    margin: 1rem;
    border-radius: .5rem;
    background-color: ${props => props.theme.bg.tertiary};
`

export const RowContainer = styled.div`
    ${commonCss.rowContainer}
`