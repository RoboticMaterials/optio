import styled, { css } from "styled-components"
import {commonClickableIcon, iconButtonCss} from "../../../common_css/common_css";

export const Container = styled.div`
    border: 1px dashed black;
    padding: 1rem;
    border-radius: .3rem;
    height: auto;
    width: auto;
`

export const UploadButton = styled.button`
    ${commonClickableIcon};
    ${iconButtonCss};
    font-size: 8rem;
`