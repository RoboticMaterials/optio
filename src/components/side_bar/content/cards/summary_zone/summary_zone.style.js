import styled from "styled-components";

export const Container = styled.div`
	overflow: hidden;
	position: relative;
	height: 100%;
	display: flex;
	flex-direction: column;
	width: 100%;
	flex: 1;
	min-height: 100%;
	max-height: 100%;
	transition: all 2s ease;
`

export const ProcessesContainer = styled.div`
	overflow: auto;
	width: 100%;
	height: 100%;
	position: relative;
	transition: all 2s ease;
`