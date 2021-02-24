import styled from "styled-components";
import AddBoxIcon from "@material-ui/icons/AddBox";

export const Container = styled.button`
  width: 80%;
  height: 5rem;
  min-height: 5rem;
  background: ${(props) => props.theme.bg.primary};
  border-radius: 1rem;

  border: 3px solid ${(props) => props.theme.bg.secondary};
  color: ${(props) => props.theme.bg.secondary};

  &:focus {
    outline: none;
  }
`;

export const StyledAddBoxIcon = styled(AddBoxIcon)`
  // font-size: ${(props) => props.theme.font.fontSize.sz1};
  font-size: 2rem;
  height: 2rem;
`;
