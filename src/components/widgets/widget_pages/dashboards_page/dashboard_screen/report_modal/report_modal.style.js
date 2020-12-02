import styled from 'styled-components'
import Modal from 'react-modal';
import {css} from 'styled-components'
import {Form} from "formik";

const sharedButtonStyle = css`
  outline: none !important;
  outline-offset: none !important;
  align-self: center;
  font-size: 1.5rem;
  position: relative;
  text-align: center;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
`

export const Container = styled(Modal)`
  outline: none !important;
  outline-offset: none !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  right: auto;
  bottom: auto;

  position: absolute;

  z-index: 50;
  
  min-width: 95%;
  max-width: 95%;
  max-height: 95%;
  // height: 95%;
  
  color: ${props => props.theme.bg.octonary};
  
  display: flex;
  flex-direction: column;
  
  color: ${props => props.theme.bg.octonary};
`;

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-width: 0;
  border-bottom-width: thin;
  border-color: black;
  border-style: solid;
  margin-bottom: 2rem;
`;

export const ButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0;
	margin: 0;
	justify-content: center;
`

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0;
	margin: 0;
	height: 3rem;
	background: ${props => props.theme.bg.quinary};
	
`

export const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    position: relative;
    overflow: hidden;
`;

export const Title = styled.h2`
	flex: 2;
	height: 100%;
	min-height: 100%;
	margin: 0;
	padding: 0;
	text-align: center;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	
	font-size: ${props => props.theme.fontSize.sz2};
	font-weight: ${props => props.theme.fontWeight.bold};
`;

export const TextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

export const BodyContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	flex: 1;
	justify-content: space-between;
	overflow: auto;
	
	background: ${props => props.theme.bg.quaternary};
`

export const TextMain = styled.h4`
  text-align: center;
  font-size: ${props =>  props.theme.fontSize.sz3};
  font-family: ${props =>  props.theme.font.primary};
  font-weight: 500;
`;

export const Caption = styled.h5`
  text-align: center;
  font-size: ${props =>  props.theme.fontSize.sz4};
  font-family: ${props =>  props.theme.font.primary};
  font-weight: 400;
  font-style: italic;
`;

export const ButtonForm = styled.div`

  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const IconSelectorContainer = styled.div`
	background: ${props => props.theme.bg.quinary};
	overflow: auto;
	margin-bottom: 1rem;
	min-height: 5rem;
	width: 100%;
`

export const ReportButtonsContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	
	background: ${props => props.theme.bg.quinary};
	overflow: auto;
	margin-bottom: 1rem;
	min-height: 5rem;
	width: 100%;
`

export const WidgetButtonButton = styled.button`
    border: none;
    border-radius: 1rem;
    text-align: center;
    width: 4rem;
    min-width: 4rem;
    height: 4rem;
    max-height: 4rem;
    outline:none;
    margin: 0rem .5rem;
    overflow: hidden;

    /* margin-top: 0.5rem; */


    box-shadow: 0 0.1rem 0.2rem 0rem #303030;

    background-color: ${props => props.selected ? props.theme.bg.quaternary : props.theme.bg.septenary};
    // background-color: ${props =>  props.theme.bg.quaternary };

    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:hover{
        background-color: ${props => props.theme.bg.senary};
    }

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        width: 3.5rem;
        height: 3.5rem;
        border-radius: .5rem;
        
    }
`;

export const WidgetButtonLabel = styled.label`
    display: inline-block;
    width: 12.5rem;
    height: 6rem;
    text-align: center;
`;

export const ColorFieldContainer = styled.div`
position: relative;
margin-bottom: 1rem;
`

export const WidgetButtonIcon = styled.i`
    font-size: 2.2rem;
    color: ${props => props.selected ? props.color || "red" : "white"};

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        font-size: 2rem;

        
    }
`


export const Icon = styled.i`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto auto;
    color: green;
    fill: green;
    font-size: 7rem;
    width: 14rem;
    &:hover {
        cursor: pointer;
    }

    &:active{
        filter: brightness(85%)
    }
`