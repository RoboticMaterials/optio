import styled, { css } from 'styled-components'

import * as style from '../device_edit.style'
// import * as style from '../../devices_content.style'
import { columnContainer } from '../../../../../../common_css/common_css'


export const Container = styled(style.Container)`
`

export const SectionsContainer = styled(style.SectionsContainer)`
`

export const Label = styled(style.Label)`
`

export const ScheduleLabel = styled(style.Label)`
    font-size: ${props => props.theme.fontSize.sz3};
`

export const RowContainer = styled(style.RowContainer)`
    justify-content: space-between;
`

export const ColumnContainer = styled.div`
    ${columnContainer}
`

export const ScheduleContainer = styled(style.SectionsContainer)`
    background-color: ${props => props.theme.bg.tertiary};
    margin-bottom: .25rem;
    
`

export const DayOfTheWeekContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    background-color: ${props => props.theme.bg.tertiary};

    height: 2rem;
    width: 2rem;

    /* background-color: red; */
    border-radius:50%;

    ${props => props.checked ? `
        box-shadow: inset 2px 2px 4px 0px rgba(0, 0, 0, 0.25), inset -2px -2px 3px 0px rgba(255, 255, 255, 0.6);
        
        background: rgba(0,0,0,0.05);
    `
        :
        `box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2), -2px -2px 3px rgba(255, 255, 255, .6);`
        // `box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3), -3px -3px 5px rgba(0, 0, 0, -.3);`
    };

    &:hover{
        cursor: pointer;
    }
`

export const DayOfTheWeekText = styled.p`
    margin-bottom: 0rem;
`