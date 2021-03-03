import ls from 'local-storage'

export const defaultLocalSettings = {
	non_local_api_ip: '',
	non_local_api: false,
	mapViewEnabled: ls.get('MapViewEnabled'),
	toggleDevOptions:false,
	currentMapId: null,
	authenticated: null,
	refreshToken: null,
	accessToken: null
}
