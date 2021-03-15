import styled from "styled-components";
import * as commonCss from "../../../../../common_css/layout";

export const Header = styled.div`
	${commonCss.headerStyle};
	padding: .25rem 1rem;
  display: flex;
  align-items: center;
  
  
`

export const MenuButton = styled.i`
	font-size: 2rem;
	padding: 0;
	margin: 0;
	color: white;
	
	text-shadow: 0.05rem 0.05rem 0.2rem #303030;
    //transition: text-shadow 0.1s ease, filter 0.1s ease;
    &:hover {
        cursor: pointer;
        filter: brightness(85%);
    }

    &:active{
        filter: brightness(85%);
        text-shadow: none;
    }

    background: none;
    outline: none;
    border: none;

    &:focus {
        outline: none;
    }
`

export const InvisibleItem = styled.div`
    visibility: hidden;
    height: 1rem;
    width: 1rem;
`

export const Title = styled.span`
	font-size: ${props => props.theme.fontSize.sz2};
	color: white;
	font-weight: ${props => props.theme.fontWeight.bold};
  margin-bottom: .5rem;
`

export const TitleContainer = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
`