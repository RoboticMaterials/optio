import styled from "styled-components";

export const SideBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 6rem;
  margin-top: 0rem;

  transition: width 0.25s ease-in-out;

  @media (max-width: ${(props) => props.theme.widthBreakpoint.tablet}) {
    width: 4.5rem;
  }
`;
