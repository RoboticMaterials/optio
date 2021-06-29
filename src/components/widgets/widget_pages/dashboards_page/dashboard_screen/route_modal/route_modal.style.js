import styled from "styled-components";
import { ModalContainerCSS, BodyContainerCSS } from '../../../../../../common_css/modal_css'
import {css} from 'styled-components'

export const Container = styled(ModalContainerCSS)`
    width: 95%;
    max-width: 75rem;
`

export const BodyContainer = styled(BodyContainerCSS)`
`

export const RouteListContainer = styled.div`
    height: 100%;
    margin-top: 2rem;
`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
`

export const CloseButton = styled.i`
    position: absolute;
    top: 0rem;
    right: 1rem;
    font-size: 1.5rem;
    margin: 1rem;
    color: ${props => props.theme.bg.senary};
`

// overwrite dashboard button container style
export  const ButtonContainerCss = css`
	// large screen style

	@media (min-width: ${props => props.theme.widthBreakpoint.mobileL}){
		width: 100%;
		max-width: 100%;
    }

    @media (min-width: ${props => props.theme.widthBreakpoint.tablet}){
		width: 45%;
		margin-left: .5rem;
		margin-right: .5rem;
    }

`