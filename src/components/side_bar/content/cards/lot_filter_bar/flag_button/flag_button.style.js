import styled from "styled-components";
import {commonClickableIcon, iconButtonCss} from "../../../../../../common_css/common_css";

export const FlagButton = styled.button`
	${iconButtonCss};
	${commonClickableIcon};	
	${props => props.selected && selectedCss};
`