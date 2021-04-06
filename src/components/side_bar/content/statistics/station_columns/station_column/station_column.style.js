import styled, { css } from "styled-components";
import * as commonCss from '../../../../../../common_css/common_css'
import * as styles from '../../../cards/columns/station_column/station_column.style'

export const StationColumnContainer = styled.div`
    height: fit-content;
    width: fit-content;
    margin: 1rem;
    border-radius: .5rem;
    background-color: ${props => props.theme.bg.secondary};
`

export const RowContainer = styled.div`
    ${commonCss.rowContainer}
`

export const StationColumnHeader = styled.div`
    width: 100%;
    justify-content: center;
    height: 2rem;

`

export const StationTitle = styled(styles.StationTitle)`

`

export const CollapseIcon = styled.i`

`