import styled, { css } from 'styled-components'
import * as commonCss from "../../common_css/common_css";
import {iconButtonCss} from "../../common_css/common_css";

export const HilContainer = styled.div`
    position: absolute;
    // right: 1rem;
    // top: .5rem;
    // left: 1rem;
    // bottom: 2rem;
    //margin: .5rem 1rem 2rem 1rem;
    width: 98%;
    height: 98%;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

    z-index: 1000;
    border-radius: 1rem;
    box-shadow: 0 0.2rem 0.4rem 0rem #303030;
    display: flex;
    /* flex-flow: row; */
    flex-direction: column;
    background-color: white;

    //overflow-y: scroll;
     overflow: hidden;

    ::-webkit-scrollbar {
        display: none;  /* Safari and Chrome */
    }

`

export const HilInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
    margin-top: 1rem;
`

export const HilInput = styled.input`
    margin: 1rem 1rem;
    border-radius: .5rem;
    text-align: center;
    width: 8rem;
    font-size: 2rem;
    -webkit-appearance: none !important;
    &:focus{
        outline: 0 !important;
        border-color: #56d5f5;
    }
`
export const HilInputIconContainer = styled.div`
    display: flex;
    flex-direction:row;
    height: 3.3rem;

    margin-left:0.4rem;
    margin-right:0.4rem;
    margin-top:1rem;

    border-radius: 0.5rem;
    border: 0.2rem solid;
    border-color: ${props => props.theme.bg.quinary};
    background-color: ${props => props.theme.bg.quinary};


    &:hover {
        cursor: pointer;
    }

    &:active{
        filter: brightness(85%);
        text-shadow: none;
    }
`
export const HilInputIconText = styled.h1`
  font-size: 2.5rem;
  font-weight: 500;
  padding-right:.3rem;
  user-select: none;

  text-shadow: 0.05rem 0.05rem 0.15rem #303030;
  transition: text-shadow 0.1s ease, filter 0.1s ease;


`
export const HilInputIcon = styled.i`
    padding-top: .45rem;
    margin-left:.5rem;
    margin-right:.5rem;
    font-size: 2rem;
    text-shadow: 0.05rem 0.05rem 0.2rem #303030;
    transition: text-shadow 0.1s ease, filter 0.1s ease;
    color: #90eaa8;

`

export const HilExitModal = styled.i`

    font-size: 5rem;
    text-shadow: 0.05rem 0.05rem 0.2rem #303030;
    transition: text-shadow 0.1s ease, filter 0.1s ease;
    //padding-left:2rem;
    //padding-top:1rem;
    margin-right: 1rem;

    &:hover {
        cursor: pointer;
    }

    &:active{
        filter: brightness(85%);
        text-shadow: none;
    }
`

export const HilBorderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    flex: 1;
    overflow: auto;

`

export const HilButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-width: 50rem;
    // margin-top: 1rem;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        padding: 0rem 2rem;
    }



`
export const addLotsCss = css`
    height: 1rem;
    width: fit-content;
    padding: .5rem;
    margin: 0;
`

export const addLotsTextCss = css`
    font-size: ${props => props.theme.fontSize.sz3};
`

export const addLotsIconCss = css`
    font-size: 2rem;
`


export const InnerHeader = styled.div`
    align-self: stretch;
    display: flex;
    justify-content: flex-end;
    margin: .5rem 0;
    padding: 0 1rem;
`


export const LotSelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    width: 100%;

    overflow: hidden;
    
    background: ${props => props.theme.bg.secondary};
    
`

export const InnerContentContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    align-self: stretch;
    flex: 1;
    overflow: hidden;
    align-items: center;
    margin: 0 1rem 1rem 1rem;
    border: 3px solid #cacaca;
    justify-content: center;
    border-radius: 2rem;
    background: ${props => props.theme.bg.primary};
`

export const NoLotsContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
`

export const NoLotsText = styled.span`
    font-size: ${props => props.theme.fontSize.sz1};
    font-family: ${props => props.theme.font.primary};
`


export const SubtitleContainer = styled.div`
    display: flex;
    width: 100%;
    overflow: auto;
    justify-content: center;
    padding-bottom:1rem;
`

export const FooterContainer = styled.div`
    background: ${props => props.theme.bg.septenary};
    border-top: 1px solid ${props => props.theme.bg.secondary};
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .5rem;
    flex-direction: row;
`


export const HilMessage = styled.h3`
    display: flex;
    font-family: ${props => props.theme.font.primary};
    justify-content: center;
    align-self: center;

    //padding-top: 1rem;
    //margin-top: 3rem;
    padding: 0;
    margin: 0;
    font-size: ${props => props.theme.fontSize.sz1};
    text-align: center;
`

export const HilSubtitleMessage = styled.h4`
    display: flex;
    font-family: ${props => props.theme.font.primary};
    justify-content: center;
    margin-bottom: 1.5rem;
    //margin-top: 3rem;
    padding: 0;
    margin: 0;
    font-size: 1.6rem;
    text-align: center;
`
export const InfoText = styled.span`
    display: flex;
    font-family: ${props => props.theme.font.primary};
    justify-content: center;
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.theme.textColor};
    text-align: center;
`



export const HilSubText = styled.span`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
`

export const LotDropdownContainer = styled.div`
  width: 50%;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
`


export const LotTitle = styled.span`
  display: inline-flex;
  font-family: ${props => props.theme.font.primary};
  justify-content: center;
  align-self: center;
  align-items: center;
  font-size: ${props => props.theme.fontSize.sz1};
  text-align: center;
`

export const HilTimer = styled.p`
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    font-family: ${props => props.theme.font.primary};
    font-weight: bold;
    font-size: ${props => props.theme.fontSize.sz2};
    color: ${props => props.theme.fg.primary};
`


const HilButtonCss = css`
  border: none;

    border-radius: 1rem;
    box-shadow: 0 0.1rem 0.2rem 0rem #303030;
    height: 100%;
    min-height: 5rem;
    max-height: 7rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    transition: background-color 0.25s ease, filter 0.1s ease;
    background-color: ${props => props.color};

    margin-bottom: 2rem;

    filter: brightness(${props => props.filter});

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
        filter: brightness(85%);
    }

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        height: 9rem;
    }
`
export const ColumnContainer = styled.div`
  display: flex;
    flex-direction: column;
`

export const RowContainer = styled.div`
  display: flex;
    flex-direction: row;
`

export const Header = styled.div`
    display:flex;
    flex-direction: row;
    width: 100%;
    background: ${props => props.theme.bg.septenary};
    border-bottom: 1px solid ${props => props.theme.bg.secondary};
    align-items: center;
    justify-content: space-around;
    align-items: center;
    padding: .5rem 1rem;
`

export const ScrollContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    align-self: stretch;
    align-items: center;
    padding: 1rem;
`

export const HeaderMainContent = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
`

export const SortFilterContainer = styled.div`
   
    //align-self: stretch;
    //overflow: hidden;
    //width: 40rem;
    //min-width: 10rem;
    //max-width: 50%;

`


export const HilIcon = styled.i`
    display: flex;
    justify-content: center;
    align-items: center;
    //margin: auto auto;
    color:  ${props => props.color};
    fill: green;
    font-size: 2.5rem;
    margin-right: 1rem;
    &:hover {
        cursor: pointer;
    }

    &:active{
        filter: brightness(85%)
    }
`

export const HilButton = styled.button`
    ${HilButtonCss};
    align-items: center;
    justify-content: center;

    //min-height: 5rem;
    //height: 5rem;
    //max-height: 5rem;
    //width: fit-content;
    display: flex;
    flex-direction: row;
    padding: 0rem 3rem;
    align-items: center;
    justify-content: center;
    ${props => props.disabled && "filter: grayscale(80%)"};
`

export const LotButton = styled.button`
    ${HilButtonCss};
    align-items: center;
    justify-content: center;
    min-height: 5rem;
    height: 5rem;
    width: 100%;
    color: black;
    ${props => !props.isSelected && "filter: grayscale(80%)"};
    // border: ${props => props.isSelected ? "1px solid cyan" : "none"};

     background-color: #805858;
    margin-bottom: 2rem;
`

export const footerButtonCss = css`
    min-height: 5rem;
    height: 5rem;
    max-height: 5rem;
    width: fit-content;

    margin-left: 0.5rem;
    margin-right: 0.5rem;
    margin-bottom: 0rem;
    display: flex;
    flex-direction: row;
    padding: 0rem 3rem;
    align-items: center;
    justify-content: center;

`



export const LotButtonText = styled.p`
    color:  black;
    font-size: 2rem;
    margin: 0;
    padding: 0;
`
export const LotTitleDescription = styled.span`
color:  black;
    font-size: 2rem;
    margin: 0;
    padding: 0;
    margin-right: 1rem;
`

export const SelectedLotContainer = styled.div`
    // background: red;
    display: flex;
    //padding: .5rem;
    align-items: center;
    //margin-bottom: 1rem;
    //padding: .25rem 2.5rem;
    //m

`

export const SelectedLotName = styled.div`
    display: flex;
    align-items: center;
    background: ${props => props.theme.bg.quinary};
    padding: .5rem;
    border-radius: 1rem;
    padding: .25rem 2.5rem;
    min-height: 3.5rem;

`

export const InvisibleItem = styled.div`
    visibility: hidden;
    margin-left: auto;
    height: 1rem;
    width: 1rem;

`

export const LotTitleName = styled.span`
    // color:  white;
    font-size: 2rem;
    margin: 0;
    padding: 0;

`

export const HilButtonText = styled.p`
    color:  ${props => props.color};
    font-size: 2rem;
    margin: 0;
    padding: 0;
`

export const HilButtonQuantityText = styled.p`
    color:  ${props => props.color};
    font-size: 2rem;
    margin-left: 1.5rem;
    padding-top: .6rem;
`

export const XContainer = styled.button`
    ${iconButtonCss};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 8rem;
    color: ${props => props.theme.schema.delete.solid};
    // opacity: 60%;
    z-index: 5;
    cursor: pointer;
    
    opacity: 0;
    transition: all 0.3s ease;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover{
        opacity: 1;
    }
    
    
    text-shadow: 0.05rem 0.05rem 0.2rem #303030;
    //transition: text-shadow 0.1s ease, filter 0.1s ease;
    &:hover {
        cursor: pointer;
        filter: brightness(85%);
    }

    &:active{
        filter: brightness(85%);
        text-shadow: none;
    }

    background: none;
    outline: none;
    border: none;

    &:focus {
        outline: none;
    }
    
    
`
export const CardContainer = styled.div`
    width: 80%;
    position: relative;

    
     
`

export const Line1 = styled.div`
    // width: 80%;
    z-index: 1000;
    
     flex: 1;
     width: 100%;
    height: 100%;
    border-bottom: 1px solid red;
    -webkit-transform:
        // translateY(-20px)
        // translateX(5px)
        rotate(27deg); 
    position: absolute;
    /* top: -20px; */
`

export const Line2 = styled.div`
width: 100%;
z-index: 1000;
    height: 100%;
    border-bottom: 1px solid green;
    -webkit-transform:
        // translateY(20px)
        // translateX(5px)
        rotate(-26deg);
    position: absolute;
    top: -33px;
    left: -13px;
`


