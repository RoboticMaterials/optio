import styled, { css } from "styled-components";
import { commonClickableIcon, commonIcon, glow, iconButtonCss } from "../../../../../../common_css/common_css";

export const FlagButton = styled.button`
	  ${iconButtonCss};
  	${commonClickableIcon};
  	margin: 0.2rem 0.5rem;
    list-style: none;
    font-size: 1.5rem;
    cursor: pointer !important;
`

export const FlagsContainer = styled.div`
    display: flex;
    padding: 0.5rem 0.2rem;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`