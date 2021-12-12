import styled from 'styled-components'
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import {RGB_Linear_Shade, hexToRGBA, LightenDarkenColor} from "../../../../../../methods/utils/color_utils";
import * as pageStyle from "../../../../../widgets/widget_pages/dashboards_page/dashboards_header/dashboards_header.style"
import {glow, goodGlow} from "../../../../../../common_css/common_css";


export const FooterContainer = styled.div`
	width: 100%;
	display: flex;
	overflow-x: scroll;
	overflow-y: hidden;
	padding: 1rem;
	border-top: 1px solid ${props => props.theme.bg.quaternary};
	background: ${props => props.theme.bg.tertiary};
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

export const TitleText = styled.h1`
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.bg.octonary};
  font-size: 1.2rem;
  margin-top: 1.5rem;
`

export const Container = styled.div`

    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    overflow: hidden;
    flex: 1;
    background: ${props => LightenDarkenColor(props.theme.bg.quaternary, 80)};
  	padding: 0;

`

export const Footer = styled.div`
    align-self: stretch;
    background: ${props => props.theme.bg.quinary};
    display: flex;
    justify-content: center;
    border-top: 1px solid black;
    padding: .25rem 0;
`



export const CloseButton = styled(CloseOutlinedIcon)`
	z-index: 5;
`

export const LotTemplateButton = styled.div`

  display: flex;
  align-items: center;
  height: 3rem;
  justify-content:  flex-start;
  background: transparent;
  padding: 0rem 1rem;

  border-radius: 0.3rem;
  border: ${props =>  props.error ? '0.1rem solid red' : 'none'};

  box-shadow: ${props => props.theme.cardShadow};
  cursor: pointer;

  background: ${props => props.isSelected ? props.theme.schema.lots.solid : props.theme.bg.primary};

  margin-bottom: 1rem;
`
export const TemplateIcon = styled.div`
	  font-size: 1.6rem;
  	position: relative;
  	color: ${props => props.isSelected ? props.theme.bg.primary : props.theme.bg.quinary};
    margin-right: 1rem;

`
export const EditTemplateIcon = styled.button`
  color: ${props => props.theme.bg.tertiary};
	background: none;
	outline: none !important;
	font-size: 1.6rem;
	right: 1rem;
	border: none;
`

export const Row = styled.div`
	display: flex;
`

export const TemplateName = styled.span`
	font-size: 1.5rem;
  align-self: center;
  color: ${props => props.isSelected ? props.theme.bg.primary : props.theme.bg.octonary};
  flex-grow: 1;
  user-select: none;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

	//color: black;
  //position: absolute;
  //top: 50%;
  //left: 50%;
  //transform: translate(-50%, -50%);
`

export const ListContainer = styled.div`

  position: relative;
  padding: 1rem;
  vertical-align: middle;
  display: inline-block;

  display: flex;
  flex-direction: column;
  flex-grow: 1;

  overflow-y: auto;
  overflow-x: hidden;
  //z-index: 1;

  background: ${props => props.theme.bg.primary};

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

// NEW SIDEBAR STUFF
export const SidebarWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: stretch;
    flex-flow: row nowrap;
    flex-direction: row;
    width: ${props => props.width};
    flex-grow: 0;
    z-index: 1;
    align-self: stretch;
    overflow: hidden;
    // box-shadow: 2px 0px 6px 2px rgba(0,0,0,0.4);
`

export const SidebarContent = styled.div`
    display: flex;
    align-self: stretch;

    // background: ${props => props.theme.bg.primary};
    z-index: 1;

    // border-right: 8px solid ${props => LightenDarkenColor(props.theme.bg.quinary,20)};
    overflow: hidden;
    margin-left:0.5rem;
    margin-right: 0.5rem;
`

export const ResizeBar = styled.div`
    cursor: ew-resize;
    width: 8px;
    // margin-right: -8px;
    background: transparent;
    background: ${props => props.theme.bg.tertiary};
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
    background: ${props => props.theme.fg.primary};
    border-radius: 8px;
    text-align: center;
    z-index: 2;
    overflow: hidden;
    display: flex;
    align-items: center ;

`
