import styled from "styled-components";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";

export const Header = styled.div`
    flex-grow: 1;
    display: flex;

    flex-direction: row;
    // align-items: center;
    justify-content: flex-start;

    margin: 0rem 5rem 0rem 5rem;

    height: 6rem;
    max-height: 6rem;
    min-height: 6rem;
    line-height: 6rem;

`

export const Title = styled.h2`
    color: ${props => props.theme.bg.octonary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz1};

    flex-grow: 1;

    text-align: center;
    line-height: 6rem;

    // tablet style
    @media only screen and (max-width: ${props => props.theme.widthBreakpoint.tablet}) {
        font-size: ${props => props.theme.fontSize.sz2};
    }
    user-select: none;

    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const LotsTitle = styled.h2`
    color: ${props => props.theme.bg.octonary};
    font-family: ${props => props.theme.font.primary};
    font-size: 1.5rem;
    padding-right:1rem;
    padding-top:0.4rem;

`

export const SidebarButton = styled(AssignmentOutlinedIcon)`
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz1};

    border:none;
    padding:0;
    margin:0;
    outline: none;
    background: transparent;
`


export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    margin-left:2rem;
    margin-right:2rem;
    padding-top:1rem;
    padding-right:2rem;
    padding-bottom: 1rem;
    width: 90%;
    height: 3.5rem;
    overflow:hidden;
    flex-wrap: wrap;



    @media only screen and (max-width: ${props => props.theme.widthBreakpoint.tablet}) {
        margin-left: 2rem;
        margin-right: 2rem;
    }
`

export const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

`
export const Dots = styled.div`
    align-items: center;
    justify-content: flex-start;
    height: 1.7rem;
    color: white;
    width:15rem;

    white-space: nowrap;
    text-overflow: ellipsis;

    padding-top: .2rem;


`


