import styled from "styled-components";

// export const RouteContainer = styled.div`
//     display: flex;
//     flex: 1;
//     flex-direction: column;
//     background: yellow;
// `

export const RotatedRouteName = styled.span`
	transform: rotate(-90deg);
`

export const StationContainer = styled.div`
    flex-direction: column;
    display: flex;
    flex: 1;
    background: red;
    width: ${props => props.isCollapsed ? "auto" : "15rem"};
    max-width: ${props => props.isCollapsed ? "auto" : "15rem"};
    min-width: ${props => props.isCollapsed ? "auto" : "15rem"};
    margin-right: 1rem;
    padding: 1rem;
`

export const StationHeader = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    background: yellow;
    padding: 1rem;
    
`
export const TitleContainer = styled.div`
	display: flex;
	flex-direction: column;
`

export const LabelContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

export const LabelTitle = styled.span`
    background: cyan;
    text-align: center;
    margin-right: 1rem;
`

export const LabelValue = styled.span`
    background: cyan;
    text-align: center;
`

export const StationButton = styled.button`

`