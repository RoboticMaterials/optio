import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from '../constants';

import {globStyle} from '../../../../global_style'

const NoData = ({ props, state, methods, NoDataComponent }) =>
  props.noDataRenderer ? (
    props.noDataRenderer({ props, state, methods })
  ) : (
    <NoDataComponent id={'bob5'} className={`${LIB_NAME}-no-data`} color={props.color}>
      {props.noDataLabel}
    </NoDataComponent>
  );

const DefaultNoDataComponent = styled.div`
  padding: 10px;
  text-align: center;
  font-size: 1rem;
  color: #FF4B4B;
  background-color: #f5f5fa;

`;

NoData.defaultProps = {
  NoDataComponent: DefaultNoDataComponent
};

export default NoData;
