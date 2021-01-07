import styled from 'styled-components';
import TimePicker from 'rc-time-picker';
import {css} from 'styled-components'


export const ProcessFieldContainer = styled.div`
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
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

export const ErrorTooltipContainerComponent = styled.div`
	//align-self: center;
  width: auto;
  height: auto;
  position: absolute;
  z-index: 500;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  margin: 0;
  padding: 0;
`


