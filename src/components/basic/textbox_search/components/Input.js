import React, { Component } from 'react';
import styled from 'styled-components';
import { valueExistInSelected } from '../util';
import * as PropTypes from 'prop-types';
import { LIB_NAME } from '../constants';

import { LightenDarkenColor } from '../../../../methods/utils/color_utils'

const handlePlaceHolder = (props, state) => {
  const { addPlaceholder, searchable, placeholder } = props;
  const noValues = state.values && state.values.length === 0;
  const hasValues = state.values && state.values.length > 0;

  if (hasValues && addPlaceholder && searchable) {
    return addPlaceholder;
  }

  if (noValues) {
    return placeholder;
  }

  if (hasValues && !searchable) {
    return '';
  }

  return '';
};

class Input extends Component {
  input = React.createRef();

  componentDidUpdate(prevProps) {
    if (
      this.props.state.textbox || (prevProps.state.textbox !== this.props.state.textbox && this.props.state.textbox) ||
      this.props.props.autoFocus
    ) {
      this.input.current.focus();
    }

    if (prevProps.state.textbox !== this.props.state.textbox && !this.props.state.textbox) {
       this.input.current.blur();
    }
  }

  onBlur = (event) => {
    event.stopPropagation();
    if (!this.props.state.textbox) {
      return this.input.current.blur();
    }

    return this.input.current.focus();
  };

  handleKeyPress = (event) => {
    const { props, state, methods } = this.props;

    return (
      props.create &&
      event.key === 'Enter' &&
      !valueExistInSelected(state.search, state.values, this.props) &&
      state.search &&
      state.cursor === null &&
      methods.createNew(state.search)
    );
  };

  render() {
    const { props, state, methods, InputComponent } = this.props;

    if (props.inputRenderer) {
      return props.inputRenderer({ props, state, methods, inputRef: this.input });
    }

    return (
      <InputComponent
        ref={this.input}
        tabIndex="-1"
        onFocus={(event) => {
          event.stopPropagation()
          methods.setSearch({target: {value: !!state.currentValue ? state.currentValue : ''}})
        }}
        className={`${LIB_NAME}-input`}
        size={methods.getInputSize()}
        value={state.currentValue}
        readOnly={!props.searchable}
        onClick={() => methods.dropDown('open')}
        onKeyPress={this.handleKeyPress}
        onChange={(e) => {
          methods.setSearch(e)
          methods.setValue(e.target.value)
          props.onChange([{name: e.target.value}])
        }}
        onBlur={this.onBlur}
        placeholder={handlePlaceHolder(props, state)}
        disabled={props.disabled}
        filled={props.filled}
      />
    );
  }
}

export const TextboxInput = styled.input`
    background-color: white;
    border: none;
    font-size: 1.2rem;
    font-family: ${props => props.theme.font.primary};
    font-weight: 500;
    display: flex;
    flex-grow: 1;
    font-color: black;

    margin: 0 0.5rem 0 0.5rem;

    &:focus {
      outline: none !important;
  }

    &::placeholder {
        font-size: ${props => props.theme.fontSize.sz4};
        font-family: ${props => props.theme.font.secondary};
        color: ${props => props.theme.bg.hexanary};
    }
`;

// export const DefaultInputComponent = styled.input`
//     cursor: pointer;
//     line-height: inherit;

//     // width: ${props => props.filled ? `calc(${props.size}ch + 5px)` : `100%`};
//     width: ${props => `calc(${props.size}ch + 5px)`};

//     border: none;
//     margin-left: 5px;
//     background: transparent;
//     font-size: smaller;
//     ${({ readOnly }) => readOnly && 'cursor: pointer;'}
//     :focus {
//       outline: none;
//     }

//     vertical-align: middle;
//     line-height: 2rem;
//     height: 2rem;

//     &::placeholder {
//       color: ${props => props.theme.bg.senary};
//     }
//     `;

Input.propTypes = {
    props: PropTypes.object,
    state: PropTypes.object,
    methods: PropTypes.object
};

Input.defaultProps = {
    InputComponent: TextboxInput
};

export default Input;
