import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

import { LightenDarkenColor } from '../../../../methods/utils/color_utils'

function Label(props) {
    return (
        <props.LabelComponent schema={props.schema}>
            {props.label}
        </props.LabelComponent>
    )
}

const DefaultLabelComponent = styled.div`
    width: 100%;

    font-family: ${props => props.theme.font.primary};

    text-align: center;
    font-weight: 200;
    color: ${props => !!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.primary};
    font-size: ${props => props.theme.fontSize.sz5};
    background: ${props => LightenDarkenColor(props.theme.bg.quinary, -10)};
    cursor: default;
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

