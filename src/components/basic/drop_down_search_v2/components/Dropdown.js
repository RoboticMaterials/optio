import React from 'react';
import styled from 'styled-components';

import { LIB_NAME } from '../constants';
import NoData from '../components/NoData';
import Item from '../components/Item';
import Label from '../components/Label';

import { valueExistInSelected, hexToRGBA } from '../util';

const dropdownPosition = (props, methods) => {
    const DropdownBoundingClientRect = methods.getSelectRef().getBoundingClientRect();
    const dropdownHeight =
        DropdownBoundingClientRect.bottom + parseInt(props.dropdownHeight, 10) + parseInt(props.dropdownGap, 10);

    if (props.dropdownPosition !== 'auto') {
        return props.dropdownPosition;
    }

    if (dropdownHeight > window.innerHeight && dropdownHeight > DropdownBoundingClientRect.top) {
        return 'top';
    }

    return 'bottom';
};

const Dropdown = ({ ItemComponent, props, dropdownRef, DropDownComponent, state, methods, onMouseEnter, onMouseLeave, onClick, TextComponent }) => {
    // console.log('Dropdown props', props)
    // console.log('Dropdown ItemComponent', ItemComponent)
    return (
        <DropDownComponent
            css={props.dropdownCss}
            ref={dropdownRef}
            maxWidth={props.maxDropdownWidth}
            tabIndex="-1"
            aria-expanded="true"
            role="list"
            dropdownPosition={dropdownPosition(props, methods)}
            selectBounds={state.selectBounds}
            portal={props.portal}
            dropdownGap={props.dropdownGap}
            dropdownHeight={props.dropdownHeight}
            className={`${LIB_NAME}-dropdown ${LIB_NAME}-dropdown-position-${dropdownPosition(
                props,
                methods
            )}`}>
            {props.dropdownRenderer ? (
                props.dropdownRenderer({ props, state, methods })
            ) : (
                    <React.Fragment>
                        {props.create && state.search && !valueExistInSelected(state.search, state.values, props) && (
                            <AddNew
                                className={`${LIB_NAME}-dropdown-add-new`}
                                color={props.color}
                                onClick={() => methods.createNew(state.search)}
                                >
                                {props.createNewLabel.replace('{search}', `"${state.search}"`)}
                            </AddNew>
                        )}
                        <Label LabelComponent={props.LabelComponent} label={props.label}></Label>
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
                                            TextComponent={TextComponent}
                                            //   Fix for dropdown search error for elements with matching keys
                                            //   key={item[props.valueField]}
                                            key={itemIndex}
                                            item={item}
                                            itemIndex={itemIndex}
                                            state={state}
                                            props={props}
                                            methods={methods}
                                            onMouseEnter = {(item) => onMouseEnter(item)}
                                            onMouseLeave = {(item) => onMouseLeave(item)}
                                        />
                                    ))
                            )}
                    </React.Fragment>
                )}
        </DropDownComponent>
    );
}

export const DefaultDropDownComponent = styled.div`
  position: absolute;
  ${({ selectBounds, dropdownGap, dropdownPosition }) =>
        dropdownPosition === 'top'
            ? `bottom: ${selectBounds.height + 2 + dropdownGap}px`
            : `top: ${selectBounds.height + 2 + dropdownGap}px`};

  ${({ selectBounds, dropdownGap, portal }) =>
        portal
            ? `
      position: fixed;
      top: ${selectBounds.bottom + dropdownGap}px;
      left: ${selectBounds.left - 1}px;`
            : 'left: -1px;'};
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.bg.secondary};
  border-radius: 2px;
  box-shadow: 0px 0px 10px 3px rgba(0,0,0,0.1);
  max-height: ${({ dropdownHeight }) => dropdownHeight};
  overflow-x: visible;
  z-index: 100;

    ${props => props.css && props.css};

  border-radius: 0.2rem;

  :focus {
    outline: none;
  }

  /* Let's get this party started */
  ::-webkit-scrollbar {
      width: 6px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
      -webkit-background: rgba(0,0,0,0.1);
      -webkit-border-radius: 10px;
      border-radius: 10px;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 10px;
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
      background: rgba(255,255,255,0.4);
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(255,255,255,0.2);
  }

    // max-width: ${props => props.maxWidth && props.maxWidth};


    overflow: visible;
    min-width: fit-content;
    // block-size: fit-content;
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
