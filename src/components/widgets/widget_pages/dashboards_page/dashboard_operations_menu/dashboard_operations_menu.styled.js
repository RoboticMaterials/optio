import styled from "styled-components";
import * as commonCss from '../../../../../common_css/common_css'

export const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 50rem;
    height: fit-content;
    padding: .5rem;
    box-shadow: ${props => props.theme.cardShadow};
    background: ${props => props.theme.bg.primary};
    border-radius: .5rem;
    z-index: 1000;
    position: absolute;
    top: 5rem;
`