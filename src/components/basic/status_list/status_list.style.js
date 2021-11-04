import styled, {css} from "styled-components"
import {containerLayout} from "../../../common_css/layout";

export const Container = styled.div`
display: flex;
${containerLayout};
align-self: center;
overflow: hidden;
border-radius: 1rem;
flex-direction: column;
z-index: 5000;
overflow: hidden;
min-height: 90vh;
height: 90vh;
width: 90vw;
background: ${props => props.theme.bg.primary};
`