import styled, { css } from "styled-components";
import * as commonCss from '../../../../../../common_css/common_css'


export const LotListContainer = styled.div`
    ${commonCss.rowContainer}
    justify-content: center;
    overflow: auto;
    flex-wrap: wrap;
    padding: 1rem;
    width: 100%;
`