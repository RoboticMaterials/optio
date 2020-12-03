import styled from 'styled-components'
import Modal from 'react-modal';
import {css} from 'styled-components'
import {Form} from "formik";
import {LightenDarkenColor} from "../../../../../../methods/utils/color_utils";

export const TextboxDiv = styled.div`
    background-color: ${props => props.theme.bg.quinary};
    border: none;
    font-size: ${props => props.theme.fontSize.sz4};
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;
    min-height: 2rem;
    display: flex;
    flex-grow: 1;
    color: ${props => props.theme.bg.octonary};
    padding: .5rem;
    border-radius: .5rem;

    box-shadow: 0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1) !important;
    border-bottom: 2px solid ${props => props.theme.bg.quinary};

    &:focus {
        background-color: ${props => LightenDarkenColor(props.theme.bg.quinary, 10)};
        border-bottom: 2px solid ${props => !!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
        color: ${props => props.theme.bg.octonary};
        outline: none !important;
    }

    &::placeholder {
        font-family: ${props => props.theme.font.secondary};
        color: ${props => props.theme.bg.senary};
    }
`;

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
  border-radius: 1rem;
  overflow: hidden;
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
export const Label = styled.span`
	padding-left: 1rem;
	font-size: ${props => props.theme.fontSize.sz3};
	margin-bottom: .25rem;
`

export const StyledForm = styled(Form)`
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    position: relative;
    overflow: scroll;
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
	overflow: hidden;
	
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
  min-height: fit-content;
`;

export const IconSelectorContainer = styled.div`
	background: ${props => props.theme.bg.quinary};
	overflow: auto;
	// margin-bottom: 1rem;
	min-height: 2rem;
	width: 100%;
	
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
`

export const ContentContainer = styled.div`
	background: ${props => props.theme.bg.quinary};
	border-radius: 1rem;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	margin-bottom: 1rem;
	align-items: center;
`
export const ReportButtonsContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	
	
	overflow: auto;
	margin-bottom: 1rem;
	min-height: 5rem;
	width: 100%;
`

export const AddNewButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	border-bottom: 1px solid ${props => props.theme.bg.tertiary};
`

export const WidgetButtonText = styled.span`
    font-size: ${props => props.theme.fontSize.sz6};
    font-family: ${props => props.theme.font.primary};

    text-align: center;
    align-self:center;
    
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

`;

export const WidgetButtonButton = styled.button`

	display:flex;
	position: relative;
    flex-direction: column;
    justify-content: center;
    
    border: none;
    border-radius: 1rem;
    text-align: center;
    width: 4rem;
    min-width: 4rem;
    height: 4rem;
    max-height: 4rem;
    min-height: 4rem;
    outline:none;
    // margin: 0rem .5rem;
    overflow: hidden;
    
    // margin: 0rem .3rem;
    padding-top:.5rem;

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

    // @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
    //     width: 6rem;
    //     height: 4rem;
	//
    // }
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
    
    font-size: 2.2rem;
    margin-bottom:0.3rem;
    align-self:center;

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