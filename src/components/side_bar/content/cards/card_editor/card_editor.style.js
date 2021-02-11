import styled, {css} from "styled-components";
import Modal from "react-modal";
import {Form} from "formik";

export const rowCss = css`
	margin-bottom: 1rem;
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
	overflow: hidden;
  z-index: 50;
  
  min-width: 95%;
  max-width: 95%;
  max-height: 95%;
  
   height: ${props => props.formEditor && "95%"};
  
  color: ${props => props.theme.bg.octonary};
  
  display: flex;
  flex-direction: column;
  
  color: ${props => props.theme.bg.octonary};
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0;
	margin: 0;
	background: ${props => props.theme.bg.quinary};
  	border-bottom: 1px solid black;
`

export const NameContainer = styled.div`
  align-self: stretch;
  padding: 1rem;
	background: ${props => props.theme.bg.quaternary};
  flex-direction: column;
	flex: 1;
  //align-self: center;
  display: flex;
  align-items: flex-start;
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
	
`
export const TitleText = styled.span`

`

export const FieldTitle = styled.span`
  font-size: ${props => props.theme.fontSize.sz3};
  font-weight: ${props => props.theme.fontWeight.bold};
  align-self: center;
`

export const InfoText = styled.span`
  font-size: ${props => props.theme.fontSize.sz3};
  // font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.highlight ? props.theme.schema[props.schema].solid : "white"};
`

export const SectionContainer = styled.div`
	border-bottom: 1px solid ${props => props.theme.bg.quinary};
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
  //min-height: 40rem;
  flex-direction: column;
  //width: 100%;
  

`

export const SuperContainer = styled.div`
  position: relative;
  overflow: auto;
  flex: 1;
  display: flex;
  //min-height: 40rem;
  flex-direction: column;
  

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

  background: ${props => props.theme.bg.quinary}; 
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
    background: ${props => props.theme.bg.tertiary};
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
  
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`

export const StyledForm = styled(Form)`
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
  background: ${props => props.theme.bg.quaternary};
    
   
    flex: 1;
    
    justify-content: space-between;
  
  
`;

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
  background: ${props => props.theme.bg.quaternary};
	padding: 1rem;
  align-self: stretch;
  
	//flex: 1;
	justify-content: space-between;
  min-height: ${props => props.minHeight};

	
`

export const WidgetContainer = styled.div`
	display: flex;
	padding-left: 1rem;
	
	${rowCss};
`

export const Icon = styled.i`
	font-size: 2rem;
	color: ${props => props.color};
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

export const ButtonContainer = styled.div`
	display: flex;
	//flex-direction: row;
	align-items: center;
  width: 100%;
  justify-content: center;
  align-self: center;
	padding: 1rem;
	margin: 0;
  	margin: 0 .5rem;
  background: ${props => props.theme.bg.quinary};
  border-top: 1px solid black;
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
	background: ${props => props.theme.bg.senary};
	border-radius: 1rem;
	
	padding: .5rem;
	align-items: center;
	justify-content: center;
	
	&:hover {
		cursor: pointer;
	}
	
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
  border-bottom: 1px solid ${props => props.theme.bg.tertiary};
	//padding: 1rem;
`

export const ContentTitle = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
	font-weight: ${props => props.theme.fontWeight.bold};
`
export const LotName = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
	font-weight: ${props => props.theme.fontWeight.bold};
  white-space: nowrap ;
  margin-right: 2rem;
  margin-bottom: .5rem;
`



export const CalendarContainer = styled.div`
	overflow: auto;
	
	${rowCss};
`

export const RowContainer = styled.div`
	display: flex;
  align-items: center;
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
	border-bottom: 1px solid ${props => props.theme.bg.tertiary};
	border-top: 1px solid ${props => props.theme.bg.tertiary};
`

export const HistoryItemContainer = styled.div`
	display: flex;
	padding: 1rem;
	background: rgba(200,0,200,0.2);
	margin-bottom: 1rem;
	border-radius: 1rem;
	background: ${props => props.theme.bg.quinary};

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
	background: ${props => props.theme.bg.senary};
	padding: .5rem;
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
`



