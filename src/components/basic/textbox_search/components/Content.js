import React from 'react';
import styled from 'styled-components';

import Option from './Option';
import Input from './Input';
import { LIB_NAME } from '../constants';
import {getByPath} from '../util';

const Content = ({ props, state, methods, ContentComponent, InputComponent }) => {
  return (
    <ContentComponent
      className={`${LIB_NAME}-content ${
        props.multi ? `${LIB_NAME}-type-multi` : `${LIB_NAME}-type-single`
      }`}
      onClick={(event) => {
        event.stopPropagation();
        methods.dropDown('open');
      }}>
      {props.contentRenderer ? (
        props.contentRenderer({ props, state, methods })
      ) : (
        
        <React.Fragment>
          <Input InputComponent={InputComponent} props={props} methods={methods} state={state} />
        </React.Fragment>
      )}
    </ContentComponent>
  );
};

export const Value = styled.div`
  margin-left: 0.3rem;
  margin-right: 0.2rem;
  line-height: 1.8rem;
  font-size: ${props => props.theme.fontSize.sz3};
  width: 100%;
`

export const DefaultContentComponent = styled.div`
  position: relative;
  
  display: flex;
  flex-grow: 1;
  // flex-wrap: nowrap;

  overflow: hidden;
  word-break: break-all;
  // white-space: nowrap;
  text-overflow: ellipsis;
`;

// Specifies the default values for props:
Content.defaultProps = {
    ContentComponent: DefaultContentComponent,
};

export default Content;
