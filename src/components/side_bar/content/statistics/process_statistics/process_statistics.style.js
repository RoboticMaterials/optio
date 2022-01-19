import styled from 'styled-components'

export const Page = styled.div`
    height: 100%;
    width: 100%;
    background: ${props => props.theme.bg.secondary};
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

	background: ${props => props.theme.bg.primary};
    box-shadow: ${props => props.theme.cardShadow};
  	width: 100%;

    color: #393975;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: right;
    width: 100%;

    align-items: center;
    justify-content: center;
      
    height: 4rem;
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
    min-width: 1100px;
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

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
`

export const CardLabel = styled.div`
    text-align: left;
    color: #393975;
    font-size: 1rem;
    height: 1.4rem;
    font-weight: 600;
`

export const TooltipIcon = styled.i`
    font-size: 0.8rem;
    color: white;
    background: #ccc;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
    line-height: 1.4rem;
`

export const Tooltip = styled.div`
    max-width: 14rem;
`

export const ChartContainer = styled.div`
    flex-grow: 1;
    position: relative;
    width: 100%;
`

export const NoData = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 2rem;
    font-weight: bold;
    color: ${props => props.theme.bg.tertiary};
`

export const PieContainer = styled.div`
    width: 15rem;
    height: 15rem;
    margin: 0 auto;
`

export const DualSelectionButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-right: 2rem;
    height: 1.4rem;
    `

export const DualSelectionButton = styled.button`
    font-size: 0.8rem;
    width: 8rem;
    border: none;
    font-family: ${props => props.theme.font.primary};

    color: ${props => props.selected ? props.theme.bg.primary : props.theme.bg.quinary};

    background-color: ${props => props.selected ? props.activeColor: props.theme.bg.secondary};

    transition: background-color 0.25s ease, box-shadow 0.1s ease;

    &:focus{
        outline: 0 !important
    }

    &:active{
        box-shadow: none;
    }

    transition: all 0.5s ease-out;
`

export const CheckboxLabel = styled.div`
    line-height: 1.4rem;
    margin-left: 0.3rem;
    font-size: 0.8rem;
    color: #393975;
`

export const PrimaryLabel = styled.div`
    font-size: 0.8rem;
    color: #9494b5;
    font-family: Nexa;
    margin-top: 0.6rem;
    margin-bottom: -0.3rem;
    text-align: center;
`

export const PrimaryValue = styled.div`
    font-size: 1.8rem;
    font-weight: bold;
    color: #393975;
    font-family: Nexa;
    text-align: center;
`

export const LegendItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

export const Dot = styled.div`
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: none;
    border: 3px solid ${props => props.color};
    margin-right: 0.4rem;
`

export const LegendLabel = styled.div`
    font-size: 1rem;
    color: #393975;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const LegendValue = styled.div`
    font-size: 1.2rem;
    color: #393975;
    text-align: right;
    flex-grow: 1;

    white-space: nowrap;
`