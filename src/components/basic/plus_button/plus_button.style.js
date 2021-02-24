import styled from "styled-components";
import { globStyle } from "../../../global_style";

export const PlusSymbol = styled.i`
  display: flex;
  flex-direction: row;
  flex-basis: 5rem;
  flex-shrink: 0;

  color: ${(props) =>
    props.disabled ? props.theme.bg.senary : props.theme.bg.octonary};
  height: 2rem;
  width: 2rem;
  margin: none;
  padding: none;
  font-size: 2rem;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  line-height: 2rem;

  transform: translate(-0.52rem, -0.16rem);
`;

export const PlusButton = styled.button`
  width: 2rem;
  height: 2rem;
  margin: 0.25rem;
  margin-top: 0.2rem;
  background-color: transparent;
  border: none;
  text-align: center;
  box-sizing: border-box;

  :focus {
    outline: 0;
  }
`;
