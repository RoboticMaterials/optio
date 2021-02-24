import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  padding: 1rem;
  padding-top: 1.5rem;
`;
export const NextExecution = styled.h2`
  font-size: ${(props) => props.theme.fontSize.sz3};
  font-weight: 100;
  text-align: center;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  color: ${(props) => props.theme.schema["scheduler"].solid};
  font-family: ${(props) => props.theme.font.primary};

  border: 0.2rem solid;
  border-radius: 1rem;
  border-color: ${(props) => props.theme.bg.octonary};

  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  &:hover {
    cursor: pointer;
    border-color: ${(props) => props.theme.schema["scheduler"].solid};
    color: ${(props) => props.theme.schema["scheduler"].solid};
  }
`;

export const TaskListContainer = styled.div`
  padding: 1rem;
  overflow-y: scroll;
  flex: 1;

  // hide scroll bar
  ::-webkit-scrollbar {
    width: 0px; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  ::-webkit-scrollbar-thumb {
    background: #ff0000;
  }
`;

export const ListEmptyContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const ListEmptyTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSize.sz2};
  font-weight: 600;
  text-align: center;
  margin-top: 5rem;
  color: ${(props) => props.theme.bg.octonary};
  font-family: ${(props) => props.theme.font.primary};
`;

export const ListEmptyFiller = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
`;

export const ListItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  // width: 100%;
  align-items: center;
`;

export const WarningIcon = styled.i`
  margin-right: 2rem;
  color: ${(props) => props.theme.bad};
  z-index: 10;
`;
