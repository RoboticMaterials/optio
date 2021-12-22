import styled, {css} from "styled-components"
import {containerLayout} from "../../../common_css/layout";

export const Container = styled.div`
display: flex;
${containerLayout};
align-self: center;
overflow: hidden;
border-radius: 0 0 1rem 1rem;
flex-direction: column;
z-index: 5000;
// overflow: auto;
// height: 100%;
width: 100%;
// background: ${props => props.theme.bg.primary};
`