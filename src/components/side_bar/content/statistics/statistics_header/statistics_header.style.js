import styled, { css } from "styled-components";

import * as layoutCss from '../../../../../common_css/layout';
import * as commonCss from '../../../../../common_css/common_css'
import * as buttonCss from '../../../../../common_css/button_css'

export const HeaderSection = styled.div`
    ${commonCss.columnContainer}
    background-color: ${props => props.theme.bg.secondary};
    margin: .25rem;
    border-radius: .5rem;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: .25rem;
`

export const ChartTypeButton = styled.button`
    ${buttonCss.button}
    margin: .5rem;
    background-color: ${props => !!props.selected ? props.theme.schema.charts.solid : props.theme.bg.tertiary};
    width: 5rem;
    height: 2rem;

`

export const HeaderLabel = styled.p`
    margin: 0;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    user-select: none;
`

export const ShiftSettingsContainer = styled.div`
    position: absolute;
    top: 6rem;
`

export const HeaderBar = styled.div`
	${layoutCss.headerStyle};
    width: 100%;
    height: 6rem;
    background-color: ${props => props.theme.bg.primary};
    display: flex;
    flex-direction: row;
    justify-content: center;
`

export const RowContainer = styled.div`
    ${commonCss.rowContainer}
    justify-content: center;
`