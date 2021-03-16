import styled from "styled-components";

export const ListItemRect = styled.div`
    height: 5rem;
    border-radius: 0.5rem;
    margin-left:1rem;
    margin-right:2rem;
    margin-top:0.5rem;

    border: 0.1rem solid white;
    box-sizing: border-box;

    &:hover {
    }
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    padding-top:.5rem;
`


export const ColumnContainer1 = styled.div`
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

export const ColumnContainer2 = styled.div`
    display: flex;
    flex:1;
    flex-direction: column;
    height: 100%;
`

export const ListItemIcon = styled.i`
    font-size: 1.8rem;
    color: #ffb62e;
    padding-top: .9rem;
    padding-right:1rem;



    &:hover {
        cursor: pointer;
        color:yellow;
    }
`


export const ListContent = styled.div`
    height:100%;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    font-weight: 500;
    color: ${props => props.theme.bg.octonary};

    padding-left:1rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const ListSubtitle = styled.div`
    width: 100%;
    height:100%;

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    font-weight: 500;
    color: ${props => props.theme.bg.senary};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`