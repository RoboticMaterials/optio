import styled, { css } from "styled-components";
import {commonClickableIcon, iconButtonCss} from "../../../../../common_css/common_css";
import { LightenDarkenColor } from "../../../../../methods/utils/color_utils";

const scrollCss = css`
::-webkit-scrollbar {
        width: 10px;
        height: 5px;
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

export const ColumnContainer = styled.div`
  display: flex;
  margin-right: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
//   background: ${props => props.theme.bg.secondary};
  padding: .25rem 1rem 0 1rem;
  border-radius: .4rem;
//   height: fit-content;
  
//   margin-bottom: 1rem;
  
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`

export const Description = styled.span`
  color: ${props => props.theme.textColor};
  white-space: nowrap;
  ${props => props.css && props.css};
  font-size: ${props => props.theme.fontSize.sz4};
  margin-bottom: .25rem;
`

export const FiltersContainer = styled.div`   

`

export const ExpandableContainer = styled.div`
    position: absolute;

    background-color: ${props => props.theme.bg.tertiary};
    border-radius: 0.2rem;
    min-height: 2.3rem;
    min-width: 10rem;
    max-width: 30rem;

    display: flex;
    flex-direction: column;
    z-index: 2;

    ${props => props.open && `box-shadow: 0 0 6px 3px rgba(0,0,0,0.2)`}
`

export const RemoveIcon = styled.button`
    ${iconButtonCss};
    font-size: 0.8rem;
    margin-left: 0.2rem;
    color: ${props => props.theme.textColor};
`

export const ExpandContractIcon = styled.div`
	${iconButtonCss};
    color: ${props => props.theme.textColor};
    line-height: 1.3rem;
    height: 1.3rem;
    cursor: pointer;
`

export const ActiveContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0.5rem; 
    min-width: 15rem;
    maxw-width: 25rem;

    ${props => !props.open &&
        `max-height: 2.3rem;
        overflow: hidden;`
    }
`

export const ActiveFiltersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
`

export const ActiveFilter = styled.span`
    background-color: ${props => LightenDarkenColor(props.theme.schema.lots.solid, 0)};
    height: 1.5rem;
    border-radius: 0.75rem;
    padding: 0.3rem 0.6rem;
    line-height: 0.9rem;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
`

export const NewFilterContainer = styled.div`
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
`

export const FlagsContainer = styled.div`
	display: flex;
  overflow-x: auto;
  flex: 1;
  
  ${scrollCss};
`

const selectedCss = css`
	background: ${props => props.theme.bg.secondary};
`

export const FlagButton = styled.button`
	${iconButtonCss};
	${commonClickableIcon};	
	${props => props.selected && selectedCss};
`

export const AddFilterButton = styled.button`
    border: none;
    background-color: ${props => props.theme.schema.lots.solid};
    height: 2rem;
    color: white;
    padding: 0 1rem;
    border-radius: 2rem;
    line-height: 2rem;
    box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.1);
`
export const DualSelectionButton = styled.button`
    font-size: 1rem;
    width: 50%;
    border: none;
    font-family: ${props => props.theme.font.primary};

    color: ${props => props.selected ? props.theme.bg.octonary : props.theme.bg.quinary};

    background-color: ${props => props.selected ? props.theme.schema.tasks.solid : props.theme.bg.secondary};

    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    &:hover{
        //background-color: ${props => props.theme.bg.quaternary};
    }
`