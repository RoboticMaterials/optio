import styled from 'styled-components'


export const TaskStatisticsContainer = styled.div`
    position: absolute;
    display: flex;

    flex-direction: column;
    align-items: center;

    top: ${props => props.yPosition};
    left: ${props => props.xPosition};

    min-width: 5rem;
    max-width: 24rem;
    padding: .1rem;

    background: red;
    border-radius: .5rem;
    box-shadow: 0 0.1rem 0.2rem 0rem #303030;
    background-color: rgba(255, 255, 255, 0.9);

    overflow: hidden;

`

export const TaskNameContainer = styled.div`
  	flex: 1;
  	display: flex;
  	justify-content: first baseline;
    flex-direction: column;
    overflow: hidden;
    text-overflow: ellipsis;

    max-height: 4rem;
`

export const TaskText = styled.p`
    align-self: center;
    text-align: center;
    margin-left: .25rem;
    margin-top: auto;
    margin-bottom: auto;
    font-family: ${props => props.theme.font.primary};
    color: #2ed182;
    align-text: center;
    white-space: break-spaces;
`


export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;


    &:hover{
      background-color: ${props =>props.theme.bg.secondary};
    }
`
