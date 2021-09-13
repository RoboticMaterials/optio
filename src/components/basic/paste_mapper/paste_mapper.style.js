import styled, {css} from "styled-components"
import {commonClickableIcon, disabledButtonCss, iconButtonCss, newGlow, trapezoidCss} from "../../../common_css/common_css";
import {containerLayout} from "../../../common_css/layout";
import theme from "../../../theme";
import { LightenDarkenColor } from '../../../methods/utils/color_utils'

const scrollCss = css`
::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        margin: 1rem;
        background: transparent;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: rgba(175,175,175,0.75);
    }

    ::-webkit-scrollbar-track:hover {
        background: rgba(175,175,175,0.6);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #27272b;
        border-radius: .5rem;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;

    }
`

export const Container = styled.div`
    display: flex;
    ${containerLayout};
    align-self: center;
    overflow: hidden;
    border-radius: 1rem;
    flex-direction: column;
    z-index: 5000;
    overflow: hidden;
    height: 90vh;
    width: 90vw;
    background: ${props => props.theme.bg.primary};
`

export const Header = styled.div`
    background: ${props => props.theme.bg.secondary};
    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 1rem;
`

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding-right: 1rem;
`

export const Footer = styled.div`
    background: ${props => props.theme.bg.secondary};
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
    padding: 1rem;
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

export const SectionBreak = styled.hr`
    border-top: 2px solid ${props => props.theme.bg.secondary};
    width: 100%;
    margin: 0;

`




export const TableContainer = styled.div`
    padding: 1rem;
    overflow: auto;
    flex: 1;



    ${scrollCss};



`
export const Table = styled.div`
    width: fit-content;
    overflow: hidden;
	display: flex;
`

export const Column = styled.div`
    flex-direction: column;
    align-self:stretch;
    flex: 1;
    display: flex;
    background: ${props => props.theme.bg.primary};
    min-width: 13rem;
    align-items: stretch;

    // border-right: 1px solid ${props => props.theme.bg.quaternary};
    // border-bottom: 1px solid ${props => props.theme.bg.quaternary};
`

export const Row = styled.div`
    align-self:stretch;
    flex: 1;
    display: flex;
    border: 1px solid ${props => props.theme.bg.primary};
`

export const cellCss = css`

`

export const FieldNameTab = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4rem;
    min-height: 4rem;
`
export const Trapezoid = styled.div`
    position: absolute;
    // transform: translate(-50%, -50%);
    z-index: 0;
    background: ${props => props.theme.bg.secondary};
    ${trapezoidCss};
    width: 94.5%;
    height: 100%;
    border: none;
`

export const Receptacle = styled.div`
    position: absolute;
    bottom: 0;
    // transform: translate(-50%, -50%);
    width: 100%;
    height: 50%;
    background: ${props => props.theme.bg.tertiary};
    padding: 0.2rem 0;
`

export const CloseIcon = styled.i`
    font-size: 1.4rem;
    margin: 1rem;
    color: ${props => props.theme.bg.quaternary};
    cursor: pointer;
`

export const ReceptacleInner = styled.div`
    position: absolute;
    // transform: translate(-50%, -50%);
    width: 99%;
    height: 90%;
    bottom: 2px;
    border-radius: 1.8rem;

    ${props => props.filled ? `
        background: ${props.theme.bg.primary};
        box-shadow: 0 2px 4px 0px rgba(0, 0, 0, 0.3);
        `
        :
        `
        background: ${LightenDarkenColor(props.theme.bg.secondary, 10)};
        box-shadow: inset 0 1px 4px 1px rgba(0, 0, 0, 0.1);
        `
    }

`

export const ItemContainer = styled.div`
    overflow: hidden;
    position: relative;

    // border-left: 1px solid ${props => props.theme.bg.quaternary};
    border-right: 1px solid ${props => props.theme.bg.quaternary};
    // border-top: 1px solid ${props => props.theme.bg.quaternary};
    border-bottom: 1px solid ${props => props.theme.bg.quaternary};

    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    min-height: 2rem;
    max-height: 2rem;





    background: ${props => props.selected && LightenDarkenColor(props.theme.fg.primary, 50)}
`

export const Cell = styled.div`

    overflow: auto;
    ::-webkit-scrollbar {
        display: none;
    }
    border-radius: .5rem;
    flex: 1;
    align-self: stretch;
    text-align: center;
    padding: 0 .5rem;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    align-self: stretch;
    padding: 1rem 0;
    min-height: fit-content;

`

export const FieldNamesContainer = styled.div`
    overflow-x: auto;
    min-height: fit-content;
    padding: 1rem;
    align-self: stretch;
    ${scrollCss};
    margin-bottom: 1rem;
`

export const SectionTitle = styled.span`
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
    margin-bottom: 1rem;
`

export const SectionDescription = styled.span`
    margin: 0;
    padding: 0;
    text-align: center;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    font-size: ${props => props.theme.fontSize.sz4};
    //margin-bottom: 1rem;
    margin-top: 1rem;
    margin: 0 1rem;
`

export const FieldButton = styled.div`
    background: ${props => props.disabled ? props.theme.bg.secondary : props.theme.bg.primary};
    box-shadow: ${props => props.disabled ? 'none' : '0 2px 4px 0px rgba(0, 0, 0, 0.3)'};
    margin: 0.5rem;
    //padding: 1rem;
    border-radius: 1.4rem;
    min-width: fit-content;
    display: flex;
    flex-direction: column;
    color: ${props => props.disabled ? props.theme.bg.quaternary : props.theme.bg.octonary};
    overflow: hidden;
    align-items: stretch;
    pointer: grabbing;
    height: 2.8rem;
`

export const FieldName = styled.div`
    font-size: ${props => props.theme.fontSize.sz3};
    min-width: fit-content;
    padding: .5rem 1rem;
    pointer: grabbing;
`

export const FieldDescription = styled.div`
    font-size: ${props => props.theme.fontSize.sz5};
    background: ${props => props.disabled ? "pink" : props.theme.bg.senary};
    padding: .25rem;
    display: inline-flex;
    min-width: fit-content;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.bg.secondary};
    font-style: italic;
`





export const SelectButton = styled.button`
    ${iconButtonCss};
    ${commonClickableIcon};
    margin-right: .5rem;
    font-size: 1.5rem;
    color: ${props => props.color};

    &:hover {

    }

    &:active {

    }
`




export const buttonViewCss = css`
    color: ${props => props.theme.bg.quinary};
    padding: 0;
    margin: 0;
    margin: 0 .25rem;
    padding-left: .5rem;
    padding-right: .5rem;
    background: ${props => props.theme.bg.senary};

    &:hover {
      cursor: pointer;
    }
`


export const buttonViewSelectedCss = css`
    background: ${props => props.theme.bg.tertiary};
    color: ${props => props.theme.bg.octonary};
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

export const buttonGroupContainerCss = css`
	display: flex;
	flex-direction: row;
	align-self: center;
	padding: 0;
	margin: 0;

`
