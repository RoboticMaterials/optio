import styled, { css } from "styled-components";
import * as commonCss from '../../../../common_css/layout';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: ${props => props.theme.bg.secondary};
    overflow: hidden;
`

export const HeaderBar = styled.div`
	${commonCss.headerStyle};
    width: 100%;
    height: 5rem;
    background-color: ${props => props.theme.bg.primary};
    display: flex;
    flex-direction: row;
`

export const HeaderSection = styled.div`
    width: fit-content;
    height: 100%;
    flex-direction: column;
    justify-content: center;
`

export const StationColumnsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: ${props => props.theme.bg.secondary};
    overflow-y: auto;
`