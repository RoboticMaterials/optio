import {isBrowser} from "react-device-detect";

export const defaultLocalSettings = {
	non_local_api_ip: '',
	non_local_api: false,
	mapViewEnabled: isBrowser,
	toggleDevOptions:false,
	currentMapId: null,
	MiRMapEnabled: false
}
