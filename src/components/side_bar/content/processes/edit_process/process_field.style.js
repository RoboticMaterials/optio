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

export const SectionContainer = styled.div`
    border-bottom: 0.1rem solid ${props => props.theme.bg.septenary};
    margin-bottom: 1rem;
`

export const TaskContainer = styled.div`
    background-color: ${props => props.theme.bg.tertiary};
    border-radius: 1rem;

`
