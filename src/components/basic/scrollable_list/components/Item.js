import React, { Component } from "react";
import styled from "@emotion/styled";
import { hexToRGBA, getByPath } from "../util";
import * as PropTypes from "prop-types";
import { LIB_NAME } from "../constants";

import { globStyle } from "../../../../global_style";

class Item extends Component {
  item = React.createRef();

  componentDidUpdate() {
    if (this.props.state.cursor === this.props.itemIndex) {
      this.item.current &&
        this.item.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
    }
  }

  render() {
    // console.log('Item render this.props',this.props)
    const {
      props,
      state,
      methods,
      item,
      itemIndex,
      ItemComponent,
      ContentContainer,
      ButtonComponent,
      TextComponent,
    } = this.props;

    if (props.itemRenderer) {
      return props.itemRenderer({ item, itemIndex, props, state, methods });
    }

    if (!props.keepSelectedInList && methods.isSelected(item)) {
      return null;
    }

    // console.log('item ItemComponent', ItemComponent)
    //const { ItemComponent } = this.props;

    return (
      <ItemComponent
        role="option"
        ref={this.item}
        aria-selected={methods.isSelected(item)}
        aria-disabled={item.disabled}
        disabled={item.disabled}
        aria-label={getByPath(item, props.labelField)}
        key={`${getByPath(item, props.valueField)}${getByPath(
          item,
          props.labelField
        )}`}
        tabIndex="-1"
        className={`${LIB_NAME}-item ${
          methods.isSelected(item) ? `${LIB_NAME}-item-selected` : ""
        } ${state.cursor === itemIndex ? `${LIB_NAME}-item-active` : ""} ${
          item.disabled ? `${LIB_NAME}-item-disabled` : ""
        }`}
        onClick={item.disabled ? undefined : () => methods.addItem(item)}
        onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
        color={props.color}
      >
        <TextComponent>
          {getByPath(item, props.labelField)}{" "}
          {item.disabled && <ins>{props.disabledLabel}</ins>}
        </TextComponent>

        {props.showButton && (
          <ButtonComponent
            type={"button"}
            onClick={(e) => {
              if (!e) var e = window.event;
              e.cancelBubble = true;
              if (e.stopPropagation) e.stopPropagation();
              props.onDetailsClick(item.id);
            }}
          >
            Details
          </ButtonComponent>
        )}
      </ItemComponent>
    );
  }
}

Item.propTypes = {
  props: PropTypes.any,
  state: PropTypes.any,
  methods: PropTypes.any,
  item: PropTypes.any,
  itemIndex: PropTypes.any,
  showButton: PropTypes.bool,
};

const DefaultItemComponent = styled.span`
  padding: 0.5rem 1rem 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${globStyle.white};
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  font-family: ${globStyle.font};

  &.${LIB_NAME}-item-active {
    border-bottom: 1px solid ${globStyle.white};
    ${({ disabled, color }) =>
      !disabled && color && `background: ${hexToRGBA(color, 0.1)};`}
  }

  :hover,
  :focus {
    background: ${globStyle.grey5};
    outline: none;
  }

  &.${LIB_NAME}-item-selected {
    ${({ disabled, color }) =>
      disabled
        ? `
    background: ${globStyle.red};
    color: ${globStyle.black};
    `
        : `
    background: ${globStyle.red};
    color: ${globStyle.black};
    border-bottom: 1px solid ${globStyle.white};
    `}
  }

  ${({ disabled }) =>
    disabled
      ? `
    background: ${globStyle.white};
    color: ${globStyle.grey3};

    ins {
      text-decoration: none;
      border:1px solid #ccc;
      border-radius: 2px;
      padding: 0px 3px;
      font-size: x-small;
      text-transform: uppercase;
    }
    `
      : ""}

  background-color: ${globStyle.white};
`;

const DefaultContentContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
`;

const DefaultButtonComponent = styled.button`
  margin-left: 3rem;
`;

const DefaultTextComponent = styled.span`
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
  text-overflow: ellipsis;
`;

// Specifies the default values for props:
Item.defaultProps = {
  ItemComponent: DefaultItemComponent,
  ContentContainer: DefaultContentContainer,
  ButtonComponent: DefaultButtonComponent,
  TextComponent: DefaultTextComponent,
};

export default Item;
