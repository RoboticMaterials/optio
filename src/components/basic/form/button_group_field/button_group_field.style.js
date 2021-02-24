import styled, { css } from "styled-components";

export const Container = styled.div`
  // border-width: thin;
  // border-style: solid;
  // border-color: ${(props) => (props.hasError ? "red" : "transparent")};
  // box-shadow:  ${(props) => props.hasError && "0 0 5px red"};
  width: 100%;
`;

export const StyledLabel = styled.label`
  background: pink;
  height: 3rem;
`;

export const ErrorContainerComponent = styled.div`
  // position: relative;
  // width: auto;
  // height: auto;
  // margin-left: 1rem;
  left: 50%;
  // right: 1rem;
  transform: translateX(50%);
`;

// export const DefaultButtonViewErrorCss = css`
//     border-color: ${props => props.hasError && "red"};
//     box-shadow:  ${props => props.hasError && "0 0 5px red"};
// `;
