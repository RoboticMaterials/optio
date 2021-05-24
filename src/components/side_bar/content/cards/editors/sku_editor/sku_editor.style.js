import styled, { css } from "styled-components"
import Modal from "react-modal";
import {containerLayout} from "../../../../../../common_css/layout";

export const Container = styled(Modal)`
  outline: none !important;
  outline-offset: none !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  right: auto;
  bottom: auto;

  position: absolute;
	overflow: hidden;
  z-index: 50;
  
  min-width: 95%;
  max-width: 95%;
  max-height: 95%;
  
  
   height: ${props => props.formEditor && "95%"};
   min-height: 95%;
  
  color: ${props => props.theme.textColor};
  
  display: flex;
  flex-direction: column;
  align-items: center;
  
  // background: red;
  
`;

export const Container2 = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  width: 95%;
  height: 95%;
  background: ${props => props.theme.bg.primary};
`;

export const TheBody = styled.div`
  position: relative;
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;  

`
