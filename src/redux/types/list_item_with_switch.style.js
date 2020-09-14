import styled from 'styled-components'


export const Container = styled.button`
    display: flex;
    flex-direction: row;
    background: ${props =>  props.theme.colors.background.primary};

    border-style: solid;
    border-width: 2px 0px 0px 0px;
    border-top-color: black;
    align-items: center;
    justify-content: space-between;
    padding: .5rem 3rem .5rem .5rem;
    position: relative;
    margin-right: 1rem;

    outline: none !important;
    outline-offset: none !important;

`

export const ContentContainer = styled.button`
  display: flex;
  flex-direction: column;
  background: ${props =>  props.theme.colors.background.primary};
  align-items: flex-start;
  justify-content: center;
  border-width: 0;



`

export const Title = styled.h4`
  font-size: 1.1;
  font-weight: bold;
`
export const Subtitle = styled.h5`
  font-size: 1rem;
  font-weight: 100;
`;

export const SwitchContainer = styled.div`
    display: flex;
    flex-direction: row;

    align-items: center;

`

export const SelectedIcon = styled.div`
    width: 0;
    height: 0;
    border-top: 1.5rem solid transparent;
    border-bottom: 1.5rem solid transparent;
    border-right: 1rem solid ${props =>  props.theme.colors.background.senary};
    position: absolute;
    top: 50%;
    right: -1rem;
    transform: translate(0, -50%);
`
