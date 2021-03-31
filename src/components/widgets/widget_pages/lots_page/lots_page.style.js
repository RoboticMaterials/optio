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
    padding-bottom:1rem;

    background: ${props => props.theme.bg.secondary};



`


export const StationName = styled.h1`
    color: ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
`

export const Header = styled.div`
    background: ${props => props.theme.bg.primary};
    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.2);
  	width: 100%;
  	padding: 1rem;
`

export const Subtitle = styled.h1`
    color: ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz2};
    position: flex-end;

`

export const SubtitleContainer = styled.div`
    display:flex;
    justify-content:space-between;
    flex-direction: row;
    padding-left: 1rem;
    padding-top: 1rem;
    padding-right:1.5rem;
    padding-bottom:.5rem;
    position: relative;
`
export const ContentContainer = styled.div`
    width: 100%;
    height: 100%;
    justify-content: center;
    padding-bottom:6rem;
    overflow: auto;

    // optionally style scroll bar
    ::-webkit-scrollbar {
    }
    ::-webkit-scrollbar-thumb {
    }
`
