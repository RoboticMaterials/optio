import styled from "styled-components";

export const Container = styled.div`
	overflow: hidden;
	position: relative;
	height: 100%;
	display: flex;
	flex-direction: column;
	width: 100%;
	flex: 1;
	min-height: 100%;
	max-height: 100%;
	transition: all 2s ease;
`

export const ProcessesContainer = styled.div`
	overflow: auto;
	width: 100%;
	height: 100%;
	position: relative;
	transition: all 2s ease;
`

export const ZoneContainer = styled.div`
    display: flex;
    align-items: center;
    
    background: ${props => props.theme.bg.primary};
    box-shadow: ${props => props.theme.cardShadow};
    margin: 1.5rem;
    border-radius: 0.5rem;

    overflow-x: scroll;

    /* Let's get this party started */
    ::-webkit-scrollbar {
        height: 8px;
    }
    /* Track */
    ::-webkit-scrollbar-track {
        -webkit-background: rgba(0,0,0,0.1);
        -webkit-border-radius: 10px;
        border-radius: 10px;
        &:hover {
            background: rgba(0,0,0,0.1);
        }
    }
    /* Handle */
    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.2);
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        // background: rgba(255,255,255,0.2);
    }
`

export const ProcessHeader = styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;
`

export const ProcessName = styled.h3`
    padding: 0;
    margin: 0;
    margin: 0 2rem;
    font-size: ${props => props.theme.fontSize.sz3};
    color: ${props => props.theme.schema.lots.solid};
    text-align: center;
    width: 5rem;
    min-width: 8rem;
    
    overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
   -webkit-box-orient: vertical;
`

export const ProcessStat = styled.div`
    font-size: ${props => props.theme.fontSize.sz4};
    color: ${props => props.theme.bg.quinary};

    display: flex;
    
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
   -webkit-box-orient: vertical;
`

export const Info = styled.i`
    font-size: 0.6rem;
    margin-right: 0.2rem;
    color: ${props => props.theme.bg.quaternary};
    cursor: pointer;
`

export const ToolTipText = styled.div`
    font-size: ${props => props.theme.fontSize.sz4};
    text-align: left;
    max-width: 20rem;
`

export const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const CycleTimeText = styled.h3`
    font-size: ${props => props.theme.fontSize.sz4};

`