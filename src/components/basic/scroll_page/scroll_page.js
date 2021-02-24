import React from "react";

import ScrollableList from "../../basic/scrollable_list/scrollable_list";
import Item from "./item/item";
import * as styled from "./scroll_page.style";

const ScrollPage = (props) => {
  const { title } = props;
  const { valueField, labelField, placeholder, showContent } = props;
  const { onChange } = props;
  const itemRenderer = ({ item, itemIndex, props, state, methods }) => {
    return (
      <Item
        // ItemComponent={styled.ItemComponent}
        key={item[props.valueField]}
        item={item}
        itemIndex={itemIndex}
        state={state}
        props={props}
        methods={methods}
        onButtonClick={() => {
          console.log("clicked");
        }}
      />
    );
  };

  return (
    <styled.Container>
      <styled.HeaderContainer>
        <styled.BackButton
          onClick={() => props.onBackPress()}
          className={"fas fa-caret-left"}
        ></styled.BackButton>
        <styled.Title>{title}</styled.Title>
        <div /> {/* used for spacing with flex box*/}
      </styled.HeaderContainer>

      <styled.SelectContainer>
        <ScrollableList
          onDropdownOpen={() => props.onDropdownOpen()}
          showButton={false}
          searchBy={"name"}
          onChange={onChange}
          values={props.values}
          valueField={valueField}
          labelField={labelField}
          placeholder={placeholder}
          keepOpen={true}
          showContent={showContent}
          // allowItemClick={false}
          placeholder={"Search models..."}
          autoFocus={false}
          options={props.options}
          ClickOutsideComponent={styled.ClickOutsideComponent}
          ContentComponent={styled.ContentComponent}
          Container={styled.DropDownContainer}
          itemRenderer={itemRenderer}
          NoDataComponent={styled.NoDataComponent}
          ReactDropdownSelect={styled.ReactDropdownSelectComponent}
          DropDownComponent={styled.DropDownComponent}
        />
      </styled.SelectContainer>
    </styled.Container>
  );
};

export default ScrollPage;
