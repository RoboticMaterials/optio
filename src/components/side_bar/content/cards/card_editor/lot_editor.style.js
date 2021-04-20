import styled, {css} from "styled-components";
import {Form} from "formik";
import {commonClickableIcon, iconButtonCss} from "../../../../../common_css/common_css";
import {containerLayout} from "../../../../../common_css/layout";

export const rowCss = css`
	// margin-bottom: 1rem;
`

export const Container = styled.div`
  ${containerLayout};
  overflow: hidden;
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
	margin: 0;
	background: ${props => props.theme.bg.secondary};
	z-index: 10;
	box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
`

export const CloseIcon = styled.i`
    font-size: 1.4rem;
    margin: 2rem;
    color: ${props => props.theme.bg.quaternary};
    cursor: pointer;
	
`

export const LotNumberContainer = styled.div`
  background: ${props => props.theme.bg.quinary};
`

export const NameContainer = styled.div`
  align-self: stretch;
  padding: 1rem 1rem 1rem 0;
	background: ${props => props.theme.bg.primary};
  flex-direction: column;
	flex: 1;
  //align-self: center;
  display: flex;
  align-items: flex-start;
  margin: 0.5rem 2rem;
`

export const NameLabel = styled.span`
	margin-right: 1rem;
  white-space: nowrap ;
  width: fit-content;
`

export const CloseButton = styled.button`
	height: 100%;
	width: 3rem;

`

export const Title = styled.div`
	flex: 2;
	height: 100%;
	min-height: 100%;
	margin: 0;
	padding: 0;
	text-align: center;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	display: flex;
  	flex-direction: column;
	font-size: ${props => props.theme.fontSize.sz2};
	font-weight: ${props => props.theme.fontWeight.bold};
	font-family: ${props => props.theme.font.primary};
	
`
export const TitleText = styled.span`

`

export const FieldTitle = styled.span`
  font-size: ${props => props.theme.fontSize.sz3};
  font-weight: ${props => props.theme.fontWeight.bold};
  font-family: ${props => props.theme.font.primary};
  align-self: center;
`

export const InfoText = styled.span`
  font-size: ${props => props.theme.fontSize.sz3};
  // font-weight: ${props => props.theme.fontWeight.bold};
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.highlight ? props.theme.schema[props.schema].solid : props.textColor};
`

export const SectionContainer = styled.div`
	border-bottom: 3px solid ${props => props.theme.bg.secondary};
  //padding: 0 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;  
`

export const TheBody = styled.div`
  position: relative;
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;  

`

export const ScrollContainer = styled.div`
  position: relative;
  overflow: auto;
  flex: 1;
  display: flex;
  //height: 50rem;
  flex-direction: column;
  //background: blue;
  

`




export const ProcessFieldContainer = styled.div`
  //margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  padding-bottom: 0;
  //width: auto;
`


export const ProcessOptionsContainer = styled.div`
	//margin-bottom: 1rem;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  
  
  box-shadow: ${props => props.hasError && "0 0 5px red"}; 

  background: ${props => props.theme.bg.primary}; 
  padding: 1rem;
  border-radius: 1rem;
  
  padding-bottom: 1rem;
  
  ::-webkit-scrollbar {
    height: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: rgba(100,100,100,0.2);
    opacity: 10%;
  }

  ::-webkit-scrollbar-track:hover {
    background: rgba(100,100,100,0.6);
    border-left: 1px solid rgba(100,100,100,0.6);
    border-right: 1px solid rgba(100,100,100,0.6);
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.bg.secondary};
    border-radius: .5rem;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;

  }
`
export const ProcessName = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const ProcessOption = styled.div`

	&:hover {
		cursor: pointer;
	}
	
	text-shadow: 0.05rem 0.05rem 0.2rem #303030;
	&:hover {
		cursor: pointer;
		filter: brightness(140%);
	}
	
	&:active{
		filter: brightness(85%);
		text-shadow: none;
	}
  
  	background: ${props => props.theme.bg.senary};
	
  	padding: 1rem;
	border-radius: 1rem;
  	margin-right: 1rem;
  
	min-width: 10rem;
	max-width: 10rem;
	width: 10rem;
	
	display: inline-flex;
	justify-content: center;
	align-items: center;
	
	${props => (!props.isSelected && props.containsSelected) && "filter: grayscale(50%)"};
	${props => props.isSelected && "filter: brightness(130%)"};
	transition: all 0.5s ease;
	
	font-size: ${props => props.theme.fontSize.sz3};
	font-weight: ${props => props.theme.fontWeight.normal};
	font-family: ${props => props.theme.font.primary};
  
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`



const mainCss = css`
	display: flex;
	flex-direction: column;
	flex: 1;
	width: 100%;
	max-width: 100%;
	overflow: hidden;
	max-height: 100%;
	height: 100%;
	// max-height: 100%;
	// overflow-x: hidden;
	border-radius: .5rem;
	position: relative;
	
	overflow: hidden;
	background: ${props => props.theme.bg.primary};
	flex: 1;
	justify-content: space-between;
`

export const StyledForm = styled(Form)`
    ${mainCss};
`;

export const SubContainer = styled.div`
  ${mainCss};
`



export const ContentContainer = styled.div`
	display: flex;
	padding: 1rem;
	flex-direction: column;
	max-height: 100%;
	overflow: hidden;
	flex: 1;
	justify-content: space-between;
`

export const FieldContainer = styled.div`
  margin: 1rem;
  flex: 1;
  align-self: center;
  justify-content: center;
  display: flex;
`

export const BodyContainer = styled.div`
	display: flex;
	flex-direction: column;
  width: 100%;
  min-width: 100%;
  background: ${props => props.theme.bg.primary};
	padding: 1rem;
  align-self: stretch;
  
	//flex: 1;
	justify-content: space-between;
  min-height: ${props => props.minHeight};
  
`

export const WidgetContainer = styled.div`
	display: flex;
	padding-left: 1rem;
	color: ${props => props.theme.schema.lots.solid};
	font-size: 1.4rem;
	justify-content: center;
	cursor: pointer;
	
	${rowCss};
`

export const Icon = styled.i`
	font-size: 2rem;
	color: ${props => props.color};
	font-family: ${props => props.theme.font.primary};
	margin-right: 1rem;
`

export const ObjectInfoContainer = styled.div`
	display: flex;
	//width: 100%;
	flex-direction: column;
	align-items: center;
`



export const CountInput = styled.input`
	width: fit-content;
`

export const ObjectLabel = styled.span`
	display: inline-flex;
	margin-right: 1rem;
	font-family: ${props => props.theme.font.primary};
	font-weight: bold;
  align-items: center;
  text-align: center;
`

export const QuantityErrorContainerComponent = styled.div`
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    right: 2.5rem;
    transform: translateY(-50%);
    margin: 0;
    padding: 0;
    ${props => props.iconContainerCss};
`;

export const ObjectName = styled.span`
	display: flex;
`

export const InputContainer = styled.div`
	flex: 1;
`


export const Footer = styled.div`
  background: ${props => props.theme.bg.tertiary};
  display: flex;
  flex-direction: column;
`

export const ButtonContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
	align-self: center;
	padding: 1.5rem;

	background: ${props => props.theme.bg.secondary};
	z-index: 10;
	box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
`

export const DatesContainer = styled.span`
	display: inline-flex;
	align-items: center;
	background: ${props => props.theme.bg.quinary};
	justify-content: center;
	padding: .75rem;
	border-radius: 1rem;
  width: fit-content;
  margin: 0;
	
	
	//${rowCss};
`

export const DateItem = styled.div`
	display: flex;
	flex-direction: column;
	background: ${props => props.theme.bg.secondary};
	border-radius: 1rem;
	
	padding: .5rem;
	align-items: center;
	justify-content: center;
	
	&:hover {
		cursor: pointer;
	}
	
`

export const ErrorTooltipContainer = styled.div`
	margin-left: 1rem;
`

export const DateArrow = styled.i`
	margin-left: 1rem;
	margin-right: 1rem;
	color: ${props => props.theme.bg.senary};
`

export const DateTitle = styled.span``

export const DateText = styled.span`

`

export const TimeText = styled.span`

`

export const StationContainer = styled.div`
	${rowCss};
`

// history

export const ContentHeader = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
  	margin-bottom: 1rem;
	//padding: 1rem;
`

export const FieldsHeader = styled.div`
  align-self: stretch;
	display: flex;
  //padding: 1rem;
  flex-direction: column;
	//justify-content: space-between;
	width: 100%;
  	//margin-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.bg.secondary};
	//padding: 1rem;
`

export const ContentTitle = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
	font-weight: ${props => props.theme.fontWeight.bold};
	font-family: ${props => props.theme.font.primary};
`

export const ContentValue = styled.span`
  font-size: ${props => props.theme.fontSize.sz3};
  font-weight: ${props => props.theme.fontWeight.normal};
  font-family: ${props => props.theme.font.primary};
`

// export const InfoText = styled.span`
//   font-size: ${props => props.theme.fontSize.sz3};
//   font-weight: ${props => props.theme.fontWeight.no};
// `

export const FieldLabel = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
	font-weight: ${props => props.theme.fontWeight.bold};
	font-family: ${props => props.theme.font.primary};
	white-space: nowrap ;
	margin-right: 2rem;
	margin-bottom: .5rem;
`

const fieldValueCss = css`
 /* background-color: ${props => props.theme.bg.secondary}; */
  border: none;
  font-size: ${props => props.theme.fontSize.sz4};
  font-family: ${props => props.theme.font.primary};
  font-weight: bold;
  
  flex-grow: 1;
  color: ${props => props.theme.textColor};

  /* box-shadow: 0 0.1rem 0.2rem 0rem rgba(0,0,0,0.1) !important; */
  /* border-bottom: 2px solid ${props => props.theme.bg.secondary}; */
  
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LotName = styled.span`
  ${fieldValueCss};
  padding: 0 .5rem;
`

export const LotNumber = styled.div`
	${fieldValueCss};
	
	padding: 0 2rem;
`

export const TemplateButton = styled.button`
  ${iconButtonCss};
  ${commonClickableIcon};
  font-size: 2rem;
`

export const PasteIcon = styled.button`

	${iconButtonCss};
  	${commonClickableIcon};
	font-size: 2rem;

    animation: blinker 1s linear infinite;

  @keyframes blinker {
	0% {
	  opacity: 0.5;
	}
    50% {
      //opacity: .2;
	  opacity: 1;
      filter: brightness(120%);
    }
	
	100% {
      opacity: 0.5;
	}
	
  }
  
`



export const CalendarContainer = styled.div`
	overflow: auto;
	
	${rowCss};
`
export const PopupFooter = styled.div`
  paddding: 1rem;
  display: flex;
  overflow: auto;
  height: 3rem;
`

const rowCss2 = css`
  display: flex;
  align-items: center;
`

export const RowContainer = styled.div`
	${rowCss2};
`

export const SubHeader = styled.div`
	display: flex;
  align-self: stretch;
  align-items: center;
  background: ${props => props.theme.bg.primary};
  padding: 0.5rem;
  border-bottom: 3px solid ${props => props.theme.bg.secondary};
`
export const IconRow = styled.div`
  ${rowCss2};
  align-items: center;
  padding: .25rem;
`

export const ColumnContainer = styled.div`
	display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;
  
	// margin-bottom: 1rem;
  
`

export const FadeLoaderCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;



export const HistoryBodyContainer = styled.div`
	display: flex;
	padding: 1rem;
	flex-direction: column;
	overflow-y: auto;
	overflow-x: hidden;
	flex: 1;
	border-bottom: 3px solid ${props => props.theme.bg.secondary};
	border-top: 3px solid ${props => props.theme.bg.secondary};
`

export const HistoryItemContainer = styled.div`
	display: flex;
	padding: 1rem;
	background: rgba(200,0,200,0.2);
	margin-bottom: 1rem;
	border-radius: 1rem;
	background: ${props => props.theme.bg.primary};
  	box-shadow: ${props => props.theme.cardShadow};
`

const textCommon = css`
	display: flex;
	justify-content: center;
	align-items: center;
`

const historyContainerCommon = css`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`

export const HistoryDateContainer = styled.div`
	${historyContainerCommon};
	flex: 1;
	align-items: flex-end;
`


export const HistoryDateText = styled.span`
	${textCommon};
`

export const HistoryUserContainer = styled.div`
	${historyContainerCommon};
	// display: inline-flex;
	
	
`
export const HistoryUserText = styled.span`
	${textCommon};
	background: ${props => props.theme.bg.quaternary};
	padding: .5rem 1rem;
	border-radius: .5rem;
	color: ${props => props.theme.bg.primary};

`

export const HistoryInfoContainer = styled.div`
	${historyContainerCommon};
	flex: 2;
	align-items: flex-start;
	margin: 0 1rem 0 1rem;
	
`

export const HistoryInfoText = styled.span`
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
`

export const TimePickerContainer = styled.div`
	flex: 1;
	flex-direction: column;
	display: flex;
	overflow: hidden;
`




export const buttonViewCss = css`
	// border-right: ${props => !props.isLast && `solid ${props.theme.bg.quaternary} thin`}; // dont show border on last item
	color: ${props => props.theme.bg.quinary};
	padding: 0;
	margin: 0;
	padding-left: .5rem;
	padding-right: .5rem;
	font-size: ${props => props.theme.fontSize.sz3};
	font-family: ${props => props.theme.font.primary};
`


export const buttonViewSelectedCss = css`
	background: transparent;
	color: ${props => props.theme.schema["lots"].solid};
`


export const buttonGroupContainerCss = css`
	display: flex;
	flex-direction: row;
	align-self: center;
	padding: 0;
	//margin: 0 0 1rem 0;
  width: fit-content;
  
	
`


export const buttonCss = css`
	margin: 0;
	padding: 0;
  
	
	&:focus{
	}
	
	&:active{
	}
	
	&:hover{
		cursor: default;
	}
	
`

export const TemplateNameContainer = styled.div`
  margin: 0 auto;
  padding: 1rem 0;
  align-self: center;
  display: flex;
  align-items: center;
`

export const TemplateLabel = styled.span`
	margin-right: 1rem;
  white-space: nowrap ;
  width: fit-content;
  font-size: ${props => props.theme.fontSize.sz2};
  font-family: ${props => props.theme.font.primary};
`



