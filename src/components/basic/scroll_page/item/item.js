import React, { Component } from "react";
import { hexToRGBA, getByPath } from "./util";
import * as PropTypes from "prop-types";
import { LIB_NAME } from "./constants";

import { globStyle } from "../../../../global_style";

// import components
import IconButton from "../../../basic/icon_button/icon_button";

// import styles
import * as styled from "./item.style";

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
    const {
      props,
      state,
      methods,
      item,
      itemIndex,
      ItemComponent,
      ButtonComponent,
      ButtonIconComponent,
      TextComponent,
      onButtonClick,
    } = this.props;

    const isSelected = methods.isSelected(item);

    if (!props.keepSelectedInList && isSelected) {
      return null;
    }

    return (
      <ItemComponent
        role="option"
        ref={this.item}
        aria-selected={isSelected}
        aria-disabled={item.disabled}
        disabled={item.disabled}
        aria-label={getByPath(item, props.labelField)}
        key={`${getByPath(item, props.valueField)}${getByPath(
          item,
          props.labelField
        )}`}
        tabIndex="-1"
        className={`${LIB_NAME}-item ${
          isSelected ? `${LIB_NAME}-item-selected` : ""
        } ${state.cursor === itemIndex ? `${LIB_NAME}-item-active` : ""} ${
          item.disabled ? `${LIB_NAME}-item-disabled` : ""
        }`}
        onClick={
          item.disabled || !props.allowItemClick
            ? undefined
            : () => methods.addItem(item)
        }
        onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
        color={props.color}
      >
        <TextComponent>
          {getByPath(item, props.labelField)}{" "}
          {item.disabled && <ins>{props.disabledLabel}</ins>}
        </TextComponent>
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

// Specifies the default values for props:
Item.defaultProps = {
  ItemComponent: styled.DefaultItemComponent,
  ButtonComponent: styled.DefaultButtonComponent,
  TextComponent: styled.DefaultTextComponent,
  ButtonIconComponent: styled.DefaultButtonIconComponent,
};

export default Item;
