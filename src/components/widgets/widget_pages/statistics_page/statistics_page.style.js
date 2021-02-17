import styled from 'styled-components'

export const StatisticsContainer = styled.div`
    height: 100%;
    width: 100%;

    background: ${props => props.theme.bg.quaternary};
`

export const StatisticsSectionsButtonContainer = styled.div`
    display: flex;
    /* position: absolute; */
    text-align: center;
    justify-content: center;
    left: 0;
    right: 0;
    top: .5rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.5rem;
    width: 15rem;
    /* background-color: red; */
`

export const StatisticsSectionsButton = styled.button`
    font-size: 1.5rem;
    width: 10rem;
    border: none;
    font-family: ${props => props.theme.font.primary};

    box-shadow: ${props => props.selected ? 'none' : '0 0.1rem 0.2rem 0rem #303030'};

    z-index: ${props => props.selected ? '0' : '1'};
    background-color: ${props => !props.selected ? props => props.theme.bg.septenary : props => props.theme.bg.senary};

    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    &:hover{
        background-color: ${props => props.theme.bg.quaternary};
    }
`

export const StatisticsDownloadButton = styled.button`
    display: auto;
    position: absolute;
    right: 1rem;
    top: 1rem;
    border: none;
    border-radius: .5rem;
    width: 10rem;
    height: 3rem;
    font-family: ${props => props.theme.font.primary};

    box-shadow: 0 0.1rem 0.2rem 0rem #303030;

    transition: background-color 0.25s ease, box-shadow 0.1s ease;


    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    &:hover{
        background-color: ${props => props.theme.bg.secondary};
    }

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        display: none;
    }
`
export const Header = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
	background: ${props => props.theme.bg.quinary};
  	border-bottom: 1px solid black;
  	width: 100%;
  	padding: 1rem;
`

export const StationName = styled.h1`
    text-align: center;
    color: ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
`

export const StatisticsSectionsContainer = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction:column;
`