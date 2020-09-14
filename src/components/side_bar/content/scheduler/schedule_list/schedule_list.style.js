import styled from 'styled-components'



export const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 100%;
    padding: 1rem;
    padding-top: 1.5rem;

    
`



export const TaskListContainer = styled.div`
    padding: 1rem;
    overflow-y: scroll;
    flex: 1;

    // hide scroll bar
	::-webkit-scrollbar {
		width: 0px;  /* Remove scrollbar space */
		background: transparent;  /* Optional: just make scrollbar invisible */
	}
	::-webkit-scrollbar-thumb {
		background: #FF0000;
	}
`

export const ListEmptyContainer = styled.div`
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`

export const ListEmptyTitle = styled.h2`
	font-size: ${props => props.theme.fontSize.sz2};
	font-weight: 600;
	text-align: center;
	margin-top: 5rem;
	color: ${props => props.theme.bg.octonary};
	font-family: ${props => props.theme.font.primary};
`

export const ListEmptyFiller = styled.div`
	display: flex;
	flex: 1;
	justify-content: center;
	align-items: flex-start;
`

export const ListItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    // width: 100%;
    align-items: center;

`

export const WarningIcon = styled.i`
    margin-right: 2rem;
    color: ${props => props.theme.bad};
    z-index: 10;


`
