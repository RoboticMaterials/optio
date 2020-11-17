import styled, {css} from "styled-components";
import Modal from "react-modal";
import {Form} from "formik";

export const Container = styled(Modal)`
  outline: none !important;
  outline-offset: none !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  right: auto;
  bottom: auto;

  position: absolute;

  background: grey;
  border-width: thin;
  border-radius: .5rem;
  border-color: ${props => props.theme.bg.quarternary};
  border-style: solid;
  z-index: 50;
  
  min-width: 90%;
  max-width: 90%;
  max-height: 90%;
  height: 90%;
  
  color: ${props => props.theme.bg.octonary};
  
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid black;
	padding: 0;
	margin: 0;
	height: 3rem;
	
`

export const CloseButton = styled.button`
	height: 100%;
	width: 3rem;

`

export const Title = styled.span`
	flex: 2;
	height: 100%;
	min-height: 100%;
	margin: 0;
	padding: 0;
	text-align: center;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	background: tan;
	
`


export const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    // overflow-x: hidden;
    border-radius: .5rem;
    background: yellow;
    padding: 1rem;
    position: relative;
    
   
    flex: 1;
    
    justify-content: space-between;
`;

export const BodyContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	flex: 1;
	max-height: 100%;
	justify-content: space-between;
	background: blue;
`

export const WidgetContainer = styled.div`
	display: flex;
	margin-bottom: 1rem;
	padding-left: 1rem;
`

export const Icon = styled.i`
	font-size: 2rem;
	color: ${props => props.color};
	margin-right: 1rem;
	
`

export const InputContainer = styled.div`
	margin-bottom: 1rem;
`

export const ButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0;
	margin: 0;
`

export const StationContainer = styled.div`
	margin-bottom: 1rem;
`

// history
export const HistoryContainer = styled.div`
	display: flex;
	padding: 1rem;
	flex-direction: column;
	background: green;
	max-height: 100%;
	overflow: hidden;
	flex: 1;
`

export const HistoryHeader = styled.div`
	display: flex;
	justify-content: space-between;
`

export const HistoryBodyContainer = styled.div`
	display: flex;
	padding: 1rem;
	background: rgba(200,100,200,0.2);
	flex-direction: column;
	
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 100%;
	flex: 1;
`

export const HistoryItemContainer = styled.div`
	display: flex;
	padding: 1rem;
	background: rgba(200,0,200,0.2);
	margin-bottom: 1rem;

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
	background: rgba(200,200,0,0.2);
`


export const HistoryDateText = styled.span`
	${textCommon};
`

export const HistoryUserContainer = styled.div`
	${historyContainerCommon};
	background: rgba(0,200,0,0.2);
`
export const HistoryUserText = styled.span`
	${textCommon};

`

export const HistoryInfoContainer = styled.div`
	${historyContainerCommon};
	flex: 2;
	background: rgba(200,0,0,0.2);
	align-items: flex-start;
	
`

export const HistoryInfoText = styled.span`
	display: flex;
	background: pink;
	justify-content: flex-start;
	align-items: flex-start;
`

// calendar
export const CalendarContainer = styled.div`
	display: flex;
	padding: 1rem;
	flex-direction: column;
	background: orange;
	overflow: hidden;
	flex: 1;
	
`
