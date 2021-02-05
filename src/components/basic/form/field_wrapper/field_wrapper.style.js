import styled from 'styled-components';
import {css} from 'styled-components'


export const IconContainerComponent = styled.div`
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);
    margin: 0;
    padding: 0;
`;

export const DefaultContainerComponent = styled.div`
	//background: white;
  	//padding: 1rem;
  	
  display: flex;
  align-items: center;
`

export const FieldComponentContainer = styled.div`
  background: white;
  padding: 2rem;
  padding-left: .5rem;
  border-radius: 1rem;
`

export const LabelContainer = styled.div`
  background: white;
  left: .2rem;
  padding: 1rem;
  padding-right: .5rem;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  position: relative;
`

export const GapFiller = styled.div`
	background: white;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: -.1rem;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
  z-index: 1;
`

export const errorCss = css`
    box-shadow: 0 0 5px red;
    border: 1px solid red;
    
    &:focus{
        outline: 0 !important;
        box-shadow: 0 0 5px red;
        border: 1px solid red;
    }
`
