import styled, { css } from 'styled-components'

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
`

export const HilInput = styled.input`
    margin: 1rem 1rem;
    border-radius: .5rem;
    text-align: center;
    width: 10rem;
    font-size: 2rem;
    -webkit-appearance: none !important;
    &:focus{
        outline: 0 !important;
        border-color: #56d5f5;
    }
`

export const HilInputIcon = styled.i`
    font-size: 5rem;
    text-shadow: 0.05rem 0.05rem 0.2rem #303030;
    transition: text-shadow 0.1s ease, filter 0.1s ease;


    &:hover {
        cursor: pointer;
    }

    &:active{
        filter: brightness(85%);
        text-shadow: none;
    }
`

export const HilExitModal = styled.i`
    font-size: 5rem;
    text-shadow: 0.05rem 0.05rem 0.2rem #303030;
    transition: text-shadow 0.1s ease, filter 0.1s ease;
    //padding-left:2rem;
    //padding-top:1rem;
    margin-right: auto;

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
    margin-top: 2rem;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        padding: 0rem 2rem;
    }



`

export const LotSelectorContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;

    width: 100%;

    overflow: hidden;
`

export const LotsContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    overflow: auto;
    flex: 1;
    /* padding: 2rem 1rem 1rem 1rem; */
    padding: 1rem;
    align-items: center;
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
    border-top: 1px solid ${props => props.theme.bg.tertiary};
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .5rem;
    flex-direction: column;
`


export const HilMessage = styled.h3`
    display: flex;
    font-family: ${props => props.theme.font.primary};
    justify-content: center;
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

const iconButtonCss = css`
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

export const DeselectLotIcon = styled.button`
    ${iconButtonCss};
    font-size: 3rem;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-25%,-25%);
    color: red;
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
    display: flex;
    width: 100%;
    background: ${props => props.theme.bg.septenary};
    border-bottom: 1px solid ${props => props.theme.bg.tertiary};
    align-items: center;
    justify-content: center;
    align-items: center;
    padding: .5rem 1rem;
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

export const FooterButton = styled.button`
    ${HilButtonCss};

    min-height: 5rem;
    height: 5rem;
    max-height: 5rem;
    width: fit-content;
    display: flex;
    flex-direction: row;
    padding: 0rem 3rem;
    align-items: center;
    justify-content: center;
    margin: 0;
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

export const EditLotIcon = styled.button`
    ${iconButtonCss};
    color: white;
    margin-left: 2rem;
    font-size: 1.5rem;


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
