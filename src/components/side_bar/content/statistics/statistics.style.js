import styled, { css } from "styled-components";
import * as layoutCss from '../../../../common_css/layout';
import * as commonCss from '../../../../common_css/common_css'
import * as buttonCss from '../../../../common_css/button_css'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: ${props => props.theme.bg.secondary};
    overflow: hidden;
`

export const StationColumnsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: ${props => props.theme.bg.secondary};
    overflow-y: auto;
`

export const RowContainer = styled.div`
    ${commonCss.rowContainer}
    justify-content: center;
`

