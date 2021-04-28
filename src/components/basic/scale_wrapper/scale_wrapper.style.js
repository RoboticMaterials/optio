import styled, {css} from "styled-components";

export const Container = styled.div`
    max-width: ${props => props.width};
    min-width: ${props => props.width};
    width: ${props => props.width};
  
    max-height: ${props => props.height};
    min-height: ${props => props.height};
    height: ${props => props.height};
  //width: auto;
  //  background: red;
	position: relative;
`

export const ScaleContainer = styled.div`
	transform: scale(${props => props.scaleFactor}) translate(${props => `-${100 - (props.scaleFactor * 100)}%`}, ${props => `-${100 - (props.scaleFactor * 100)}%`});
	position: absolute;
  left: 0;
`