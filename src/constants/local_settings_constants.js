import {isBrowser} from "react-device-detect";

export const defaultLocalSettings = {
	non_local_api_ip: '10.0.0.186',
	non_local_api: true,
	mapViewEnabled: isBrowser,
	toggleDevOptions:false,
	currentMapId: null,
}
