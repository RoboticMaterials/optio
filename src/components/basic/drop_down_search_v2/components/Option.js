import React from 'react';
import styled from '@emotion/styled';
import {getByPath} from '../util';
import { LIB_NAME } from '../constants';

const Option = ({ item, props, state, methods }) => {

    const OptionComponent = props.OptionComponent ? props.OptionComponent : DefaultOptionComponent
    return(
        item && props.optionRenderer ? (
          props.optionRenderer({ item, props, state, methods })
        ) : (
          <OptionComponent
            role="listitem"
            disabled={props.disabled}
            direction={props.direction}
            className={`${LIB_NAME}-option`}
            color={props.color}>
            <span className={`${LIB_NAME}-option-label`}>{getByPath(item, props.labelField)}</span>
            <span
              className={`${LIB_NAME}-option-remove`}
              onClick={(event) => methods.removeItem(event, item, props.closeOnSelect)}>
              &times;
            </span>
          </OptionComponent>
        )
    );

}

export const DefaultOptionComponent = styled.span`

  padding: 0 5px;
  border-radius: 2px;
  line-height: 21px;
  margin: 3px 0 3px 5px;
  background: ${({ color }) => color};
  color: #fff;
  display: inline-flex;
  flex-direction: ${({ direction }) => direction === 'rtl' ? 'row-reverse' : 'row'};
  width: auto;
  white-space: nowrap ;
  
  
  .${LIB_NAME}-option-label {
    width: auto;
  }


  .${LIB_NAME}-option-remove {
    cursor: pointer;
    width: 22px;
    height: 22px;
    display: inline-block;
    text-align: center;
    margin: 0 -5px 0 0px;
    border-radius: 0 3px 3px 0;

    :hover {
      color: tomato;
    }
  }

  :hover,
  :hover > span {
    opacity: 0.9;
  }

`;


// Specifies the default values for props:
Option.defaultProps = {
    OptionComponent: DefaultOptionComponent,
};

export default Option;
