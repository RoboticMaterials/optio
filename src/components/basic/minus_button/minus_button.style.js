import styled from "styled-components";

export const MinusSymbol = styled.i`
  color: ${(props) =>
    props.disabled ? props.theme.bg.senary : props.theme.bg.octonary};
  height: 1.6rem;
  width: 1.6rem;
  margin: none;
  padding: none;
  font-size: 1.6rem;
  vertical-align: middle;
  line-height: 1.6rem;
`;

export const MinusButton = styled.button`
  width: 1.6rem;
  height: 1.6rem;
  margin: 0.2rem;
  padding: 0;
  background-color: transparent;
  border: none;
  text-align: center;
  box-sizing: border-box;

  :focus {
    outline: 0;
  }
`;
