import React from 'react';
import PropTypes from 'prop-types';

import * as styled from './edit_button.style'

const EditButton = props => {

    const {
        color,
        onClick,
        size,
        style,
    } = props

    return (
        <styled.EditIcon
            className={'far fa-edit'}
            color={color}
            size={size}
            style={style}
            onClick={onClick}
        />
    );
};

EditButton.propTypes = {
    color: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.string,
};

EditButton.defaultProps = {
    color: '#42adf5',
    onClick: () => null,
    size: '1.25rem',
};

export default EditButton;
