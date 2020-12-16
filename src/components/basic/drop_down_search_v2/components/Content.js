import React from 'react';
import styled from 'styled-components';

import Option from './Option';
import Input from './Input';
import { LIB_NAME } from '../constants';
import { getByPath } from '../util';

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
        
        <OptionsContainer multi={props.multi}>
          {(props.multi || props.showSelectedBox)
            ? state.values &&
              state.values.map((item) => (
                <Option
                  key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
                  item={item}
                  state={state}
                  props={props}
                  methods={methods}
                />
              ))
            : state.values &&
              state.values.length > 0 && <Value>{getByPath(state.values[0], props.labelField)}</Value>
            }
          <Input  InputComponent={InputComponent} props={{...props, filled:state.values.length}} methods={methods} state={state} />
        </OptionsContainer>
      )}
    </ContentComponent>
  );
    return (
        <ContentComponent
            className={`${LIB_NAME}-content ${props.multi ? `${LIB_NAME}-type-multi` : `${LIB_NAME}-type-single`
                }`}
            onClick={(event) => {
                event.stopPropagation();
                methods.dropDown('open');
            }}>
            {props.contentRenderer ? (
                props.contentRenderer({ props, state, methods })
            ) : (

                    <React.Fragment>
                        {(props.multi || props.showSelectedBox)
                            ? state.values &&
                            state.values.map((item, ind) => (
                                <Option
                                    // Fix for keys that have the same name
                                    // key={`${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`}
                                    key={ind}
                                    item={item}
                                    state={state}
                                    props={props}
                                    methods={methods}
                                />
                            ))
                            : state.values &&
                            state.values.length > 0 && <Value>{getByPath(state.values[0], props.labelField)}</Value>
                        }
                        <Input InputComponent={InputComponent} props={{ ...props, filled: state.values.length }} methods={methods} state={state} />
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

export const OptionsContainer = styled.div`
    width: auto;
    height: 100%;
    margin-right: 1rem;
    display: inline-flex;
    overflow-y: hidden;
    overflow-x: ${props => props.multi ? "auto" : "hidden"};
    
    word-break: ${props => !props.multi && "break-all"};
    white-space: ${props => !props.multi && "nowrap"};
    text-overflow: ${props => !props.multi && "ellipsis"};
    
`

export const DefaultContentComponent = styled.div`
  position: relative;
  
  display: flex;
  flex-grow: 1;
  // flex-wrap: nowrap;

  overflow: hidden;
  
  .${LIB_NAME}-type-multi {
    overflow-x: auto;
  }
  
  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// Specifies the default values for props:
Content.defaultProps = {
    ContentComponent: DefaultContentComponent,
};

export default Content;
