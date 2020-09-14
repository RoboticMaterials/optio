import styled, { css } from 'styled-components'
import * as style from '../devices_content.style'
import * as styles from '../../settings/settings.style'

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

export const DeviceIcon = styled.i`
	position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${props => props.theme.bg.octonary};
	font-size: 7rem;
`