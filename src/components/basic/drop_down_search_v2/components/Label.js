import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { LightenDarkenColor } from '../../../../methods/utils/color_utils'

function Label(props) {
    return (
        <props.LabelComponent>
            {props.label}
        </props.LabelComponent>
    )
}

const DefaultLabelComponent = styled.div`
    width: 100%;
    text-align: center;
    color: #999;
    font-weight: 200;

    background: ${props => LightenDarkenColor(props.theme.bg.quinary, -10)};
    color: ${props => props.theme.bg.septenary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz5};
`

Label.propTypes = {
    LabelComponent: PropTypes.elementType,
    label: PropTypes.string,
}

Label.defaultProps = {
    LabelComponent: DefaultLabelComponent,
    label: '',
}

export default Label

