import styled from 'styled-components'

export const Page = styled.div`
    height: 100%;
    width: 100%;
    background: ${props => props.theme.bg.secondary};
    // overflow-y: scroll;
`

export const StatisticsContainer = styled.div`
    height: calc(100% - 5rem);
    display: flex;
    flex-direction: column;
    padding: 1rem;
    overflow-y: scroll;
`

export const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
	background: ${props => props.theme.bg.primary};
    box-shadow: ${props => props.theme.cardShadow};
  	width: 100%;
      
    height: 5rem;
  	padding: 1rem;
    z-index: 100;
`

export const StationName = styled.h1`
    text-align: center;
    color: ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
`

export const TimePickerLabel = styled.h3`
    text-align: center;
    color: #393975;
    font-family: ${props => props.theme.font.primary};
    font-size: 1.6rem;
    cursor: pointer;
`

export const Row = styled.div`
    display: flex;
    flex-direction: row;
`

export const Card = styled.div`
    background: #FFFFFF;
    box-shadow: 0px 4px 8px 4px rgba(200, 206, 222, 0.25);
    border-radius: 0.5rem;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    min-height: 15rem;

    padding: 18px;
    margin: 1rem;
`

export const CardLabel = styled.div`
    text-align: left;
    color: #393975;
    font-weight: 600;
`

export const ChartContainer = styled.div`
    flex-grow: 1;
    position: relative;
`

export const PieContainer = styled.div`
    width: 15rem;
    height: 15rem;
`