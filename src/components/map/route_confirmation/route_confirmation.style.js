import styled from 'styled-components'


export const TaskStatisticsContainer = styled.div`
    position: absolute;
    display: flex;

    flex-direction: column;
    align-items: center;

    top: ${props => props.yPosition};
    left: ${props => props.xPosition};

    min-width: 5rem;
    max-width: 20rem;
    padding: .1rem;

    background: red;
    border-radius: .5rem;
    box-shadow: 0 0.1rem 0.2rem 0rem #303030;
    background-color: rgba(255, 255, 255, 0.9);

    overflow: hidden;

    &:hover{
      background-color: ${props =>props.theme.bg.secondary}
    }

`
export const TaskNameText = styled.span`
    margin-bottom: 0rem;
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
    font-weight: bold;

    overflow-wrap: break-word;
    align-items: center;
    box-align: center;
    width: 100%;
    height: 100%;
    word-break: break-word;
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

export const TaskIcon = styled.i`
    margin-bottom: .2rem;
`

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center
`
