import styled from 'styled-components'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {RGB_Linear_Shade, hexToRGBA, LightenDarkenColor} from "../../../../../methods/utils/color_utils";
import * as pageStyle from "../dashboards_header/dashboards_header.style"


export const FooterContainer = styled.div`
	width: 100%;
	display: flex;
	overflow-x: scroll;
	overflow-y: hidden;
	padding: 1rem;
	border-top: 1px solid ${props => props.theme.bg.quaternary};
	background: ${props => props.theme.bg.tertiary + "B1"};
`

// export const

export const Title = styled(pageStyle.Title)`
    margin: 0;
    padding: 0;
    
    font-size: ${props => props.isSmall && props.theme.fontSize.sz2};
    
    
`
export const Header = styled(pageStyle.Header)`
    justify-content: center;
`

export const Container = styled.div`
    width: 100%;
    min-width: ${props => props.width};
    height: 100%;
    display: flex;
    
    flex-direction: column;
    // justify-content: flex-start;
    align-items: center;
    z-index: 1;

    flex: 1;
    background: ${props => LightenDarkenColor(props.theme.bg.quaternary, 20)};
    
`



export const CloseButton = styled(CloseOutlinedIcon)`
	z-index: 5;
`

export const ListContainer = styled.div`
    width: 100%;
    height: 100%;
    max-height: 100%;
    padding-top: 3rem;

    padding-left: 2rem;
    padding-right: 2rem;
    
    
    display: flex;
    flex-direction: column;
    // align-items: center;
    // align-self: center;
    
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 1;
    
    background: ${props => LightenDarkenColor(props.theme.bg.quaternary, 20)};
    
    
    // hide scroll bar
    ::-webkit-scrollbar {
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
    }
    ::-webkit-scrollbar-thumb {
        background: transparent;
    }
    
`

// adds padding to handle to make it easier to click
export const HandleContainer = styled.div`
    padding: .75rem;
    position: absolute;
    right: -2rem;
    top: 50%;
    transform: translateY(-50%);
  
    &:hover {
        cursor: grab;
    }
    z-index:3;
`

export const HandleIcon = styled.div`
    width: 10px;
    background: ${props => props.theme.bg.septenary};
    height: 3rem;
     border-radius: .25rem;
`

export const ButtonContainer = styled.div`
	diplay: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`

export const ButtonExistsText = styled.span`
	font-size: ${props => props.theme.fontSize.sz3};
  	color: white;
  text-align: center;
`

// NEW SIDEBAR STUFF
export const SidebarWrapper = styled.div`
    height: 100%;
    position: relative;

    display: flex;
    align-items: stretch;
    flex-flow: row nowrap;
    flex-direction: row;
    flex-grow: 0;
    z-index: 1;

    background: white;
    overflow: hidden;

    // box-shadow: 2px 0px 6px 2px rgba(0,0,0,0.4);
`

export const SidebarContent = styled.div`
    display: flex;
    align-self: stretch;
    flex-grow: 1;

    // background: ${props => props.theme.bg.primary};
    z-index: 1;

    border-right: 8px solid ${props => LightenDarkenColor(props.theme.bg.quinary,20)};
    
`

export const ResizeBar = styled.div`
    cursor: ew-resize;
    width: 8px;
    margin-right: -8px;
    background: transparent;
    display: flex;
    z-index: 20;
    align-items: center ;
    align-content: center ;
    justify-content: center;
`

export const ResizeHandle = styled.div`
    cursor: ew-resize;
    width: 4px;
    height: 30px;
    background: ${props => props.theme.bg.octonary};
    border-radius: 8px;
    text-align: center;
    z-index: 2;
    overflow: hidden;
    display: flex;
    align-items: center ;

`