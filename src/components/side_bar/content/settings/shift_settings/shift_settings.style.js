import styled from 'styled-components'
import * as buttonCss from '../../../../../common_css/button_css'
import * as commonCss from '../../../../../common_css/common_css'
import { LightenDarkenColor } from '../../../../../methods/utils/color_utils'

export const BreakContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: fit-content;
    background-color: ${props => props.theme.bg.secondary};
    border-radius: .5rem;
`

export const BreakLabel = styled.label`
  font-size: ${props => props.theme.fontSize.sz4};
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.bg.senary};
`

export const ChartButton = styled.button`
    ${buttonCss.button};
    background-color:${props => props.theme.schema.statistics.solid};
    color: ${props => props.theme.bg.primary};
    margin-top: .5rem;
    margin-bottom: 0.1rem;
    font-size: 1.25rem;
    padding: .25rem;

    &:hover {
      background-color:${props => LightenDarkenColor(props.theme.schema.statistics.solid, -5)};
    }
`

export const ColumnContainer = styled.div`
    ${commonCss.columnContainer};
`

export const RowContainer = styled.div`
    ${commonCss.rowContainer};
    justify-content: space-around;
    position: relative;
    padding-left: .5rem
`

export const Label = styled.label`
  font-size: 1rem;
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.bg.octonary};
`
