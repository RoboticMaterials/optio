import styled from "styled-components";

export const Container = styled.div`
	display: flex;
    flex-direction: row;
    width: 100%;
    padding: 1rem;
    background: ${props => props.theme.bg.quaternary};
    border-bottom: 1px solid ${props => props.theme.bg.tertiary};
    z-index: 20;
`