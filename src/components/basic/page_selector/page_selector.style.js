import styled, { css } from 'styled-components'
import {commonClickableIcon, iconButtonCss} from "../../../common_css/common_css";

export const Container = styled.div`
	display: flex;
  	align-items: center;
  	color: ${props => props.theme.textColor};
`

export const Selector = styled.button`
	${commonClickableIcon};
  	${iconButtonCss};
  font-size: 2rem;
`

export const Text = styled.span`
	font-size: 2rem;
  	margin: 0 1rem;
`