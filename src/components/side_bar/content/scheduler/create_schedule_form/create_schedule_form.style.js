import styled from 'styled-components'
import { css } from 'styled-components'
import { Form } from 'formik';

// import components
import TimePickerField from '../../../../basic/form/time_picker_field/time_picker_field';

import { globStyle } from '../../../../../global_style';
import { hexToRGBA } from '../../../../../methods/utils/color_utils';

export const FadeLoaderCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export const FieldLabel = styled.label`
    padding: 0;
    width: 100%;
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.septenary};
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    justify-items: space-between;
    justify-content: center;
    align-items: center;
`;

export const FlexContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    /* @media (min-width: ${props => props.theme.widthBreakpoint.tablet}) {
      flex-direction: row;
      width: 40rem;
    } */
`;

export const FlexBox = styled.div`
    /* width: 100%; */
    /* min-width: 15rem; */
    /* margin-right: 3rem; */
`;

export const ToggleTextLeft = styled.h1`
    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
    display: flex;
    margin-top: 0.2rem;
    padding-right: 0.8rem;
    color: ${props => props.theme.bg.octonary};

`;

export const ToggleTextRight = styled.h1`
    font-size: ${props => props.theme.fontSize.sz3};
    font-family: ${props => props.theme.font.primary};
    display: flex;
    margin-top: 0.2rem;
    padding-left: 0.8rem;
    color: ${props => props.theme.bg.octonary};

`;




export const ErrorComponent = styled.span`
  color: ${props => props.theme.bad};
  font-size: ${props => props.theme.fontSize.sz4};
  font-weight: 600;
  margin-top: .5rem;
  align-self: center;
`;



export const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    padding: 1rem;
    
    overflow-x: hidden;
`;

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    /* overflow-y: scroll; */
    padding: 1rem;
    max-width: 100%;
    overflow-x: hidden;
`

export const FooLabel = styled.div``;

// text input
// ************************************
// ************************************
export const Input = styled.input`
    background-color: ${props => props.theme.bg.secondary};
    border: 1px solid ${props => props.theme.bg.primary};
    font-size: ${props => props.theme.fontSize.sz8};
    font-family: ${props => props.theme.font.primary};
    display: flex;
    flex-grow: 1;
    color: ${props => props.theme.bg.septenary};

    &:focus {
        outline: none;
        border: 1px solid ${props => props.theme.fg.primary};
        color: ${props => props.theme.bg.septenary};
        box-shadow: none;
        background-color: ${props => props.theme.bg.secondary};
    }

    &::placeholder {
        font-size: ${props => props.theme.fontSize.sz8};
        font-family: ${props => props.theme.font.secondary};
        color: ${props => props.theme.bg.quaternary};
    }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
  width: 100%;
`;

export const InputLabel = styled.label`
    width: 100%;
    padding: 0;
    margin-bottom: 1rem;
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    color: ${props => props.theme.bg.septenary};
`;

export const TitleTextbox = styled.input`
    background-color: ${props => props.theme.bg.secondary};
    border-color: ${props => props.theme.bg.primary};;
    font-size: ${props => props.theme.fontSize.sz2};
    font-family: ${props => props.theme.font.primary};
    display: flex;
    flex-grow: 1;

    &:focus {
        border: 1px solid ${props => props.theme.fg.primary};
        color: ${props => props.theme.bg.septenary};
        box-shadow: none;
        background-color: ${props => props.theme.bg.secondary};
    }

    &::placeholder {
        font-size: ${props => props.theme.fontSize.sz2};
        font-family: ${props => props.theme.font.secondary};
        color: ${props => props.theme.bg.quaternary};
    }
`;
// ************************************
// ************************************


// drop down field
// ************************************
// ************************************
export const SelectContainer = styled.div`
  width: 100%;
  flex-direction: column;
  z-index: 2;
  text-align: center;
  padding-bottom: 2rem;

`;

export const ContentComponent = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

`;

export const SelectItemComponent = styled.span`
  padding: .5rem 1rem .5rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid ${globStyle.white};
  white-space: wrap;
  display: flex;
  justify-content: space-between;
  font-family: ${globStyle.font};
  flex: 1;
  max-width: 100%;

  &.react-dropdown-select-item-active {
    border-bottom: 1px solid ${globStyle.white};
    ${({ disabled, color }) => !disabled && color && `background: ${hexToRGBA(color, 0.1)};`}
  }

  :hover,
  :focus {
    background: ${globStyle.grey5};
    outline: none;
  }

  &.react-dropdown-select-item-selected {
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
`;

export const TextComponent = styled.span`
  overflow: wrap;
  white-space: wrap;
  flex-wrap: wrap;
  max-width: 100%;

`;


export const SelectLabel = styled.label`
width: 100%;
padding: 0;
margin-bottom: 1rem;
font-size: ${props => props.theme.fontSize.sz2};
font-family: ${props => props.theme.font.primary};
color: ${props => props.theme.bg.septenary};

`;
// ************************************
// ************************************

// ButtonGroup
// ************************************
// ************************************
export const ButtonGroupContainer = styled.div`
  background: transparent;
  align-items: start;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding-bottom: 2rem;

`;



// ************************************
// ************************************

export const StyledErrorMessage = styled.div`

`;

// date picker
// ************************************
// ************************************

const sharedTimePickerContainerStyle = css`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
`

export const TimePickerContainer = styled.div`
  ${sharedTimePickerContainerStyle}
  justify-content: center;
  width: 100%;
  
  padding-top: 0.5rem;
  flex-direction: row;
`;

export const TimePickerErrorComponent = styled.span`
  color: ${props => props.theme.bad};
  font-size: ${props => props.theme.fontSize.sz4};
  font-weight: 600;
  margin-top: .25rem;
`;

export const StopTimePickerContainer = styled.div`
  ${sharedTimePickerContainerStyle}
  justify-content: flex-start;
  padding-bottom:2rem;
  width: 100%;
  font-size: ${props => props.theme.fontSize.sz2};
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.bg.septenary};
`;

export const StyledTimePickerField = styled(TimePickerField)`

`;


export const SwitchLabel = styled.label`

`;

export const DatePickerLabel = styled.label`
  font-size: ${props => props.theme.fontSize.sz4};
  font-family: ${props => props.theme.font.primary};
  color: ${props => props.theme.bg.septenary};

  // flex-grow: 1;
  // flex-basis: 12rem;

  line-height: 2.5rem;
  width: 7rem;
  margin-right: 1rem;
`;
// ************************************
// ************************************



// bottom buttons
// ************************************
// ************************************
export const FormButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: transparent;
    width: 100%;
  justify-content: center;
`;

export const FormButton = styled.button`


`;
// ************************************
// ************************************
