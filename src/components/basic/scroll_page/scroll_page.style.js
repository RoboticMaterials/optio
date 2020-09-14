import styled from 'styled-components';

import {globStyle} from '../../../global_style';
import { hexToRGBA, LightenDarkenColor, RGB_Linear_Shade } from '../../../methods/utils/color_utils';

const green = 'rgb(0, 230, 0)'

// dropdown
// ************************************
// ************************************
export const Container = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;



  flex-direction: column;
  justify-content: center;
  padding: 0;
  position: relative;
  height: 100%;


  /*
  border-width: 0;
  border-left-width: 1px;
  border-color: ${globStyle.grey5};
  border-style: solid;

  box-shadow: 0 0 10px 0 ${() => hexToRGBA('#000000', 0.2)};
  width: 100%;
  */


  background: ${props => props.theme.bg.primary};

  /* background: magenta;
  padding: 1rem; */

`;

export const BackButton = styled.i`
  font-size: ${props => props.theme.fontSize.sz1};
  &:hover {color: ${props => props.theme.fg.primary}}
`;


export const HeaderContainer = styled.div`
  background: white;
  display: flex;
  height: 4rem;
  align-items: center;
  justify-content: space-around;


  width: 100%;
  padding: 0;
  margin: 0;
`;

export const TitleContainer = styled.div`

`;






export const Title = styled.h3`
  font-family: ${props => props.theme.font.primary};
  font-weight: 600;
  font-size: ${props => props.theme.fontSize.sz3};
  padding: 0;
  margin: 0;
  display: flex;
`;

export const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    z-index: 2;
    text-align: center;
    min-width: 100%;
    padding: 0;
    flex: 1;
    max-width: 100%;
    /* padding: 1rem;
    background: green; */


`;

export const ReactDropdownSelectComponent = styled.div`

  font-family: ${props => props.theme.font.primary};
  font-weight: 1000;
  font-size: ${props => props.theme.fontSize.sz2};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  vertical-align: middle;
  line-height: 2rem;
  :focus,
  :focus-within {
      color: ${globStyle.black};
      background-color: ${globStyle.grey5};
      box-shadow: none;

  }

  /* max-width: 100%;
  padding: 1rem;
  background: magenta; */

`;

export const ContentComponent = styled.div`
    padding: 1rem;
    text-align: center;
`;

export const ClickOutsideComponent = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;

    max-width: 100%;
`;



export const NoDataComponent = styled.div`

`;

export const DropDownContainer = styled.div`
    display: flex;
    flex: 1;
    /* max-width: 100%; */
    /* padding: 1rem;
    background: cyan; */
`;

export const DropDownComponent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${globStyle.grey3};
    overflow: auto;
    z-index: 1;
    width: 100%;
    background-color: white;

    font-family: ${props => props.theme.font.primary};
    font-weight: 300;
    font-size: ${props => props.theme.fontSize.sz3};

    /* max-width: 100%;
    padding: 1rem;
    background: blue; */

`;
