import styled, { css } from 'styled-components';
import Modal from 'react-modal'
import * as commonCss from "../../common_css/common_css"

export const Container = styled(Modal)`
	outline: none !important;
	outline-offset: none !important;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	right: auto;
	bottom: auto;
	position: absolute;
    border-radius: 0.4rem;

	z-index: 10000;
	width: 50%;
    height: 80%;

	background: ${props => props.theme.bg.primary};

	display: flex;
	flex-direction: column;

	color: ${props => props.theme.textColor};
	
	overflow: hidden;

`;

export const Header = styled.div`
    display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0;
	margin: 0;
	min-height: 5rem;
	background: ${props => props.theme.bg.tertiary};
    border-bottom: 1px solid ${props => props.theme.bg.quaternary};
    padding: 0 1.5rem;
`

export const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    margin: 0;
    min-height: 5rem;
    background: ${props => props.theme.bg.tertiary};
    border-bottom: 2px solid ${props => props.theme.bg.secondary};
`

export const Title = styled.h2`
    color: ${props => props.theme.bg.senary};
    font-family: 'Montserrat';
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    padding: 0;
`;

export const CloseIcon = styled.button`
    ${commonCss.commonIcon};   
    ${commonCss.iconButtonCss};
    font-size: 2rem;
`