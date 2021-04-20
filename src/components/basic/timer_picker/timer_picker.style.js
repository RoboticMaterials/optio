import styled, {css} from "styled-components";

export const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	// flex: 1;
	overflow: hidden;

	background: green;
`;

export const ColumnsContainer = styled.div`
	display: flex;
	width: 50%;

`

export const ColumnHeader = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

export const OptionsContainer = styled.div`
	overflow-y: auto;
	overflow-x: hidden;
	width: 100%;
`

export const Column = styled.div`
	overflow-y: hidden;
	overflow-x: hidden;
	background: red;
	display: flex;
	flex-direction: column;
	flex: 1;
	align-items: center;
`

export const Option = styled.div`
	background: ${props => props.selected ? "blue" : "red"};
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`
