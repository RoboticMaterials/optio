import styled from 'styled-components';

import { LIB_NAME } from './constants';
import {globStyle} from '../../../../global_style';
import { hexToRGBA, LightenDarkenColor, RGB_Linear_Shade } from '../../../../methods/utils/color_utils';

export const DefaultItemComponent = styled.span`
  padding: .5rem 1rem .5rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${globStyle.white};
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: ${globStyle.font};

  &.${LIB_NAME}-item-active {
    border-bottom: 1px solid ${globStyle.white};
    ${({ disabled, color }) => !disabled && color && `background: ${hexToRGBA(color, 0.1)};`}
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
      : ''}

    background-color: ${globStyle.white};
    background-color: transparent;

`;


export const DefaultButtonComponent = styled.button`
  // margin-left: 3rem;
  margin: 0;
  padding: 0;
  background: transparent;
  border-width: 0;
`;

export const DefaultButtonIconComponent = styled.i`

`;

export const DefaultTextComponent = styled.span`
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
    display: flex;
    align-self: center;
`;
