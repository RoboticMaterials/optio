import React, { Component } from "react";

import styled from "@emotion/styled";
import { valueExistInSelected } from "../util";
import * as PropTypes from "prop-types";
import { LIB_NAME } from "../constants";

const ReactDOM = require("react-dom");

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
    return "";
  }

  return "";
};

class Input extends Component {
  input = React.createRef();

  componentDidUpdate(prevProps) {
    const { props, state, methods, select } = this.props;

    const selecetFocused =
      document.activeElement === ReactDOM.findDOMNode(select.current);
    const inputFocused =
      document.activeElement === ReactDOM.findDOMNode(this.input.current);
    if (!inputFocused && selecetFocused) {
      this.input.current.focus();
    }
    // console.log('selecetFocused', selecetFocused)

    if (
      this.props.state.dropdown ||
      (prevProps.state.dropdown !== this.props.state.dropdown &&
        this.props.state.dropdown) ||
      this.props.props.autoFocus
    ) {
      // this.input.current.focus();
    }

    if (
      prevProps.state.dropdown !== this.props.state.dropdown &&
      !this.props.state.dropdown
    ) {
      // this.input.current.blur();
    }
  }

  onBlur = (event) => {
    // event.stopPropagation();
    // if (!this.props.state.dropdown) {
    // return this.input.current.blur();
    // }
    // return this.input.current.focus();
  };

  handleKeyPress = (event) => {
    const { props, state, methods } = this.props;

    return (
      props.create &&
      event.key === "Enter" &&
      !valueExistInSelected(state.search, state.values, this.props) &&
      state.search &&
      state.cursor === null &&
      methods.createNew(state.search)
    );
  };

  render() {
    const { props, state, methods, select } = this.props;

    // console.log('Input: props:', props)
    // console.log('Input: state:', state)
    // console.log('Input: methods:', methods)
    // console.log('Input: select:', select)
    // console.log("Input document.activeElement", document.activeElement)

    if (props.inputRenderer) {
      // return props.inputRenderer({ props, state, methods, inputRef: this.input });
    }

    return (
      <InputComponent
        ref={this.input}
        tabIndex="-1"
        onFocus={(event) => event.stopPropagation()}
        className={`${LIB_NAME}-input`}
        size={methods.getInputSize()}
        value={state.search}
        readOnly={!props.searchable}
        onClick={() => methods.dropDown("open")}
        onKeyPress={this.handleKeyPress}
        onChange={methods.setSearch}
        onBlur={this.onBlur}
        placeholder={handlePlaceHolder(props, state)}
        disabled={props.disabled}
      />
    );
  }
}

Input.propTypes = {
  props: PropTypes.object,
  state: PropTypes.object,
  methods: PropTypes.object,
};

const InputComponent = styled.input`
  cursor: pointer;
  line-height: inherit;
  width: calc(${({ size }) => `${size}ch`} + 5px);
  border: none;
  margin-left: 5px;
  background: transparent;
  font-size: smaller;
  ${({ readOnly }) => readOnly && "cursor: pointer;"}
  :focus {
    outline: none;
  }

  vertical-align: middle;
  line-height: 2rem;
  height: 2rem;
`;

export default Input;
