import styled from 'styled-components';
import {css} from 'styled-components'
import {borderGlowCss} from "../../../widgets/widget_pages/dashboards_page/dashboard_buttons/dashboard_buttons.style";
import {commonClickableIcon, newGlow} from "../../../../common_css/common_css";


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
  display: flex;
  align-items: flex-start;
  position: relative;
  flex-direction: column;
  border-radius: 1rem;

  background: ${props => props.updateColor ? "linear-gradient(0deg, rgb(152, 152, 152) 0%, rgb(227, 227, 227) 100%)" : "transparent"};
  //background: pink;
  //flex: 1;
  //align-items
  
`


export const FieldComponentContainer = styled.div`
  //background: white;
  display: flex;
  align-self: stretch;
  //padding: 1rem;
  //padding-bottom: 1.75rem;
  //padding-left: .5rem;
  padding-left: .5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-right: 2.5rem;
  
  //border-radius: 0rem 0rem 1rem 1rem;
  z-index: 5;
  transition: all ease 0.5s;
  align-items: center;
  position: relative;
  min-width: 14rem;
  align-items: center;
  justify-content: center;
  
  


`

export const DeleteContainer = styled.div`
  background: ${props => props.updateColor ? "linear-gradient(0deg, rgb(227, 227, 227) 0%, rgb(152, 152, 152) 100%)" : "transparent"};
  padding: .5rem 1rem;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
`

export const DeleteIcon = styled.i`
  ${commonClickableIcon};
  //color: #ec0000;
  margin-left: 1rem;
  position: absolute;
  right: 1rem;
`

export const AlignIcon = styled.i`
  ${commonClickableIcon};
  //color: #ec0000;
  margin: 0 .5rem;
`

export const StyleContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  
`

export const LabelContainer = styled.div`
  //left: .2rem;
  padding: .5rem;
  flex: 1;
  width: 100%;
  //padding: .45rem;
  //padding-right: .5rem;
  //border-top-left-radius: 1rem;
  //border-top-right-radius: 1rem;
  position: relative;
  transition: all 1s ease;
  // background: ${props => props.updateColor ? "linear-gradient(0deg, rgb(215, 215, 215) 0%, rgb(152, 152, 152) 100%)" : "transparent"};
`

export const GapFiller = styled.div`
	//background: white;
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
