import {isBrowser} from "react-device-detect";

export const defaultLocalSettings = {
	non_local_api_ip: '18.220.200.169',
	non_local_api: true,
	mapViewEnabled: isBrowser,
	toggleDevOptions:false,
	currentMapId: null,
	authenticated: null
}
