import styled from "styled-components";
import {Form, Formik} from "formik";
import SmallButton from "../../../../basic/small_button/small_button";
import * as pageStyle from "../dashboards_header/dashboards_header.style"

export const Header = styled(pageStyle.Header)`
    // align-items: center;
`

export const Title = styled(pageStyle.Title)`
    margin-right: 1rem;
`

export const FooterContainer = styled.div`
    z-index: 0;
    width: 100%;
    margin:0;
    
    display: flex;
    justify-content: center;
    
    background-image: linear-gradient(to top, ${props => props.theme.bg.tertiary}, ${props => props.theme.bg.primary});
    border-top: thin solid ${props => props.theme.bg.tertiary};
    box-shadow: 0px 0px 15px black;
    
    padding: 1rem;
`

export const Container = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	max-height: 100%;
  overflow: hidden;
  max-width: 100%;
  flex: 1;
`

export const StyledForm = styled(Form)`

    display: flex;
    flex-direction: column;
    
    //width: 100%;
  flex: 1;
    height: 100%;
    max-height: 100%;

    background: ${props => props.theme.bg.quaternary};
    
`

export const BodyContainer = styled.div`
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;
    
    margin: 0;
    padding: 0;

    // hide scroll bar
	::-webkit-scrollbar {
		width: 0px;  /* Remove scrollbar space */
		// background: transparent;  /* Optional: just make scrollbar invisible */
	}
	::-webkit-scrollbar-thumb {
		background: transparent;
	}
    
`

export const Button = styled(SmallButton)`
    margin-left: 1rem;
    margin-right: 1rem;
    
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    
`

export const TitleTextbox = styled.input`

    font-size: ${props => props.theme.fontSize.sz2};

    &::placeholder {
        font-size: ${props => props.theme.fontSize.sz2};
    }

`;