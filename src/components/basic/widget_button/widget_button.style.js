import styled from "styled-components";

export const WidgetText = styled.span`
	font-size: ${props => props.labelSize ? props.labelSize : props.theme.fontSize.sz6};
	font-family: ${props => props.theme.font.primary};
	
	text-align: center;
	align-self:center;
	
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;


export const WidgetIcon = styled.i`
    font-size: 2.2rem;
    color: ${props =>  props.color };

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

export const WidgetButton = styled.button`
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
    overflow: hidden;
    
    padding-top:.5rem;

    box-shadow: 0 0.1rem 0.2rem 0rem #303030;

    background-color: ${props => props.selected ? props.theme.bg.quaternary : props.theme.bg.septenary};

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