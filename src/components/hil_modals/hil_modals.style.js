import styled, { css } from 'styled-components'

export const HilContainer = styled.div`
    position: absolute;
    // right: 1rem;
    // top: .5rem;
    // left: 1rem;
    // bottom: 2rem;
    margin: .5rem 1rem 2rem 1rem;
    width: 90%;
    height: 90%;
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

    overflow-y: scroll;
    // overflow: hidden;

    ::-webkit-scrollbar {
        display: none;  /* Safari and Chrome */
    }

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){

        
        margin: .5rem;
    }

`

export const HilInputContainer = styled.div`
    display: flex;
    flex-direction: row;
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
    padding-left:2rem;
    padding-top:1rem;
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


    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        // padding: 0rem 2rem;
    }
    
    overflow: hidden;
`

export const LotsContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;
    overflow: auto;
    flex: 1;
    padding: 1rem 1rem 1rem 1rem;
    
    
`

export const LotFooter = styled.div`
    background: ${props => props.theme.bg.septenary};
    border-top: 1px solid ${props => props.theme.bg.tertiary};
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .5rem;
`


export const HilMessage = styled.h3`
    display: flex;
    font-family: ${props => props.theme.font.primary};
    justify-content: center;
    padding-top: 1rem;
    margin-top: 3rem;
    font-size: ${props => props.theme.fontSize.sz1};
    text-align: center;
`
export const LotDropdownContainer = styled.div`
  width: 50%;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
`


export const DeselectLotIcon = styled.button`
    font-size: 3rem;
    text-shadow: 0.05rem 0.05rem 0.2rem #303030;
    transition: text-shadow 0.1s ease, filter 0.1s ease;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-25%,-25%);
    color: red;

    &:hover {
        cursor: pointer;
        filter: brightness(85%);
    }
    z-index: 200;
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
    height: 10rem;
    min-height: 10rem;
    max-height: 10rem;

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

export const Header = styled.div`
    display: flex;
    width: 100%;
    background: ${props => props.theme.bg.septenary};
    border-bottom: 1px solid ${props => props.theme.bg.tertiary};
    align-items: center;
    justify-content: center;
  align-items: center;
`

export const HilIcon = styled.i`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto auto;
    color:  ${props => props.color};
    fill: green;
    font-size: 5rem;
    &:hover {
        cursor: pointer;
    }

    &:active{
        filter: brightness(85%)
    }
`

export const HilButton = styled.button`
    ${HilButtonCss};
`

export const LotButton = styled.button`
    ${HilButtonCss};
    align-items: center;
    justify-content: center;
    min-height: 5rem;
    height: 5rem;
    color: black;
    border: ${props => props.isSelected ? "1px solid cyan" : "none"};
    
    background-color: ${props => props.theme.schema[props.schema].solid};
    filter: brightness(${props => props.filter});
    margin-bottom: 2rem;
    ${props => !props.isSelected && "filter: grayscale(80%)"};
    // filter: brightness(${props => props.filter});
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
    padding: .5rem;
    align-items: center;
  
    padding: .25 2.5rem;
    
`

export const SelectedLotName = styled.div`

    background: ${props => props.theme.bg.senary};
    padding: .5rem;
    border-radius: 1rem;
    padding: .25 2.5rem;
    
`

export const InvisibleItem = styled.div`
    visibility: hidden;
    margin-left: auto;
    height: 1rem;
    width: 1rem;
    // background: blue;

`

export const LotTitleName = styled.span`
    color:  black;
    font-size: 2rem;
    margin: 0;
    padding: 0;
    
`

export const EditLotIcon = styled.i`
    margin-left: 2rem;
    font-size: 1.5rem;
`

export const HilButtonText = styled.p`
    color:  ${props => props.color};
    font-size: 2rem;
`
