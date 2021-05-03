import styled, { css } from 'styled-components'
import {containerCss} from "../hil_modals.style";
import Modal from 'react-modal';


export const Container = styled(Modal)`
    ${containerCss};
    background: ${ props => props.theme.bg.secondary};
    padding: 2rem;
    justify-content: center;
`