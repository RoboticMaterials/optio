import styled, { css } from 'styled-components'
import Modal from 'react-modal';
import { isMobile } from "react-device-detect"

export const ModalContainerCSS = styled(Modal)`
	outline: none !important;
	outline-offset: none !important;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	right: auto;
	bottom: auto;
	position: absolute;
	z-index: 500;

	width: 60rem;
	min-width: 15rem;
    max-width: 95%;

	height: 95%;
	color: ${props => props.theme.bg.octonary};
    background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	flex-direction: column;
	border-radius: 0.4rem;
	overflow: hidden;
`

export const BodyContainerCSS = styled.div`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	flex: 1;
	justify-content: space-between;
	overflow: hidden;
	background: ${props => props.theme.bg.secondary};
`
