import styled, {css} from "styled-components";

import RemoveIcon from '@material-ui/icons/Remove';

export const containerCss = css`
	background-color: transparent;
	border-color: white;
	color: white;
	height: 2rem;
`

export const titleCss = css`
	color: white;
`

export const rightContentContainerCss = css`
	width: auto;
	margin-left: 1rem;
	margin-right: 1rem;
	display: flex;
	align-items: center;
`

export const StyledRemoveIcon = styled(RemoveIcon)`
	padding: 0;
	margin: 0;
`

export const Spacer = styled.div`
	height: 0.4rem;
	width: 100%;
`