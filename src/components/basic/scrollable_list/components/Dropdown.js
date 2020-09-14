import React from 'react';
import styled from '@emotion/styled';

import {globStyle} from '../../../../global_style'

import { LIB_NAME } from '../constants';
import NoData from '../components/NoData';
import Item from '../components/Item';

import { valueExistInSelected, hexToRGBA } from '../util';

// const dropdownPosition = (props, methods) => {
//   const DropdownBoundingClientRect = methods.getSelectRef().getBoundingClientRect();
//   const dropdownHeight =
//     DropdownBoundingClientRect.bottom + parseInt(props.dropdownHeight, 10) + parseInt(props.dropdownGap, 10);
//
//   if (props.dropdownPosition !== 'auto') {
//     return props.dropdownPosition;
//   }
//
//   if (dropdownHeight > window.innerHeight && dropdownHeight > DropdownBoundingClientRect.top) {
//     return 'top';
//   }
//
//   return 'bottom';
// };

const Dropdown = ({ ItemComponent, props, DropDownComponent, state, methods }) => {
  // console.log('Dropdown props', props)
  // console.log('Dropdown ItemComponent', ItemComponent)
  return(
    <DropDownComponent
      tabIndex="-1"
      aria-expanded="true"
      role="list"
      // dropdownPosition={dropdownPosition(props, methods)}
      selectBounds={state.selectBounds}
      portal={props.portal}
      dropdownGap={props.dropdownGap}
      dropdownHeight={props.dropdownHeight}
      >
      {props.dropdownRenderer ? (
        props.dropdownRenderer({ props, state, methods })
      ) : (
        <React.Fragment>
          {props.create && state.search && !valueExistInSelected(state.search, state.values, props) && (
            <AddNew

              className={`${LIB_NAME}-dropdown-add-new`}
              color={props.color}
              onClick={() => methods.createNew(state.search)}>
              {'hello'}
              {props.createNewLabel.replace('{search}', `"${state.search}"`)}
            </AddNew>
          )}
          {methods.searchResults().length === 0 ? (
            <NoData
              className={`${LIB_NAME}-no-data`}
              state={state}
              props={props}
              methods={methods}
              NoDataComponent={props.NoDataComponent}
            />
          ) : (
            methods
              .searchResults()
              .map((item, itemIndex) => (
                <Item
                  ItemComponent={ItemComponent}
                  key={item[props.valueField]}
                  item={item}
                  itemIndex={itemIndex}
                  state={state}
                  props={props}
                  methods={methods}
                />
              ))
          )}
        </React.Fragment>
      )}
    </DropDownComponent>
  );
}

const DefaultDropDownComponent = styled.div`
  position: absolute;

  ${({ selectBounds, dropdownGap, portal }) =>
    portal
      ? `
      position: fixed;
      top: ${selectBounds.bottom + dropdownGap}px;
      left: ${selectBounds.left - 1}px;`
      : 'left: -1px;'};
  width: ${({ selectBounds }) => selectBounds.width}px;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: ${globStyle.grey3};
  border-radius: 2px;
  box-shadow: 0 0 10px 0 ${() => hexToRGBA('#000000', 0.2)};
  max-height: ${({ dropdownHeight }) => dropdownHeight};
  overflow: auto;
  z-index: 1;

  :focus {
    outline: none;
  }

}
`;

const AddNew = styled.div`
  color: ${({ color }) => color};
  padding: 5px 10px;
  background: white;
  color: blue;

  :hover {
    background: ${({ color }) => color && hexToRGBA(color, 0.1)};
    outline: none;
    cursor: pointer;
  }
`;

Dropdown.defaultProps = {
  DropDownComponent: DefaultDropDownComponent
};

export default Dropdown;
