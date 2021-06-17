import styled, { css } from "styled-components"
import {commonClickableIcon, iconButtonCss} from "../../../common_css/common_css";

export const EditIcon = styled.button`
    ${commonClickableIcon};
    ${iconButtonCss};
    font-size: ${props => props.size};
`