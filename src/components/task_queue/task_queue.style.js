import styled, {css} from 'styled-components';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
// `

export const Header = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	/* box-shadow: 2px 2px 10px black; */
	padding: 1rem;
	padding-top: 1.5rem;
	/* background-color: ${props => props.theme.bg.quinary}; */
    justify-content: space-between;
`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 2rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
`

export const ClearIcon = styled(DeleteForeverIcon)`

`

export const ListContainer = styled.div`
	width: 100%;
	flex: 1;

    padding: 1rem;
    padding-top: 1.5rem;

	overflow: auto;
	
	// optionally style scroll bar
	::-webkit-scrollbar {
	}
	::-webkit-scrollbar-thumb {
	}
`