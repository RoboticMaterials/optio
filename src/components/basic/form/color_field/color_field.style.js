import styled from 'styled-components';

export const DefaultContainer = styled.div`
	position: absolute;
	z-index: 0;
`

// ===== Color Selector ===== //
export const ColorPicker = styled.div`
    display: flex;
	flex-grow: 1;
	
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

`


export const ColorButton = styled.button`
    color: black;
	background: white;

`

export const DropdownMenu = styled.div`
`

export const ColorOption = styled.button`
    &:hover {
      background: ${props => props.color};
	}

`
