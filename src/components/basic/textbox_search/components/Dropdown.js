import React from 'react';
import styled from 'styled-components';

import { LIB_NAME } from '../constants';
import NoData from './NoData';
import Item from './Item';
import Label from './Label';

import { valueExistInSelected, hexToRGBA } from '../util';

const textboxPosition = (props, methods) => {
  const TextboxBoundingClientRect = methods.getSelectRef().getBoundingClientRect();
  const textboxHeight =
    TextboxBoundingClientRect.bottom + parseInt(props.textboxHeight, 10) + parseInt(props.textboxGap, 10);

  if (props.textboxPosition !== 'auto') {
    return props.textboxPosition;
  }

  if (textboxHeight > window.innerHeight && textboxHeight > TextboxBoundingClientRect.top) {
    return 'top';
  }

  return 'bottom';
};

const Textbox = ({ ItemComponent, props, TextBoxComponent, state, methods, TextComponent }) => {
  // console.log('Textbox props', props)
  // console.log('Textbox ItemComponent', ItemComponent)

  return(
    <TextBoxComponent
      tabIndex="-1"
      aria-expanded="true"
      role="list"
      textboxPosition={textboxPosition(props, methods)}
      selectBounds={state.selectBounds}
      portal={props.portal}
      textboxGap={props.textboxGap}
      textboxHeight={props.textboxHeight}
      className={`${LIB_NAME}-textbox ${LIB_NAME}-textbox-position-${textboxPosition(
        props,
        methods
      )}`}>
      {props.textboxRenderer ? (
        props.textboxRenderer({ props, state, methods })
      ) : (
        <React.Fragment>
          {props.create && state.search && !valueExistInSelected(state.search, state.values, props) && (
            <AddNew

              className={`${LIB_NAME}-textbox-add-new`}
              color={props.color}
              onClick={() => methods.createNew(state.search)}>
              {props.createNewLabel.replace('{search}', `"${state.search}"`)}
            </AddNew>
          )}
          {state.currentValue.length > 0 &&
            <Label LabelComponent={props.LabelComponent} label={props.label} schema={props.schema}></Label>
          }
          {methods.searchResults().length > 0 && (
            methods
              .searchResults()
              .map((item, itemIndex) => (
                <Item
                  ItemComponent={ItemComponent}
                  TextComponent={TextComponent}
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
    </TextBoxComponent>
  );
}

export const DefaultTextBoxComponent = styled.div`
  position: absolute;
  ${({ selectBounds, textboxGap, textboxPosition }) =>
    textboxPosition === 'top'
      ? `bottom: ${selectBounds.height + 2 + textboxGap}px`
      : `top: ${selectBounds.height + 2 + textboxGap}px`};

  ${({ selectBounds, textboxGap, portal }) =>
    portal
      ? `
      position: fixed;
      top: ${selectBounds.bottom + textboxGap}px;
      left: ${selectBounds.left - 1}px;`
      : 'left: -1px;'};
  width: ${({ selectBounds }) => selectBounds.width}px;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: '#26ab76';
  border-radius: 2px;
  max-height: ${({ textboxHeight }) => textboxHeight};
  overflow: auto;
  z-index: 1;

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

Textbox.defaultProps = {
  TextBoxComponent: DefaultTextBoxComponent
};

export default Textbox;
