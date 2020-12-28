import styled from 'styled-components'

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
    border-radius: 1rem;
    align-items: center;
`

export const LotsContainer = styled.div`
    width: 100%;
    height: 100%;
    justify-content: center;

    background: ${props => props.theme.bg.quaternary};

`

export const ListItemRect = styled.div`
    height: 5rem;
    border-radius: 0.5rem;
    margin-left:1rem;
    margin-right:2rem;
    margin-top:0.5rem;

    border: 0.1rem solid white;
    box-sizing: border-box;

    &:hover {
      //border-color: #798fd9;
      //background-color: white;

    }
`

export const ListSubtitle = styled.div`
    text-align: flex-start;
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

export const ListContent = styled.div`
    text-align: flex-start;
    width: 100%;
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

export const StationName = styled.h1`
    color: ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
`

export const Header = styled.div`
	  background: ${props => props.theme.bg.quinary};
  	border-bottom: 1px solid black;
  	width: 100%;
  	padding: 1rem;
`

export const Subtitle = styled.h1`
    color: ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};

`

export const SubtitleContainer = styled.div`
    display:flex;
    justify-content:space-between;
    flex-direction: row;
    padding-left: 1rem;
    padding-top: 1rem;
    padding-right:1.5rem;
    padding-bottom:.5rem;
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
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    padding-left: 1rem;
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

export const ListContainer = styled.div`
	width: 100%;
	flex: 1;

    padding: .1rem;
    padding-top: 1.5rem;

	overflow: auto;

	// optionally style scroll bar
	::-webkit-scrollbar {
	}
	::-webkit-scrollbar-thumb {
	}
`
