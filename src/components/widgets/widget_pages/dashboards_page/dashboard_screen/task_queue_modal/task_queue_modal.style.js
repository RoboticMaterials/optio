import styled from "styled-components";
import { ModalContainerCSS, BodyContainerCSS } from '../../../../../../common_css/modal_css'

export const Container = styled(ModalContainerCSS)`
`

export const BodyContainer = styled(BodyContainerCSS)`
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
