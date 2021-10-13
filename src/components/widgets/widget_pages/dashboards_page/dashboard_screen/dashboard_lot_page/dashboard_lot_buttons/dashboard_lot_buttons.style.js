import styled from "styled-components";

export const ButtonContainer = styled.div`

    width: 95%;
    max-width: 50rem;
    align-self: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const QuantityText = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  font-family: ${props => props.theme.font.primary};
  justify-content: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
`
export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: .5rem;
`

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justifyContent: center;
  margin-top: .5rem;
`
