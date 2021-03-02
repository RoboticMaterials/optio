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
    border-bottom: 0.1rem solid ${props => props.theme.bg.septenary};
    margin-bottom: 1rem;
  	border-top: ${props => props.showTopBorder && `0.1rem solid ${props.theme.bg.septenary}`};
  	margin-top: ${props => props.showTopBorder && `1rem`};
  
  	width: 100%;
  flex: 1;
  
  	padding: 1rem .5rem;
  	//flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  	
`

export const TaskContainer = styled.div`
    background-color: ${props => props.theme.bg.tertiary};
    border-radius: 1rem;
  overflow: auto;

`
