import styled from "styled-components";

export const Container = styled.div`
    background: white;
    
    width: 100%;
    
    
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    
    padding: 1rem;
    
    border: 1px solid black;
    overflow: hidden;
`

export const CardName = styled.span`
	background: yellow;
	display: flex;
  	align-items: center;
  	justify-content: flex-start;
	
`

export const ProcessName = styled.span`
	background: yellow;
	display: flex;
  	align-items: center;
  	justify-content: flex-start;
`

export const BasicInfoContainer = styled.div`
	display: flex;
	flex-direction: column;
`