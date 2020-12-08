import styled, {css} from "styled-components";

import RemoveIcon from '@material-ui/icons/Remove';

export const containerCss = css`
	background-color: #FFFFFF;
	border-color: transparent;
	color: transparent;
    height: 4.5rem;
    width: 100%;
    padding: .25rem;

`

export const titleCss = css`
    color: #000000;
    margin-right: .5rem;
		width:100%;
		word-break: break-word ;
`

export const contentContainerCss = css`
    flex-direction: row;

    overflow: hidden;
    text-overflow: ellipsis;-
    white-space: nowrap;

    justify-content: flex-start;
`

export const rightContentContainerCss = css`
	width: auto;
	margin-left: .5rem;
	margin-right: .25rem;
	display: flex;
	align-items: center;
`

export const leftContentContainerCss = css`
	width: auto;
	margin-left: .5rem;
	margin-right: .25rem;
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

export const ItemDiv = styled.div`
    &:hover{
        cursor: pointer;
    }
`
