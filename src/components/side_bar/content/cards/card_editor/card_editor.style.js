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

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0;
	margin: 0;
	//height: 3rem;
	background: ${props => props.theme.bg.quinary};
  margin-bottom: 1rem;
	
`

export const NameContainer = styled.div`
	background: ${props => props.theme.bg.quaternary};
	width: 100%;
	//padding: 0rem 1rem;
  	margin-bottom: 1rem;
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
  margin-right: 1rem;
  color: ${props => props.highlight ? props.theme.schema[props.schema].solid : "white"};
`

export const SectionContainer = styled.div`
	border-bottom: 1px solid ${props => props.theme.bg.quinary};
  padding: 0 1rem;
  //display: flex;
  
  //background: green;
  display: flex;
  flex-direction: column;
`

export const ProcessOptionsContainer = styled.div`
	//margin-bottom: 1rem;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  //padding: 1rem;
  align-self: center;
`

export const ProcessOption = styled.div`
	padding: 1rem;
  	background: ${props => props.isSelected ? props.theme.bg.secondary : props.theme.bg.quinary};
  //width: fit-content;
  margin-right: 1rem;
  border-radius: 1rem;
  min-width: 5rem;
  display: inline-flex;
  justify-content: center;

  font-size: ${props => props.theme.fontSize.sz3};
  font-weight: ${props => props.theme.fontWeight.normal};
`

export const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    max-width: 100%;
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

export const BodyContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	flex: 1;
	justify-content: space-between;
	overflow: auto;
  min-height: ${props => props.minHeight};
	
	background: ${props => props.theme.bg.quaternary};
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
	//flex-direction: column;
	align-items: center;
	//background: red;
	margin-bottom: 1rem;
`


export const ObjectTitleContainer = styled.div`
	display: flex;
	margin-right: 1rem;
  flex: 1;
`

export const CountInput = styled.input`
	width: fit-content;
`

export const ObjectLabel = styled.span`
	display: inline-flex;
	margin-right: 1rem;
	font-weight: bold;
  align-items: center;
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
	flex-direction: row;
	align-items: center;
	padding: 0;
	margin: 0;
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

export const ContentTitle = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
	font-weight: ${props => props.theme.fontWeight.bold};
`

export const CalendarContainer = styled.div`
	overflow: auto;
	
	${rowCss};
`

export const RowContainer = styled.div`
	display: flex;
	margin-bottom: 1rem;
`



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
	margin: 0 0 1rem 0;
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



