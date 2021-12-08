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

const Dropdown = ({ ItemComponent, props, dropdownRef, DropDownComponent, icons, state, methods, onMouseEnter, onMouseLeave, onClick, TextComponent, setFieldType}) => {
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
                                            icon = {icons[itemIndex].icon}
                                            state={state}
                                            props={props}
                                            methods={methods}
                                            setFieldType = {(item)=>setFieldType(item, dataType)}
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
  bottom: -0.05rem;
  z-index: 2;
  left: 0rem;
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.bg.primary};
  border: 1px solid ${props => props.theme.bg.quaternary};
  border-radius: 0.4rem;
  height: auto;
  max-height: ${({ dropdownHeight }) => dropdownHeight};

  overflow-x: hidden;
  overflow-y: auto;
  z-index: 100;

//     ${props => props.css && props.css};


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
      -webkit-border-radius: 5px;
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


    // max-height: 100%;
    min-width: fit-content;
    block-size: fit-content;
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
