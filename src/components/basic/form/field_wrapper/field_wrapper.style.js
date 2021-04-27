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
  flex-direction: column;
  padding: 1rem;

  border-radius: .5rem;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.bg.secondary};

  >div {
    margin-bottom: .5rem;
  }
  
`

export const FieldComponentContainer = styled.div`
  display: flex;
  align-self: stretch;
  //padding: 0 1rem 0 1rem;
  
  border-radius: 0rem 0rem 0.5rem 0.5rem;
  z-index: 5;
  transition: all ease 0.5s;
  align-items: center;
  position: relative;
  min-width: 14rem;
  align-items: center;
  justify-content: center;
  
  // background: ${props => props.updateColor ? props.theme.bg.secondary : "transparent"};

  
`

export const DeleteContainer = styled.div`
  background: ${props => props.updateColor ? "red" : "transparent"};
  padding: .5rem 1rem;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
`

export const DeleteIcon = styled.i`
  ${commonClickableIcon};
  margin: 0 1rem;
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

export const CheckItems = styled.div`
  display: flex;
`

export const checkboxCss = css`
  margin-right: .5rem;
`

export const CheckItemLabel = styled.span`
  font-size: ${props => props.theme.fontSize.sz4};
  color: ${props => props.theme.textColor};
  white-space: nowrap;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  &:not(:first-child) {
    margin-left: 1rem;
  }
`

export const LabelContainer = styled.div`
  position: relative;
  transition: all 1s ease;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const GapFiller = styled.div`
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
