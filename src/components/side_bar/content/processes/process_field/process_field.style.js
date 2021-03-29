import styled from 'styled-components'
import {Form} from "formik";

import * as stylec from '../../content_list/content_list.style'

export const ListItemTitle = styled(stylec.ListItemTitle)`
`

export const ListItemIcon = styled(stylec.ListItemIcon)`
`

export const ListItemRect = styled(stylec.ListItemRect)`
`

export const ListItem = styled(stylec.ListItem)`
`

export const Container = styled(stylec.Container)`
	overflow: hidden;
`

export const ListItemIconContainer = styled(stylec.ListItemIconContainer)`

`

export const Title = styled.h1`
    font-family: ${props => props.theme.font.primary};
    font-size: 1.5rem;
    font-weight: 500;
    color: ${props => props.theme.schema[props.schema].solid};
    user-select: none;
`

export const InfoText = styled.span`
  font-family: ${props => props.theme.font.primary};
  font-size: ${props => props.theme.fontSize.sz3};
  color: ${props => props.theme.bg.octonary};
`

export const SectionContainer = styled.div`
	margin-bottom: 1rem;
	margin-top: 0.5rem;
	width: 100%;

  position: relative;
	display: flex;
  flex-direction: column;
  flex-grow: 1;

  align-content: flex-end;
  align-items: stretch;
  justify-content: center;

	overflow-y: auto;
	overflow-x: hidden;

  // box-shadow: ${props => props.theme.cardShadow};
  background: ${props => props.theme.bg.secondary};
  border-radius: 0.4rem;
`

export const TaskContainer = styled.div`
    background-color: ${props => props.theme.bg.secondary};
    border-radius: 0.4rem;
    overflow: auto;
    // box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.1);
    scrollbar-color: light;
    scrollbar-width: thin;
`

export const SVGText = styled.text`
  font-family: ${props => props.theme.font.primary};
  font-size: 1.3rem;
  font-weight: 500;
  transform-origin: center;
`
