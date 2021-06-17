import React from 'react';
import styled from 'styled-components';

const NewColumn = (props) => {

    return (
        <Container onClick={props.onClick}>
            <PlusSymbol className={"fas fa-plus"} />
        </Container>
    )

}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 10rem;
	width: 5rem;
	margin-right: 1rem;
	overflow: hidden;
	background: ${props => props.theme.bg.tertiary};
	opacity: ${props => props.dragEnter ? 0.75 : 1};
	border-radius: 0.5rem;

	align-items: center;
	justify-content: center;
	cursor: pointer;
`

const PlusSymbol = styled.i`
	width: 2rem;
    height: 2rem;

	color: ${props => props.theme.bg.quaternary};
	font-size: 2.5rem;
    background-color: transparent;
    border: none;
    text-align: center;
    box-sizing: border-box;

    :focus {
      outline: 0;
    }
`


export default NewColumn;
