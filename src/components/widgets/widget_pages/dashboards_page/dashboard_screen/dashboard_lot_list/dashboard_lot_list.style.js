import styled, { css } from "styled-components";
import * as commonCss from '../../../../../../common_css/common_css'


export const LotListContainer = styled.div`
    ${commonCss.columnContainer}
    justify-content: center;
    padding: 1rem;
    width: 100%;
    overflow: auto;

`

export const LotCardContainer = styled.div`
    ${commonCss.rowContainer}
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
`