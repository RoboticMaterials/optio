import styled from "styled-components";
import * as style from "../../dashboard_list/DashboardsList.style.js";

export const AddButton = styled(style.AddButton)`
  border: none;
  /* background: ${(props) => props.theme.bg.quaternary}; */
  font-family: ${(props) => props.theme.font.primary};
  font-size: ${(props) => props.theme.fontSize.sz3};
  font-weight: bold;
  min-height: 5rem;

  &:active {
    filter: brightness(85%);
  }
`;

export const AddContainer = styled(style.AddContainer)`
  padding-bottom: 1rem;
`;

export const Container = styled(style.Container)`
  white-space: nowrap;
`;
export const MenuButton = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  background-color: none;

  &:hover {
    cursor: pointer;
  }
`;
export const AddButtonContainer = styled(style.AddButtonContainer)``;

export const EditField = styled.input`
  flex-grow: 8;
`;

export const EditButton = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  background-color: none;

  &:hover {
    cursor: pointer;
  }
`;

export const ConditionText = styled.p`
  /* background: ${(props) => props.theme.bg.quinary}; */
  color: ${(props) => props.theme.bg.tertiary};
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  padding-left: 3.5rem;
  overflow: hidden;
  white-space: nowrap;
  font-size: ${(props) => props.theme.fontSize.sz5};
`;
export const RowConatiner = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
export const ColorPicker = styled.div`
  display: flex;
  flex-grow: 0;
  right: 0rem;
`;

export const ColorButton = styled(style.AddButton)`
  background: ${(props) => props.theme.bg.quaternary};
`;
