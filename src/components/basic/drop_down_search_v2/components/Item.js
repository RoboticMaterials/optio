import React, { Component } from 'react';
import styled from 'styled-components'
import { getByPath } from '../util';
import * as PropTypes from 'prop-types';
import { LIB_NAME } from '../constants';

import { LightenDarkenColor, hexToRGBA } from '../../../../methods/utils/color_utils'

class Item extends Component {
  item = React.createRef();

  componentDidUpdate() {
    if (this.props.state.cursor === this.props.itemIndex) {
      this.item.current &&
        this.item.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }

  render() {
    // console.log('Item render this.props',this.props)
    const { props, state, methods, item, itemIndex, ItemComponent, ContentContainer, ButtonComponent, TextComponent, onMouseEnter, onMouseLeave } = this.props;

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
        key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
        tabIndex="-1"
        className={`${LIB_NAME}-item ${
          methods.isSelected(item) ? `${LIB_NAME}-item-selected` : ''
        } ${state.cursor === itemIndex ? `${LIB_NAME}-item-active` : ''} ${
          item.disabled ? `${LIB_NAME}-item-disabled` : ''
        }`}
        onKeyPress={item.disabled ? undefined : () => methods.addItem(item)}
        onClick={item.disabled ? undefined : () => methods.addItem(item)}
        color={props.color}
        schema={props.schema}
        onMouseEnter = {() => {
          if(!!props.onMouseEnter){
          props.onMouseEnter(item)
        }
        }}
        onMouseLeave = {() => {
          if(!!props.onMouseLeave){
          props.onMouseLeave(item)
        }
        }}        >

            <TextComponent
            >
              {getByPath(item, props.labelField)} {item.disabled && <ins>{props.disabledLabel}</ins>}
            </TextComponent>

            {props.showButton && !!props.onDetailsClick &&
              <ButtonComponent className='fas fa-ellipsis-h'
                  onClick={(e) => {
                    if (!e) var e = window.event;
                    e.cancelBubble = true;
                    if (e.stopPropagation) e.stopPropagation();
                    props.onDetailsClick(item.id);
                  }}>
              </ButtonComponent>
            }

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

export const DefaultItemComponent = styled.span`

  padding: .5rem 1rem .5rem calc(1rem - 5px);
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  font-family: ${props => props.theme.font.primary};
  font-size: ${props => props.theme.fontSize.sz3};

  border-left: 5px solid transparent;

  // &.${LIB_NAME}-item-active {
  //   ${({ disabled, color }) => !disabled && color && `background: green;`}
  // }

  :hover,
  :focus {
    background: ${props => !!props.schema ? hexToRGBA(props.theme.schema[props.schema].solid, 0.1) : hexToRGBA(props.theme.fg.red, 0.1)};
    outline: none;
  }


  &.${LIB_NAME}-item-selected {
    ${props => props.disabled ? `
      background: ${!!props.schema ? hexToRGBA(props.theme.schema[props.schema].solid, 0.2) : hexToRGBA(props.theme.fg.red, 0.2)};
    `
    : `
      background: ${!!props.schema ? hexToRGBA(props.theme.schema[props.schema].solid, 0.2) : hexToRGBA(props.theme.fg.red, 0.2)};
      border-color: ${!!props.schema ? props.theme.schema[props.schema].solid : props.theme.fg.red};
    `}
  }

  ${({ disabled }) => disabled && `
    color: #aaa; 
    &:hover {
      background: #eee;
    }
    
  `}

  ${({ disabled }) =>
    disabled
      ? `
    // background: ${props => props.theme.bg.quinary};
    // color: ${props => props.theme.bg.primary};

    // ins {
    //   text-decoration: none;
    //   border:1px solid #ccc;
    //   border-radius: 2px;
    //   padding: 0px 3px;
    //   font-size: x-small;
    //   text-transform: uppercase;
    // }
    `
      : ''}

`;

const DefaultContentContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
`;

const DefaultButtonComponent = styled.i`
    display: flex;
    color: grey;
    font-size: 1rem;
    &:hover {
        cursor: pointer;
    }
    line-height: 2rem;
    text-align: center;
`

const DefaultTextComponent = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// Specifies the default values for props:
Item.defaultProps = {
    ItemComponent: DefaultItemComponent,
    ContentContainer: DefaultContentContainer,
    ButtonComponent: DefaultButtonComponent,
    TextComponent: DefaultTextComponent,
    onMouseEnter: () => {},
    onMouseLeave: () => {}
};

export default Item;
