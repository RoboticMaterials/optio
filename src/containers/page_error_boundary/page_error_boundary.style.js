import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    position: fixed;
`;

export const Label = styled.h1`
  font-size: 2rem;
  color: grey
`

export const ReloadButton = styled.button`
  margin-top: .5rem;
`

export const Text = styled.span`
  font-size: 12px;

`