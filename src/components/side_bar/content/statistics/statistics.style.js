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

export const HeaderBar = styled.div`
	${layoutCss.headerStyle};
    width: 100%;
    height: 5rem;
    background-color: ${props => props.theme.bg.primary};
    display: flex;
    flex-direction: row;
    justify-content: center;
`

export const HeaderSection = styled.div`
    width: fit-content;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
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

export const ColumnContainer = styled.div`
    ${commonCss.columnContainer}
`

export const ChartTypeButton = styled.button`
    ${buttonCss.button}
    margin: .5rem;
    background-color: ${props => !!props.selected ? props.theme.schema.charts.solid : 'none'};
    width: 5rem;
    height: 2rem;

`