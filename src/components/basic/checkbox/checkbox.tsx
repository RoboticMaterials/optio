import React from 'react'
import * as styled from './checkbox.style'

const Checkbox = (props) => {

    const {
        onClick,
        checked,
        title,
        css,
        ...rest
    } = props

    return(
        <styled.Checkbox
            css={css}
            type='checkbox'
            onClick={onClick}
            checked={checked}
            {...rest}
        />
    )
}

export default Checkbox
