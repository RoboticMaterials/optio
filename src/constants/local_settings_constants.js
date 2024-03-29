import { isMobile } from "react-device-detect";


export const defaultLocalSettings = {
    non_local_api_ip: '',
    non_local_api: false,
    mapViewEnabled: isMobile ? false : true,
    toggleDevOptions: false,
    currentMapId: null,
    authenticated: null,
    refreshToken: null,
    accessToken: null,
}
