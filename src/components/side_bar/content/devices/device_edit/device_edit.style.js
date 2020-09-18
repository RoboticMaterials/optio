import styled, { css } from 'styled-components'
import * as style from '../devices_content.style'
import * as styles from '../../settings/settings.style'
import * as stylel from '../../locations/locations_content.style'

export const SettingsContainer = styled(style.SettingsContainer)`
`

export const SettingsSectionsContainer = styled(style.SettingsSectionsContainer)`
`

export const SettingsLabel = styled(style.SettingsLabel)`
    margin-bottom: 1rem;
`

export const RowContainer = styled(style.RowContainer)`
`

export const ConnectionButton = styled(styles.ConnectionButton)`
`

export const ConnectionIcon = styled(styles.ConnectionIcon)`
`

export const LocationTypeGraphic = styled(stylel.LocationTypeGraphic)`
`

export const LocationTypeButton = styled(stylel.LocationTypeButton)`
`

export const DeviceIcon = styled.i`
    color: ${props => props.theme.bg.octonary};
	font-size: 3rem;
`

export const ConnectionText = styled.p`
    color: ${props => props.theme.bg.octonary};
    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};
`