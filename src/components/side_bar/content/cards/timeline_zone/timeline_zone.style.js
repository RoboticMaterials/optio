import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  color: ${(props) => props.theme.bg.octonary};
`;
export const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background: green;
  padding: 1rem;
  background: ${(props) => props.theme.bg.quaternary};
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
`;

export const ProcessHeader = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.bg.quaternary};
`;

export const ProcessContainer = styled.div`
  margin-bottom: 1rem;
  border-radius: 1rem;
  overflow: hidden;
`;

export const ProcessBody = styled.div`
  background: ${(props) => props.theme.bg.quinary};
  padding: 1rem;
`;

export const ProcessTitle = styled.span``;
