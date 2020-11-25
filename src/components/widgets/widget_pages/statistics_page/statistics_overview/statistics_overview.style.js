import styled from 'styled-components'

import { LightenDarkenColor } from '../../../../../methods/utils/color_utils'

export const OverviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 100%;
    height: auto;
    border-radius: 1rem;

    align-items: center;
    justify-content: center;

    padding-top: 1rem;

`

export const StationName = styled.h1`
    margin-bottom: 0.5rem;
    color: ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
`

export const PlotContainer = styled.div`
    position: absolute;
    top: 18rem;
    /* bottom: 6rem; */

    /* left: 9rem;
    right: 8rem; */

    display: flex;
    /* position:inherit; */

    height: 100%;
    max-height: 50rem;
    
    max-width: 90rem;
    width: 100%;
    margin: 0rem auto;
    margin-top: 4rem;

    overflow: visible;

    @media (max-width: ${props => props.theme.widthBreakpoint.tablet}){
        max-height: 30rem;
    }
`

// ========== Statistics Container ========== //
export const StatsSection = styled.div`
    /* background: ${props => LightenDarkenColor(props.theme.bg.quaternary, -10)}; */
    border-radius: 0.5rem;

    /* margin-bottom: 1rem; */

    max-width: 60rem;
    width: 100%;

    height: 12rem;

    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;

    padding: 0rem 4rem 0 4rem;
`
export const StatTitle = styled.h2`
    position: absolute;
    left: 0;
    right: 0;
    top: 4rem;
    
    text-align: center;

    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: white;
`

export const Col = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

export const Stat = styled.div`
    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;

`

export const StatLabel = styled.h3`
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.fg.primary};

    margin-right: 1rem;
`

export const StatValue = styled.h4`
    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
    color: white;
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    max-width: 20rem;
`

export const DateSelectorIcon = styled.i`
    font-size: 1.5rem;
`