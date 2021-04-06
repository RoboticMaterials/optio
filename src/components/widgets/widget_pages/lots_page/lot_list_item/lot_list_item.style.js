import styled from "styled-components";

export const ListItemRect = styled.div`
    border-radius: 0.5rem;
    margin-left:1rem;
    margin-right:2rem;
    margin-top:0.5rem;
    margin-bottom: 1rem;
    background-color: white;

    border: 1px solid black;

    letter-spacing: 1.5px;
    box-shadow: 2px 2px 2px  rgba(0, 0, 0, 0.5);

    outline: none;
    user-select: none;

`

export const RowContainer = styled.div`
    display: flex;
    min-height: 3.5rem;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    background: ${props => props.theme.bg.septenary};
    margin-bottom: 1rem;

`
export const  ContentRowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 1rem;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid black;
    background: white;

`


export const ColumnContainer = styled.div`
    display: flex;
    flex: 4;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    padding-left: 1rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media only screen and (max-width: ${props => props.theme.widthBreakpoint.tablet}) {
      flex:1;
    }
`
export const ListItemIcon = styled.i`
    font-size: 1.8rem;
    color: #c59bff;
    padding-top: .9rem;
    padding-right:1rem;



    &:hover {
        cursor: pointer;
    }
`


export const ListContent = styled.div`
    height:100%;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    font-weight: 500;
    color: black;

    padding-left:1rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const TextContent = styled.div`
    height:100%;
    font-family: ${props => props.theme.font.primary};
    font-size: 1rem;
    font-weight: 500;
    color: black;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
